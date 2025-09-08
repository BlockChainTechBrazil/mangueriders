// Hook personalizado
import { useState, useEffect } from 'react';
import imageManager from '../utils/imageManager';

// Mapeamento dos IDs dos personagens para as imagens do gerenciador
const getCharacterImagePaths = () => ({
  ryder: imageManager.game.characters.charFire,
  vega: imageManager.game.characters.charRaio,
  tyranotron: imageManager.game.characters.charEarth,
  raptoraX: imageManager.game.characters.charWater,
  aeroBlast: imageManager.game.characters.charAir
});

// Prefetching das imagens para garantir que carregem
const preloadImages = (characterPaths: Record<string, string>) => {
  Object.values(characterPaths).forEach(path => {
    const img = new Image();
    img.src = path;
  });
};

export const useCharacterImages = () => {
  const characterPaths = getCharacterImagePaths();
  const [images, setImages] = useState<Record<string, string>>(characterPaths);

  useEffect(() => {
    // Pré-carregar as imagens
    preloadImages(characterPaths);

    // Verificar a existência e fazer logging
    Object.entries(characterPaths).forEach(([id, path]) => {
      fetch(path)
        .then(response => {
          if (!response.ok) {
            console.error(`Erro ao carregar imagem para ${id}: ${path}`);
          } else {
            console.log(`Imagem para ${id} carregada com sucesso: ${path}`);
          }
        })
        .catch(error => {
          console.error(`Erro ao carregar imagem para ${id}: ${path}`, error);
        });
    });

    // Armazenar no estado
    setImages(characterPaths);
    console.log("Caminhos das imagens dos personagens:", characterPaths);
  }, []);

  return images;
};
