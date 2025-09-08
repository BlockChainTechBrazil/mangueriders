// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { CellType } from './types'; // Import CellType
import { MapType, getMapById } from './maps'; // Importar funcionalidades de mapas
import useGameStore from '../../game/store/gameStore'; // Importar o gameStore

interface BlockProps {
  position: [number, number, number];
  type: CellType; // Changed from color to type
}

const Block: React.FC<BlockProps> = ({ position, type }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
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
  // Adiciona leves animações aos blocos destrutíveis
  useFrame((state) => {
    if (type === CellType.Breakable && meshRef.current) {
      // Leve flutuação para blocos destrutíveis, considerando a posição já ajustada
      const baseY = position[1] - (1 - blockHeight) / 2;

      // Amplitude de flutuação aumentada para tornar o movimento mais perceptível
      const floatAmplitude = 0.03;

      // Animação de flutuação
      meshRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 1.5) * floatAmplitude;

      // Leve rotação para dar mais vida aos blocos destrutíveis
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
    
    // Adiciona leve animação de pulsação para os blocos fixos (menos perceptível)
    if (type === CellType.Wall && meshRef.current) {
      // Leve "respiração" para blocos fixos
      const scaleFactor = 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.005;
      meshRef.current.scale.set(scaleFactor, 1, scaleFactor);
    }
  });
  let blockColor = 'gray'; // Default color
  let blockEmissive = new THREE.Color(0x000000);
  const blockOpacity = 1;
  let blockRoughness = 0.5;
  let blockMetalness = 0.2;
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
      }    } else {
      blockEmissive = new THREE.Color(0x000000);
    }
    
    // BLOCO FIXO - Maior que os quebráveis, com espaço entre eles
    blockHeight = 0.85;  // Altura aumentada para blocos fixos
    blockWidth = 0.85;   // Largura reduzida para deixar espaço entre blocos
    blockDepth = 0.85;   // Profundidade reduzida para deixar espaço entre blocos
  } else if (type === CellType.Breakable) {
    // BLOCO QUEBRÁVEL - COR LARANJA VIVA GARANTIDA - ignorando mapData para garantir consistência
    blockColor = "#FF9500"; // Laranja ainda mais vivo para blocos quebráveis
    blockRoughness = 0.5; // Menor rugosidade para aparência mais suave
    blockMetalness = 0.15; // Um pouco mais de metalicidade para melhor reflexão
    // Define uma cor emissiva fixa para garantir o destaque visual
    // Intensifica o brilho ao passar o mouse - ignorando mapData para garantir consistência
    blockEmissive = hovered ? new THREE.Color(0x441100) : new THREE.Color(0x210800);
    
    // Bloco quebrável menor que os fixos
    blockHeight = 0.8;  // Altura média para blocos destrutíveis
    blockWidth = 0.8;   // Largura um pouco menor que os fixos    
    blockDepth = 0.8;   // Profundidade um pouco menor que os fixos
  }
  
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

  return (    <mesh
      position={adjustedPosition}
      ref={meshRef}
      castShadow
      receiveShadow
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[blockWidth, blockHeight, blockDepth]} />
      <meshStandardMaterial
        color={blockColor}
        opacity={blockOpacity}
        roughness={blockRoughness}
        metalness={blockMetalness}
        emissive={blockEmissive}
        // Adiciona detalhes visuais aos blocos
        {...(type === CellType.Wall && {
          bumpScale: 0.03,
          flatShading: true,
          wireframe: false,
          shadowSide: THREE.FrontSide,
          // Destacar os blocos fixos com um efeito de borda sutil
          envMapIntensity: 0.8
        })}
        {...(type === CellType.Breakable && {
          bumpScale: 0.05,
          flatShading: false,
          // Adicionar brilho aos blocos quebráveis
          envMapIntensity: 1.2,
          clearcoat: 0.2, // Leve efeito de verniz
          clearcoatRoughness: 0.3
        })}
      />
    </mesh>
  );
};

export default Block;