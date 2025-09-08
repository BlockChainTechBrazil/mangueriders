// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
// A tipagem é definida no arquivo react-three-fiber.d.ts

// Pré-carregar o modelo da bomba
useGLTF.preload('/models/structures/Bomb.glb');

interface BombProps {
  position: [number, number, number];
  timeToExplode?: number; // Tempo em ms até explosão, se fornecido
}

const Bomb: React.FC<BombProps> = ({ position, timeToExplode = 3000 }) => {
  // Referência para o grupo principal da bomba
  const bombRef = useRef<THREE.Group>(null);
  // Carrega o modelo 3D da bomba
  const { scene } = useGLTF('/models/structures/Bomb.glb');

  // Estado para controlar a animação de pulsação
  const pulseState = useRef({
    time: 0,
    intensity: 1.0,
    speed: 3.0 // Velocidade da pulsação
  });

  // Estado para controlar o tempo até a explosão
  const [remainingTime, setRemainingTime] = useState(timeToExplode);

  // Efeito para configurar o modelo
  useEffect(() => {
    if (scene) {
      // Configurações do modelo
      scene.scale.set(1, 1, 1); // Ajusta o tamanho da bomba

      // Percorre os materiais para ajustar propriedades se necessário
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });

      // Clone o modelo para evitar conflito com outras instâncias
      const clonedScene = scene.clone();

      // Adiciona o modelo clonado ao grupo
      if (bombRef.current) {
        bombRef.current.add(clonedScene);
      }
    }

    // Cria temporizador para controlar o tempo restante para explosão
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        // Aumenta a velocidade de pulsação conforme se aproxima da explosão
        if (prev < 1000) {
          pulseState.current.speed = 8.0;
        } else if (prev < 2000) {
          pulseState.current.speed = 5.0;
        }
        return prev - 100;
      });
    }, 100);

    return () => {
      clearInterval(timer);
      // Limpa recursos ao desmontar
      if (bombRef.current) {
        while (bombRef.current.children.length) {
          bombRef.current.remove(bombRef.current.children[0]);
        }
      }
    };
  }, [scene]);

  // Animação de pulsação
  useFrame((state, delta) => {
    if (bombRef.current) {
      // Atualiza o tempo para animação de pulsação
      pulseState.current.time += delta * pulseState.current.speed;

      // Calcula fator de pulsação com base no seno (entre 0.9 e 1.1)
      const pulseFactor = 1.0 + Math.sin(pulseState.current.time) * 0.1;      // Aplica o fator de pulsação à escala da bomba
      bombRef.current.scale.set(
        pulseFactor * 0.4,
        pulseFactor * 0.4,
        pulseFactor * 0.4
      );

      // Rotação suave para efeito visual adicional
      bombRef.current.rotation.y += delta * 0.2;
    }
  });
  
  // Ajustamos a posição Y da bomba para ficar mais próxima do solo
  const adjustedPosition: [number, number, number] = [
    position[0],
    position[1] - 0.25, // Aproximamos a bomba do solo
    position[2]
  ];
  return (
    <group ref={bombRef} position={adjustedPosition} />
  );
};

export default Bomb;