// @ts-nocheck
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface ExplosionEffectProps {
  position: [number, number, number];
  onComplete: () => void;
  duration?: number;
  maxScale?: number;
}

const ExplosionEffect: React.FC<ExplosionEffectProps> = ({
  position,
  onComplete,
  duration = 500, // ms
  maxScale = 2.5,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
  const startTime = useRef(Date.now());

  useFrame(() => {
    const elapsedTime = Date.now() - startTime.current;
    const progress = Math.min(elapsedTime / duration, 1);

    if (meshRef.current && materialRef.current) {
      const scaleProgress = Math.sin(progress * Math.PI); // Efeito de pulsar para a escala
      const currentScale = scaleProgress * maxScale;
      meshRef.current.scale.set(currentScale, currentScale, currentScale);

      // Interpolar cor de amarelo para laranja/vermelho e depois transparente
      if (progress < 0.5) {
        materialRef.current.color.setRGB(
          1, // R (amarelo)
          1 - progress * 2, // G (diminui de 1 para 0)
          0  // B (sempre 0)
        );
        materialRef.current.opacity = 1;
      } else {
        materialRef.current.color.setRGB(
          1, // R (laranja/vermelho)
          0.5 - (progress - 0.5), // G (diminui de 0.5 para 0)
          0  // B
        );
        materialRef.current.opacity = 1 - (progress - 0.5) * 2;
      }
      materialRef.current.emissive.set(materialRef.current.color);
      materialRef.current.emissiveIntensity = 0.5 + progress * 2; // Aumenta o brilho com o progresso
    }

    if (progress >= 1) {
      onComplete();
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <Sphere args={[0.3, 16, 16]}> {/* Raio base menor para a explosão */}
        <meshStandardMaterial
          ref={materialRef}
          color="yellow" // Cor inicial
          transparent
          opacity={1}
          emissive="yellow"
          emissiveIntensity={0.5}
        />
      </Sphere>
    </mesh>
  );
};

export default ExplosionEffect;
