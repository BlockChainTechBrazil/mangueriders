// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CellType } from './types';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

// Definir as props específicas do nosso componente PowerUp
interface PowerUpCustomProps {
  type: CellType.POWERUP_BOMB_RANGE | CellType.POWERUP_MAX_BOMBS;
  // position já está incluído em ThreeElements['mesh'] e será passado diretamente
}

// Combinar com as props de um elemento mesh do R3F
type PowerUpProps = PowerUpCustomProps & Omit<ThreeElements['mesh'], 'type'>;

export default function PowerUp({ position, type, ...props }: PowerUpProps) {
  // Referência para o grupo principal do power-up
  const powerUpRef = useRef<THREE.Group>(null);
  const [modelsPreloaded, setModelsPreloaded] = useState(false);

  // Pré-carrega modelos de power-ups apenas quando o componente é montado
  useEffect(() => {
    if (!modelsPreloaded) {
      const preloadModels = async () => {
        try {
          useGLTF.preload('/models/powerapps/fogo.glb');
          useGLTF.preload('/models/powerapps/bomb.glb');
        } catch (error) {
          console.error('Erro ao pré-carregar modelos de power-up:', error);
        }
        setModelsPreloaded(true);
      };
      
      preloadModels();
    }
  }, [modelsPreloaded]);

  // Estado para animação flutuante
  const floatAnimation = useRef({
    time: Math.random() * Math.PI * 2, // Tempo inicial aleatório para desincronizar múltiplos power-ups
    height: 0,
    rotationSpeed: 1 + Math.random() * 0.5 // Velocidade de rotação aleatória
  });
  // Carrega os modelos 3D para os power-ups
  const { scene: fireScene } = useGLTF('/models/powerapps/fogo.glb');
  const { scene: bombScene } = useGLTF('/models/powerapps/bomb.glb');
  // Configura o modelo 3D quando disponível
  useEffect(() => {
    if (!powerUpRef.current) return;

    // Limpeza de qualquer conteúdo anterior
    while (powerUpRef.current.children.length) {
      powerUpRef.current.remove(powerUpRef.current.children[0]);
    }

    let clonedScene;

    if (type === CellType.POWERUP_BOMB_RANGE && fireScene) {
      // Configurações do modelo de fogo
      clonedScene = fireScene.clone();
      clonedScene.scale.set(0.5, 0.5, 0.5); // Ajusta o tamanho do power-up

      // Percorre o modelo para configurar materiais e sombras
      clonedScene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;

          // Ajusta material para ficar com aparência de fogo
          if (object.material) {
            object.material.emissive = new THREE.Color(0xff5500);
            object.material.emissiveIntensity = 0.7;
          }
        }
      });
    } else if (type === CellType.POWERUP_MAX_BOMBS && bombScene) {
      // Configurações do modelo de bomba
      clonedScene = bombScene.clone();
      clonedScene.scale.set(5, 5, 5); // Mesmo tamanho do modelo de fogo (0.5)

      // Percorre o modelo para configurar materiais e sombras
      clonedScene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;

          // Mantém o material original sem modificações de cor
          // Não aplicamos nenhum efeito de emissão para manter a aparência original do modelo
        }
      });
    }

    // Adiciona o modelo clonado ao grupo, se disponível
    if (clonedScene && powerUpRef.current) {
      powerUpRef.current.add(clonedScene);
    }

    // Retorno de limpeza quando o componente for desmontado
    return () => {
      if (powerUpRef.current) {
        while (powerUpRef.current.children.length) {
          powerUpRef.current.remove(powerUpRef.current.children[0]);
        }
      }
    };
  }, [type, fireScene, bombScene]);

  // Animação de flutuação e rotação
  useFrame((state, delta) => {
    if (powerUpRef.current) {
      // Atualiza o tempo para animação
      floatAnimation.current.time += delta;

      // Animação flutuante (movimento suave para cima e para baixo)
      const floatHeight = Math.sin(floatAnimation.current.time * 2) * 0.1;
      powerUpRef.current.position.y = position[1] + floatHeight + 0.2; // Posição base + animação flutuante + elevação

      // Rotação contínua
      powerUpRef.current.rotation.y += delta * floatAnimation.current.rotationSpeed;
    }
  });  return (
    // @ts-ignore - group é um componente válido do Three.js/React-Three-Fiber
    <group ref={powerUpRef} position={[position[0], position[1], position[2]]} />
  );
}
