import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from 'framer-motion';
import { Vector3 } from 'three';

// Hook para animações com base no scroll
export const useScrollAnimation = (scrollContainer) => {
  const { scrollYProgress } = useScroll({
    container: scrollContainer
  });

  return { scrollYProgress };
};

// Hook para animações flutuantes em elementos 3D
export const useFloatingAnimation = (ref, options = {}) => {
  const {
    speed = 1,
    intensity = 1,
    rotationSpeed = 0.2,
    rotationAxis = 'y'
  } = options;

  const initialPosition = useRef(null);

  useEffect(() => {
    if (ref.current && !initialPosition.current) {
      initialPosition.current = new Vector3().copy(ref.current.position);
    }
  }, [ref]);

  useFrame((_, delta) => {
    if (ref.current && initialPosition.current) {
      // Animação flutuante no eixo Y
      ref.current.position.y = initialPosition.current.y + Math.sin(Date.now() * 0.001 * speed) * intensity * 0.1;

      // Rotação suave
      if (rotationAxis === 'y') {
        ref.current.rotation.y += delta * rotationSpeed;
      } else if (rotationAxis === 'x') {
        ref.current.rotation.x += delta * rotationSpeed;
      } else if (rotationAxis === 'z') {
        ref.current.rotation.z += delta * rotationSpeed;
      }
    }
  });
};

// Hook para interatividade com o mouse em objetos 3D
export const useMouseInteraction = (ref, options = {}) => {
  const {
    hoverColor = '#FFCC00',
    originalColor = '#FF5A00',
    hoverScale = 1.1
  } = options;

  const originalScale = useRef(null);

  useEffect(() => {
    if (ref.current && !originalScale.current) {
      originalScale.current = ref.current.scale.clone();
    }
  }, [ref]);

  const handlePointerOver = () => {
    if (ref.current) {
      ref.current.material.color.set(hoverColor);
      ref.current.scale.multiplyScalar(hoverScale);
    }
  };

  const handlePointerOut = () => {
    if (ref.current && originalScale.current) {
      ref.current.material.color.set(originalColor);
      ref.current.scale.copy(originalScale.current);
    }
  };

  return {
    pointerEvents: {
      onPointerOver: handlePointerOver,
      onPointerOut: handlePointerOut
    }
  };
};

// Hook para detectar a visibilidade de objetos 3D na câmera
export const useViewportVisibility = (ref, options = {}) => {
  const {
    onEnter,
    onExit,
    threshold = 0.5
  } = options;

  const isVisible = useRef(false);

  useFrame(({ camera }) => {
    if (ref.current) {
      const distance = ref.current.position.distanceTo(camera.position);
      const isCurrentlyVisible = distance < threshold * 20;

      if (isCurrentlyVisible !== isVisible.current) {
        isVisible.current = isCurrentlyVisible;

        if (isCurrentlyVisible && onEnter) {
          onEnter();
        } else if (!isCurrentlyVisible && onExit) {
          onExit();
        }
      }
    }
  });

  return { isVisible: isVisible.current };
};
