import { useState, useEffect } from 'react';
import imageManager, { getAllImagePaths } from '../utils/imageManager';

/**
 * Hook para usar imagens com fallback e loading state
 * @param {string} imagePath - Caminho da imagem
 * @param {string} fallback - Imagem de fallback
 * @returns {object} - Estado da imagem e funções
 */
export const useImage = (imagePath, fallback) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (!imagePath) {
      setImageSrc(fallback || imageManager.default.nftPlaceholder);
      setImageLoaded(true);
      return;
    }

    setImageLoaded(false);
    setImageError(false);

    const img = new Image();

    img.onload = () => {
      setImageSrc(imagePath);
      setImageLoaded(true);
      setImageError(false);
    };

    img.onerror = () => {
      setImageSrc(fallback || imageManager.default.nftPlaceholder);
      setImageLoaded(true);
      setImageError(true);
    };

    img.src = imagePath;
  }, [imagePath, fallback]);

  return {
    src: imageSrc,
    loaded: imageLoaded,
    error: imageError
  };
};

/**
 * Hook para precarregar imagens
 * @param {string[]} imagePaths - Array de caminhos de imagem
 * @returns {object} - Estado do preload
 */
export const useImagePreloader = (imagePaths = []) => {
  const [preloadStatus, setPreloadStatus] = useState({
    loading: false,
    loaded: false,
    error: null,
    progress: 0
  });

  useEffect(() => {
    if (imagePaths.length === 0) return;

    setPreloadStatus({
      loading: true,
      loaded: false,
      error: null,
      progress: 0
    });

    let loadedCount = 0;
    const totalImages = imagePaths.length;

    const updateProgress = () => {
      loadedCount++;
      const progress = (loadedCount / totalImages) * 100;

      setPreloadStatus(prev => ({
        ...prev,
        progress
      }));

      if (loadedCount === totalImages) {
        setPreloadStatus(prev => ({
          ...prev,
          loading: false,
          loaded: true
        }));
      }
    };

    // Preload each image individually to track progress
    const imagePromises = imagePaths.map(path => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          updateProgress();
          resolve(true);
        };
        img.onerror = () => {
          updateProgress();
          resolve(false);
        };
        img.src = path;
      });
    });

    Promise.allSettled(imagePromises).then((results) => {
      const errors = results.filter(result => result.value === false);

      if (errors.length > 0) {
        setPreloadStatus(prev => ({
          ...prev,
          error: `Failed to load ${errors.length} images`,
          loading: false,
          loaded: true
        }));
      }
    });

  }, [imagePaths]);

  return preloadStatus;
};

/**
 * Hook para precarregar todas as imagens do projeto
 * @returns {object} - Estado do preload global
 */
export const useGlobalImagePreloader = () => {
  const allImagePaths = getAllImagePaths();
  return useImagePreloader(allImagePaths);
};

/**
 * Hook para acessar as imagens organizadas por categoria
 * @returns {object} - Todas as categorias de imagem
 */
export const useImages = () => {
  return imageManager;
};

export default {
  useImage,
  useImagePreloader,
  useGlobalImagePreloader,
  useImages
};
