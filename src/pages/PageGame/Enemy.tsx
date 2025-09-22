import { useRef, useEffect } from 'react';
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
      // Aumenta o tamanho base do inimigo para melhorar legibilidade na cena
      // Subimos para 1.0 para ficar mais próximo do tamanho do jogador
      scene.scale.set(1.0, 1.0, 1.0);

      // Percorre os materiais para ajustar propriedades
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;

          // Aplicamos a cor específica do tipo de inimigo
          if (object.material) {

            if (enemyType === EnemyType.FAST) {
              object.material.emissiveIntensity = 0.3;
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
  useFrame((_state, delta) => {
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
      }
    } else if (groupRef.current && !isMoving) {
      // Comportamento parado específico por tipo

    }
  });
  return (
    // @ts-ignore - React Three Fiber reconhece o elemento 'group'
    <group ref={groupRef} position={position} {...props} />
  );
}
