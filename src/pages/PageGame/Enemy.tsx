import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EnemyType, enemyConfigs } from './enemyTypes';

interface EnemyProps {
  position: [number, number, number];
  enemyType?: EnemyType;
  color?: string;
  direction?: [number, number, number]; // Direção de movimento [x, y, z]
  isMoving?: boolean; // Se o inimigo está se movendo
  health?: number; // Pontos de vida do inimigo
}

export default function Enemy({
  position,
  enemyType = EnemyType.NORMAL,
  color,
  direction = [0, 0, 0],
  isMoving = false,
  health,
  ...props
}: EnemyProps) {
  // Obter a configuração com base no tipo de inimigo
  const enemyConfig = enemyConfigs[enemyType];

  // Usar a cor da configuração, se não for especificada
  const finalColor = color || enemyConfig.color;

  // Referência para o grupo principal do inimigo
  const groupRef = useRef<THREE.Group | null>(null);

  // Carrega o modelo 3D do Bot
  const { scene, animations } = useGLTF(enemyConfig.model);

  // Configuração de animações (se o modelo tiver animações)
  const { actions, names } = useAnimations(animations, groupRef);

  // Estado para controlar a rotação e a animação
  const moveState = useRef({
    rotation: 0,
    speed: enemyConfig.speed,
    bobHeight: 0,
    health: health || enemyConfig.health
  });

  // Efeito para configuração inicial do modelo
  useEffect(() => {
    if (scene) {
      // Configurações do modelo
      scene.scale.set(0.5, 0.5, 0.5); // Ajusta o tamanho do bot

      // Percorre os materiais para ajustar propriedades
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;

          // Aplicamos a cor específica do tipo de inimigo
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(mat => {
                mat.color = new THREE.Color(finalColor);

                // Adicionar efeitos visuais baseados no tipo de inimigo
                if (enemyType === EnemyType.GHOST) {
                  mat.transparent = true;
                  mat.opacity = 0.7;
                }

                if (enemyType === EnemyType.FAST) {
                  mat.emissive = new THREE.Color(0x003366);
                  mat.emissiveIntensity = 0.3;
                }

                if (enemyType === EnemyType.AGGRESSIVE) {
                  mat.emissive = new THREE.Color(0x330000);
                  mat.emissiveIntensity = 0.5;
                }
              });
            } else {
              object.material.color = new THREE.Color(finalColor);

              // Adicionar efeitos visuais baseados no tipo de inimigo
              if (enemyType === EnemyType.GHOST) {
                object.material.transparent = true;
                object.material.opacity = 0.7;
              }

              if (enemyType === EnemyType.FAST) {
                object.material.emissive = new THREE.Color(0x003366);
                object.material.emissiveIntensity = 0.3;
              }

              if (enemyType === EnemyType.AGGRESSIVE) {
                object.material.emissive = new THREE.Color(0x330000);
                object.material.emissiveIntensity = 0.5;
              }
            }
          }
        }
      });

      // Clone o modelo para evitar conflito com outras instâncias
      const clonedScene = scene.clone();

      // Adiciona o modelo clonado ao grupo
      if (groupRef.current) {
        groupRef.current.add(clonedScene);

        // Calcula a direção para o inimigo olhar
        if (direction[0] !== 0 || direction[2] !== 0) {
          const angle = Math.atan2(direction[0], direction[2]);
          groupRef.current.rotation.y = angle;
        }
      }

      // Inicia a animação, se existir
      if (names.length > 0 && isMoving) {
        const walkAnimation = names.find(name =>
          name.toLowerCase().includes('walk') ||
          name.toLowerCase().includes('run') ||
          name.toLowerCase().includes('move')
        );

        if (walkAnimation && actions[walkAnimation]) {
          actions[walkAnimation].reset().play();
        }
      }
    }

    return () => {
      // Limpa recursos ao desmontar
      if (groupRef.current) {
        while (groupRef.current.children.length) {
          groupRef.current.remove(groupRef.current.children[0]);
        }
      }
    };
  }, [scene, color, direction, isMoving, actions, names]);

  // Animação de movimento do Bot (efeito de bobbing)
  useFrame((state, delta) => {
    if (groupRef.current && isMoving) {
      // Efeito de bobbing (subir e descer suavemente)
      moveState.current.bobHeight += delta * 2.5 * moveState.current.speed;
      const bobOffset = Math.sin(moveState.current.bobHeight) * 0.05;
      groupRef.current.position.y = position[1] + bobOffset;

      // Rotação suave para acompanhar a direção
      if (direction[0] !== 0 || direction[2] !== 0) {
        const targetRotation = Math.atan2(direction[0], direction[2]);
        const currentRotation = groupRef.current.rotation.y;

        // Suaviza a rotação para evitar giros bruscos
        groupRef.current.rotation.y += (targetRotation - currentRotation) * delta * 5;

        // Para inimigos FAST, adicionar um efeito de inclinação para frente durante o movimento
        if (enemyType === EnemyType.FAST) {
          // Inimigos rápidos se inclinam ligeiramente para frente ao se mover
          groupRef.current.rotation.x = Math.sin(moveState.current.bobHeight * 2) * 0.1;
        }

        // Para inimigos AGGRESSIVE, adicionar um efeito de balanço lateral mais pronunciado
        if (enemyType === EnemyType.AGGRESSIVE) {
          // Inimigos agressivos têm um balanço lateral mais dramático
          groupRef.current.rotation.z = Math.sin(moveState.current.bobHeight * 1.5) * 0.08;
        }
      }
    } else if (groupRef.current && !isMoving) {
      // Comportamento parado específico por tipo

      // Inimigos GHOST pulsam mesmo quando parados
      if (enemyType === EnemyType.GHOST) {
        moveState.current.bobHeight += delta;
        const pulseScale = 1 + Math.sin(moveState.current.bobHeight) * 0.05;
        groupRef.current.scale.set(0.5 * pulseScale, 0.5 * pulseScale, 0.5 * pulseScale);
      }

      // BOMBER faz pequenas rotações olhando ao redor quando parado
      if (enemyType === EnemyType.BOMBER) {
        moveState.current.bobHeight += delta;
        const lookAroundAngle = Math.sin(moveState.current.bobHeight * 0.5) * 0.3;
        groupRef.current.rotation.y += (lookAroundAngle - groupRef.current.rotation.y) * delta;
      }
    }
  });
  return (
    // @ts-ignore - React Three Fiber reconhece o elemento 'group'
    <group ref={groupRef} position={position} {...props} />
  );
}
