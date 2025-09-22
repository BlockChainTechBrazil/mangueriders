// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { CellType } from './types'; // Import CellType
import { MapType, getMapById } from './maps'; // Importar funcionalidades de mapas
import useGameStore from '../../game/store/gameStore'; // Importar o gameStore

interface BlockProps {
  position: [number, number, number];
  type: CellType; // Changed from color to type
  hp?: number; // para blocos do tipo árvore (breakable)
}

const Block: React.FC<BlockProps> = ({ position, type, hp = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  // Referência e carregamento do modelo mangrove (apenas para blocos Wall)
  const mangroveRef = useRef<THREE.Group>(null!);
  // Referência e modelos para os lixos (usados nos blocos quebráveis)
  const trashRef = useRef<THREE.Group>(null!);
  // Pré-carregar os modelos 3D das mangroves
  useGLTF.preload('/models/structures/mangrove-three.glb');
  useGLTF.preload('/models/structures/mangrove-three2.glb');
  useGLTF.preload('/models/structures/mangrove-three3.glb');
  // Pré-carregar modelos de lixo (para substituir os blocos verdes quebráveis)
  useGLTF.preload('/models/trash/trash.glb');
  useGLTF.preload('/models/trash/trash1.glb');
  useGLTF.preload('/models/trash/trash2.glb');
  // Obter os dados do mapa diretamente do gameStore
  const mapData = useGameStore(state => state.mapData);
  // Fallback para o sistema antigo se mapData não estiver disponível
  const currentMap = useGameStore(state => state.currentMap) as MapType;
  const fallbackMapData = mapData || getMapById(currentMap);
  // Prevenir piscadas iniciais com um carregamento suave
  useEffect(() => {
    // Atraso mais longo para garantir que toda a cena seja renderizada corretamente
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300); // Aumentado para 300ms
    return () => clearTimeout(timer);
  }, []);

  // Garantir que o bloco seja carregado imediatamente se já estiver em um estado pronto
  useEffect(() => {
    if (meshRef.current && !loaded) {
      setLoaded(true);
    }
  }, [loaded]);
  // Carrega os três modelos (somente leitura, será usado quando type === Wall)
  const { scene: mangroveScene1 } = useGLTF('/models/structures/mangrove-three.glb') as any;
  const { scene: mangroveScene2 } = useGLTF('/models/structures/mangrove-three2.glb') as any;
  const { scene: mangroveScene3 } = useGLTF('/models/structures/mangrove-three3.glb') as any;
  const mangroveScenes = [mangroveScene1, mangroveScene2, mangroveScene3];
  // Carrega os modelos de lixo (para blocos Breakable)
  const { scene: trashScene1 } = useGLTF('/models/trash/trash.glb') as any;
  const { scene: trashScene2 } = useGLTF('/models/trash/trash1.glb') as any;
  const { scene: trashScene3 } = useGLTF('/models/trash/trash2.glb') as any;
  const trashScenes = [trashScene1, trashScene2, trashScene3];
  // ...existing code...
  // Adiciona leves animações aos blocos destrutíveis
  useFrame((state) => {
    if (type === CellType.Breakable && trashRef.current) {
      // Fixar o lixo no chão (sem flutuação)
      const baseY = position[1] - (1 - blockHeight) / 2;
      // Coloca o grupo de lixo exatamente na superfície do plano visivelmente abaixo do centro do bloco para evitar clipping
      trashRef.current.position.y = baseY - 0.01;
      // Rota uma leve rotação
      trashRef.current.rotation.y = 0.02;

      // Suaviza escala para dar efeito de encolhimento ao hover
      const targetScale = hovered ? 0.75 : 1.0;
      const current = trashRef.current.scale.x || 1;
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      const next = lerp(current, targetScale, 0.12);
      trashRef.current.scale.set(next, next, next);
    }

    // Adiciona leve animação de pulsação para os blocos fixos (menos perceptível)
    if (type === CellType.Wall && mangroveRef.current) {
      const scaleFactor = 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.005;
      mangroveRef.current.scale.set(scaleFactor, 1, scaleFactor);
    }
  });
  let blockColor = 'gray'; // Default color
  let blockEmissive = new THREE.Color(0x000000);
  const blockOpacity = 1;
  let blockRoughness = 0.5;
  let blockMetalness = 0.2;
  // Dimensões baseadas em HP para dar variação visual às árvores
  let blockHeight = 1; // Altura padrão do bloco
  let blockWidth = 1;  // Largura padrão do bloco
  let blockDepth = 1;  // Profundidade padrão do bloco
  let blockTexture = null;

  if (type === CellType.Wall) {
    // BLOCO FIXO - COR ESCURA GARANTIDA - ignorando mapData para garantir consistência
    blockColor = "#444444"; // Cinza escuro para blocos fixos (ligeiramente mais claro)
    blockRoughness = 0.7; // Alta rugosidade para textura áspera
    blockMetalness = 0.3; // Efeito metálico suave para parecer pedra polida

    // Verifica se solidBlockEmissive é uma string (hex) ou um objeto THREE.Color
    if (fallbackMapData.solidBlockEmissive) {
      if (typeof fallbackMapData.solidBlockEmissive === 'string') {
        blockEmissive = new THREE.Color(fallbackMapData.solidBlockEmissive);
      } else {
        blockEmissive = fallbackMapData.solidBlockEmissive;
      }
    } else {
      blockEmissive = new THREE.Color(0x000000);
    }

    // BLOCO FIXO - Maior que os quebráveis, com espaço entre eles
    blockHeight = 0.85;  // Altura aumentada para blocos fixos
    // Ajusta X/Z para ocupar a célula inteira e evitar linhas visuais no chão
    blockWidth = 1.0;   // Largura para preencher a célula
    blockDepth = 1.0;   // Profundidade para preencher a célula
  } else if (type === CellType.Breakable) {
    // BLOCO QUEBRÁVEL - COR LARANJA VIVA GARANTIDA - ignorando mapData para garantir consistência
    blockColor = "#FF9500"; // Laranja ainda mais vivo para blocos quebráveis
    blockRoughness = 0.5; // Menor rugosidade para aparência mais suave
    blockMetalness = 0.15; // Um pouco mais de metalicidade para melhor reflexão
    // Define uma cor emissiva fixa para garantir o destaque visual
    // Intensifica o brilho ao passar o mouse - ignorando mapData para garantir consistência
    blockEmissive = hovered ? new THREE.Color(0x441100) : new THREE.Color(0x210800);

    // Ajusta dimensão com base no HP (árvore maior tem mais HP)
    blockHeight = 0.6 + 0.25 * hp;  // 0.85 para hp=1, 1.1 para hp=2, 1.35 para hp=3
    // Mantemos os blocos quebráveis um pouco menores, mas adicionamos um plano de solo
    // por célula para remover as linhas visuais entre blocos
    blockWidth = 0.6 + 0.15 * hp;
    blockDepth = 0.6 + 0.15 * hp;

    // Cor mais verde para representar mangue/árvore
    blockColor = hp >= 3 ? '#2E8B57' : (hp === 2 ? '#55AA66' : '#8BC34A');
  }

  // Clona o modelo mangrove usando as dimensões já inicializadas
  useEffect(() => {
    if (!mangroveRef.current) return;

    // Limpa filhos anteriores
    while (mangroveRef.current.children.length) {
      mangroveRef.current.remove(mangroveRef.current.children[0]);
    }

    if (type === CellType.Wall) {
      // Escolhe de forma determinística um dos 3 modelos baseado na posição X,Z
      const idx = Math.abs(Math.floor(position[0] + position[2])) % mangroveScenes.length;
      const sceneToUse = mangroveScenes[idx];
      if (!sceneToUse) return;
      const cloned = sceneToUse.clone();
      // Ajustes de escala/posição para alinhar ao tamanho do bloco
      cloned.scale.set(blockWidth, blockHeight, blockDepth);
      cloned.traverse((obj: any) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
          if (obj.material) {
            try {
              obj.material.emissive = blockEmissive;
            } catch (e) {
              // alguns materiais podem não aceitar emissive diretamente
            }
          }
        }
      });

      mangroveRef.current.add(cloned);
    }

    return () => {
      if (mangroveRef.current) {
        while (mangroveRef.current.children.length) {
          mangroveRef.current.remove(mangroveRef.current.children[0]);
        }
      }
    };
  }, [mangroveScene1, mangroveScene2, mangroveScene3, type, blockWidth, blockHeight, blockDepth, blockEmissive]);

  // índice determinístico e escala base para os modelos de lixo
  const trashIdx = Math.abs(Math.floor(position[0] + position[2] + hp)) % trashScenes.length;
  const trashBaseScale = 0.6;
  // NOTE: agora renderizamos o modelo diretamente no JSX (com <primitive />)

  // Ajustar a posição para compensar as dimensões e garantir alinhamento correto
  const adjustedPosition: [number, number, number] = [
    position[0],
    // Se for um bloco fixo, ajustar a altura para ficar um pouco mais alto que o quebável
    type === CellType.Wall
      ? position[1] - (1 - blockHeight) / 2 + 0.05 // Ligeiramente mais alto para os blocos fixos
      : position[1] - (1 - blockHeight) / 2,       // Altura normal para quebráveis
    position[2]
  ];
  // Não renderizar nada até que esteja completamente carregado
  if (!loaded) return null;
  // Se for um bloco Wall, renderizamos o modelo 3D mangrove
  if (type === CellType.Wall) {
    // Plano de solo levemente maior que a célula para sobrepor bordas vizinhas
    const planeSize = 1.06;
    // Coloca o plano um pouco abaixo da base do bloco para dar sensação de lama
    const planeY = adjustedPosition[1] - blockHeight / 2 - 0.02;

    return (
      <group position={adjustedPosition}>
        {/* Solo de mangue por célula (esconde linhas entre células) */}
        <mesh
          position={[0, planeY - adjustedPosition[1], 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[planeSize, planeSize]} />
          <meshStandardMaterial
            color={fallbackMapData?.groundColor || '#2f4f2f'}
            roughness={1}
            metalness={0}
            side={THREE.DoubleSide}
          />
        </mesh>

        <group
          ref={mangroveRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        />
      </group>
    );
  }

  // Caso padrão: substituir blocos Breakable pelos modelos de lixo
  if (type === CellType.Breakable) {
    // Plano de solo por célula para esconder linhas entre blocos
    return (
      <group position={adjustedPosition}>
        <mesh
          position={[0, -(blockHeight / 2) - 0.02, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[1.06, 1.06]} />
          <meshStandardMaterial color={fallbackMapData?.groundColor || '#2f4f2f'} roughness={1} metalness={0} side={THREE.DoubleSide} />
        </mesh>

        <group
          ref={trashRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* Renderiza o modelo GLB selecionado */}
          {trashScenes[trashIdx] && (
            <primitive
              object={trashScenes[trashIdx].clone()}
              scale={[blockWidth * trashBaseScale, blockHeight * trashBaseScale, blockDepth * trashBaseScale]}
              position={[0, 0, 0]}
              dispose={null}
            />
          )}
        </group>
      </group>
    );
  }

  // Caso padrão para outros tipos (mantém caixa simples)
  return (
    <mesh
      position={adjustedPosition}
      ref={meshRef}
      castShadow
      receiveShadow
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Solo de mangue por célula para esconder linhas entre blocos */}
      <mesh
        position={[0, -(blockHeight / 2) - 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[1.06, 1.06]} />
        <meshStandardMaterial color={fallbackMapData?.groundColor || '#2f4f2f'} roughness={1} metalness={0} side={THREE.DoubleSide} />
      </mesh>
      <boxGeometry args={[blockWidth, blockHeight, blockDepth]} />
      <meshStandardMaterial
        color={blockColor}
        opacity={blockOpacity}
        roughness={blockRoughness}
        metalness={blockMetalness}
        emissive={blockEmissive}
        {...(type === CellType.Wall && {
          bumpScale: 0.03,
          flatShading: true,
          wireframe: false,
          shadowSide: THREE.FrontSide,
          envMapIntensity: 0.8
        })}
        {...(type === CellType.Breakable && {
          bumpScale: 0.05,
          flatShading: false,
          envMapIntensity: 1.2,
          clearcoat: 0.2,
          clearcoatRoughness: 0.3
        })}
      />
    </mesh>
  );
};

export default Block;