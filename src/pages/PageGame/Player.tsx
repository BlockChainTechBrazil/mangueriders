import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import useGameStore from '../../game/store/gameStore';

interface PlayerProps {
  gridPosition: [number, number, number]; // Posição lógica no grid (x, y, z)
  targetPosition?: [number, number, number]; // Posição visual alvo (opcional)
  isInvincible: boolean; // Propriedade para controle de invencibilidade
  moveSpeed?: number; // Velocidade de movimento (opcional)
  onMovementComplete?: () => void; // Callback quando o movimento termina
}  const Player: React.FC<PlayerProps> = ({
  gridPosition,
  targetPosition,
  isInvincible,
  moveSpeed = 6, // Aumentado para 6 para movimento mais rápido e responsivo
  onMovementComplete
}) => {
  const [modelsPreloaded, setModelsPreloaded] = useState(false);
  const groupRef = useRef<THREE.Group>(null!);
  const materialRef = useRef<THREE.Material | THREE.Material[]>(null!);

  // Pré-carrega modelos de personagens apenas quando o componente Player é montado
  useEffect(() => {
    if (!modelsPreloaded) {
      const preloadModels = async () => {
        const models = [
          '/models/characters/Alex.glb',
          '/models/characters/Weet.glb',
          '/models/characters/Raio.glb'
        ];

        for (const modelPath of models) {
          try {
            useGLTF.preload(modelPath);
          } catch (error) {
            console.error(`Erro ao pré-carregar modelo ${modelPath}:`, error);
          }
        }

        setModelsPreloaded(true);
      };

      preloadModels();
    }
  }, [modelsPreloaded]);

  // Busca o personagem selecionado diretamente do gameStore
  const playerData = useGameStore((state: any) => state.player);

  // Usa diretamente o modelPath do personagem selecionado
  // Com fallback para garantir que sempre tenha um modelo
  const modelPath = playerData?.modelPath || '/models/characters/Alex.glb';

  // Estado para controlar qual modelo está ativo: 'idle' ou 'move'
  const [activeModel, setActiveModel] = useState('idle');

  // Determina o caminho do modelo a ser carregado com base no estado
  const currentModelPath = activeModel === 'idle'
    ? modelPath
    : modelPath.replace('.glb', 'move.glb'); // Assumindo a convenção 'Nome-move.glb'

  // Carrega o modelo com useGLTF
  const { scene, animations } = useGLTF(currentModelPath) as any;

  // Configura animações
  const { actions, names, mixer } = useAnimations(animations, scene);

  // Armazena a posição visual atual
  const currentPosition = useRef<THREE.Vector3>(
    new THREE.Vector3(gridPosition[0], gridPosition[1], gridPosition[2])
  );

  // A posição alvo para onde o jogador está se movendo
  const visualTargetPosition = useRef<THREE.Vector3>(
    new THREE.Vector3(gridPosition[0], gridPosition[1], gridPosition[2])
  );

  // Flag para verificar se o jogador está se movendo
  const isMoving = useRef<boolean>(false);

  // Para rastrear quanto movimento já foi concluído
  const movementProgress = useRef<number>(0);

  // Referência para rotação durante o movimento
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  // Configura o modelo e animações iniciais
  useEffect(() => {
    if (!scene) return; // Garante que a cena está disponível

    // Aplica escala adequada ao modelo baseada no personagem
    // Aumentamos a escala para que o jogador fique visivelmente maior que objetos pequenos (lixo)
    const defaultScale = 1.0;
    scene.scale.set(defaultScale, defaultScale, defaultScale);

    // Verifica se temos animações disponíveis
    if (names && names.length > 0) {
      // Encontra a animação apropriada para o estado atual (idle ou walk/run)
      const animName = names.find(name =>
        activeModel === 'idle'
          ? name.toLowerCase().includes('idle')
          : (name.toLowerCase().includes('run') || name.toLowerCase().includes('walk'))
      ) || names[0];

      if (actions && animName && actions[animName]) {
        actions[animName].reset().fadeIn(0.5).play();
      }
    }

    // Configura materiais para efeito de invencibilidade
    scene.traverse((object: any) => {
      if (object.type === 'Mesh') {
        const mesh = object as THREE.Mesh;
        if (mesh.material) {
          // Guarda referência para usar no efeito de invencibilidade
          if (!materialRef.current) {
            materialRef.current = mesh.material;
          }
        }
      }
    }); return () => {
      // Limpa animações ao desmontar
      Object.values(actions).forEach(action => action?.stop());

      // Liberar recursos do modelo quando o componente é desmontado
      if (scene) {
        scene.traverse((object: any) => {
          if (object.type === 'Mesh') {
            const mesh = object as THREE.Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach(material => material.dispose());
              } else {
                mesh.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [scene, names, actions, activeModel]); // Re-executa quando a cena (modelo) ou animações mudam

  // Quando a targetPosition é definida, iniciamos a animação de movimento com precisão absoluta
  useEffect(() => {
    if (targetPosition) {
      // ATIVA O MODELO DE MOVIMENTO
      setActiveModel('move');

      // Atualiza a posição alvo para onde o jogador deverá se mover
      visualTargetPosition.current.set(targetPosition[0], targetPosition[1], targetPosition[2]);

      // Garantir que a posição atual seja EXATAMENTE a posição atual do grupo antes de iniciar o movimento
      // Isso elimina completamente qualquer "salto" ou inconsistência ao iniciar movimentos
      if (groupRef.current) {
        // Capturamos a posição EXATA do modelo neste momento
        currentPosition.current.set(
          groupRef.current.position.x,
          groupRef.current.position.y,
          groupRef.current.position.z
        );
      } else {
        // Fallback: se o grupo ainda não existe, usa a posição do grid
        currentPosition.current.set(gridPosition[0], gridPosition[1], gridPosition[2]);
      }

      // Reinicia todos os parâmetros de movimento para começar do zero
      isMoving.current = true;
      movementProgress.current = 0;

      // Calcula a direção do movimento para ajustar a rotação do modelo
      const direction = new THREE.Vector3().subVectors(
        visualTargetPosition.current,
        currentPosition.current
      );

      // Define rotação alvo para interpolação suave (apenas calculamos aqui, aplicamos no useFrame)
      if (direction.length() > 0.001) { // Limiar menor para detectar qualquer movimento
        // Rotação apenas no eixo Y (virar para a direção)
        const angle = Math.atan2(direction.x, direction.z);
        rotationRef.current.y = angle; // Salvamos a rotação alvo em vez de aplicar imediatamente
      }
    } else {
      // ATIVA O MODELO PARADO (IDLE) QUANDO NÃO HÁ ALVO
      setActiveModel('idle');

      // Se não houver targetPosition, usamos a posição do grid (teleporte sem animação)
      visualTargetPosition.current.set(gridPosition[0], gridPosition[1], gridPosition[2]);
      currentPosition.current.set(gridPosition[0], gridPosition[1], gridPosition[2]);

      // Atualiza a posição do grupo diretamente para garantir sincronização
      if (groupRef.current) {
        groupRef.current.position.set(gridPosition[0], gridPosition[1], gridPosition[2]);
      }
    }
  }, [targetPosition, gridPosition]); // Removido actions e names para evitar re-trigger desnecessário

  // Função de easing extremamente simplificada para movimento totalmente linear
  // Eliminando completamente qualquer efeito de aceleração/desaceleração que possa causar sensação de "ir e voltar"
  const customEasing = (progress: number) => {
    // Movimento 100% linear - constante do início ao fim
    // Isso resolve problemas com movimentos que parecem "voltar" devido à física de easing
    return progress;
  };
  // Rastreia o tempo para efeitos de animação contínua
  const animTime = useRef(0);

  // Atualiza o tempo de animação em cada frame com velocidade otimizada
  useFrame((state, delta) => {
    animTime.current = state.clock.elapsedTime;

    // Atualiza o mixer de animações com um delta levemente acelerado
    // Isso torna todas as animações um pouco mais rápidas e responsivas
    if (mixer) {
      // Ajuste de velocidade para todas as animações (15% mais rápidas)
      const adjustedDelta = delta * 1.15;
      mixer.update(adjustedDelta);
    }
  });
  // Usando useFrame para fazer a animação suave
  useFrame((state, delta) => {
    // Forçar verificação em cada frame se há um targetPosition mas isMoving é false
    if (targetPosition && !isMoving.current) {
      isMoving.current = true;
      movementProgress.current = 0;

      // Se houver, atualiza também a posição alvo
      visualTargetPosition.current.set(targetPosition[0], targetPosition[1], targetPosition[2]);
    }

    // Efeito de piscar para invencibilidade
    if (isInvincible && materialRef.current) {
      // Alterna a visibilidade (efeito de piscar)
      scene.visible = Math.floor(state.clock.elapsedTime * 10) % 2 === 0;
    } else if (!scene.visible) {
      // Garante que o jogador esteja visível quando não estiver invencível
      scene.visible = true;
    }    // Verifica se o jogador está se movendo
    if (isMoving.current) {      // Velocidade significativamente mais rápida para movimento ágil e sem sensação de travamento
      const adaptiveSpeed = moveSpeed * 1.5; // Aumentamos em 50% a velocidade base

      // Incremento de movimento absolutamente constante a cada frame
      const progressIncrement = delta * adaptiveSpeed;

      // Incrementa o progresso do movimento de forma direta e linear
      movementProgress.current += progressIncrement;
      movementProgress.current = Math.min(movementProgress.current, 1);// Aplica easing personalizado ao movimento
      const easedProgress = customEasing(movementProgress.current);      // Calcula a nova posição interpolada com base na curva de easing
      const lerpPosition = new THREE.Vector3().lerpVectors(
        currentPosition.current,
        visualTargetPosition.current,
        easedProgress
      );
      // Removemos completamente o efeito de "bobbing" (oscilação vertical)
      // O movimento será 100% linear em todos os eixos, sem qualquer oscilação vertical
      // Isso elimina qualquer sensação de "ir e voltar" causada pelo bobbing

      // Atualiza a posição do modelo
      if (groupRef.current) {
        // Atualização explícita de cada componente da posição para garantir o movimento
        groupRef.current.position.x = lerpPosition.x;
        groupRef.current.position.y = lerpPosition.y;
        groupRef.current.position.z = lerpPosition.z;

        // Rotação mais imediata do modelo, aplicada ao groupRef para persistir
        const rotationSpeed = 12; // Rotação mais rápida

        // Calcular a diferença absoluta entre rotação atual e desejada
        const currentRotation = groupRef.current.rotation.y;
        const targetRotation = rotationRef.current.y;

        // Interpola a rotação de forma mais direta - quase imediata
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          currentRotation,
          targetRotation,
          Math.min(1.0, delta * rotationSpeed) // Limite superior para evitar overshooting
        );
      }      // Usando apenas o progresso como métrica de conclusão
      // Isso é muito mais previsível e elimina o efeito de ir/voltar

      // Consideramos o movimento concluído quando atingir 99% do progresso
      // Com easing 100% linear, isso garante que o modelo chegue quase exatamente
      // onde deve estar antes de teleportar para a posição final
      const isAtDestination = movementProgress.current >= 0.99;

      if (isAtDestination) {        // Animação completa, coloca na posição final exata (sem "salto")
        if (groupRef.current) {
          // Garantimos que a posição final seja exatamente igual à posição alvo
          // sem qualquer interpolação adicional
          groupRef.current.position.set(
            visualTargetPosition.current.x,
            visualTargetPosition.current.y,
            visualTargetPosition.current.z
          );

          // Define a rotação final exata também no groupRef
          groupRef.current.rotation.y = rotationRef.current.y;
        }

        // Atualiza a posição atual para corresponder exatamente à posição alvo
        currentPosition.current.copy(visualTargetPosition.current);

        // Marca como não mais em movimento
        isMoving.current = false;

        // A troca de modelo agora é controlada pelo useEffect que observa targetPosition

        // Notifica que o movimento foi concluído
        if (onMovementComplete) {
          // Executa o callback imediatamente para garantir que o jogo saiba que o movimento terminou
          onMovementComplete();

          // Garantir que o target position seja limpo
          visualTargetPosition.current.copy(currentPosition.current);
        }
      }
    }
  });

  return (
    <React.Suspense fallback={null}>
      {/* @ts-ignore */}
      <group ref={groupRef} position={[gridPosition[0], gridPosition[1], gridPosition[2]]} >
        {/* @ts-ignore */}
        <primitive object={scene} />
        {/* @ts-ignore */}
      </group>
    </React.Suspense>
  );
};

export default Player;
