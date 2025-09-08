import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
    Cloud,
    Sphere, Stars,
    Sky, Float
} from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '@/styles/gaya/colors';

// Componente para criar um edifício estilizado
const Building = ({ position, width, height, depth, color }) => {
  const mesh = useRef();
  
  // Cria janelas dinamicamente na geometria
  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(width, height, depth);
    
    // Adicionar UVs para mapear as janelas corretamente
    const windowSize = 0.2;
    const windowSpacing = 0.1;
    const uvs = geo.attributes.uv.array;
    
    // Modificar UVs para o efeito de janelas
    for (let i = 0; i < uvs.length; i += 2) {
      uvs[i] = uvs[i] * (width / windowSize);
      uvs[i + 1] = uvs[i + 1] * (height / windowSize);
    }
    
    return geo;
  }, [width, height, depth]);
  
  // Material com efeito de janelas
  const material = useMemo(() => {
    // Textura de janelas
    const windowCanvas = document.createElement('canvas');
    windowCanvas.width = 512;
    windowCanvas.height = 512;
    
    const ctx = windowCanvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 512);
    
    // Desenhar janelas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    const windowSize = 40;
    const spacing = 20;
    const totalSize = windowSize + spacing;
    
    for (let y = spacing; y < 512; y += totalSize) {
      for (let x = spacing; x < 512; x += totalSize) {
        // Aleatoriamente decidir se a janela está acesa ou não
        if (Math.random() > 0.4) {
          ctx.fillStyle = 'rgba(255, 255, 160, 0.9)';
        } else {
          ctx.fillStyle = 'rgba(40, 40, 80, 0.8)';
        }
        ctx.fillRect(x, y, windowSize, windowSize);
      }
    }
    
    const windowTexture = new THREE.CanvasTexture(windowCanvas);
    windowTexture.wrapS = THREE.RepeatWrapping;
    windowTexture.wrapT = THREE.RepeatWrapping;
    windowTexture.repeat.set(4, 8);
    
    return new THREE.MeshStandardMaterial({
      map: windowTexture,
      roughness: 0.7,
      metalness: 0.2
    });
  }, [color]);
  
  return (
    <mesh 
      ref={mesh} 
      position={position}
      castShadow
      receiveShadow
      geometry={geometry}
      material={material}
    />
  );
};

// Componente para criar palmeiras
const PalmTree = ({ position, scale = 1 }) => {
  const trunkRef = useRef();
  const leavesRef = useRef();
  
  // Animação suave das folhas
  useFrame(({ clock }) => {
    if (leavesRef.current) {
      leavesRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
      leavesRef.current.rotation.z = Math.cos(clock.getElapsedTime() * 0.3) * 0.05;
    }
  });
  
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Tronco */}
      <mesh ref={trunkRef} castShadow>
        <cylinderGeometry args={[0.2, 0.4, 3, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      
      {/* Folhas */}
      <group ref={leavesRef} position={[0, 1.8, 0]}>
        {Array(7).fill().map((_, i) => (
          <mesh 
            key={i} 
            castShadow 
            rotation={[
              Math.random() * 0.2 - 0.1,
              (Math.PI * 2 / 7) * i,
              -Math.PI / 3
            ]}
          >
            <cylinderGeometry args={[0, 0.2, 2, 6]} />
            <meshStandardMaterial color="#2E8B57" side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Componente para o oceano - corrigido para usar addUpdateRange
const Ocean = ({ position = [0, -2, 0], size = [200, 200] }) => {
  const meshRef = useRef();
  
  // Geometria com vértices animados
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size[0], size[1], 48, 48); // Reduzido de 64x64 para 48x48
    return geo;
  }, [size]);
  
  // Material do oceano com reflexo e transparência
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: COLORS.secondary.DEFAULT,
      metalness: 0.3,
      roughness: 0.1,
      transparent: true,
      opacity: 0.8,
    });
  }, []);
  
  // Animação das ondas - corrigida para usar corretamente o buffer geometry
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();
      const position = meshRef.current.geometry.attributes.position;
      const array = position.array;
      
      // Usar array diretamente em vez de usar getX/getY/setZ
      for (let i = 0; i < position.count; i++) {
        const x = array[i * 3];
        const y = array[i * 3 + 1];
        
        // Criar movimento ondulado com amplitudes reduzidas
        const waveX1 = Math.sin(x * 0.05 + time * 0.4) * 0.4;
        const waveX2 = Math.sin(x * 0.1 + time * 0.2) * 0.25;
        const waveY1 = Math.cos(y * 0.07 + time * 0.3) * 0.35;
        
        const height = waveX1 + waveX2 + waveY1;
        array[i * 3 + 2] = height;
      }
      
      // Marcar para atualização sem usar updateRange depreciado
      position.needsUpdate = true;
    }
  });
  
  return (
    <mesh 
      ref={meshRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      geometry={geometry}
      material={material}
    />
  );
};

// Componente para a areia da praia
const Beach = ({ position = [0, -1.95, -20], size = [200, 50] }) => {
  return (
    <mesh 
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[size[0], size[1], 32, 32]} />
      <meshStandardMaterial color="#e6d7a8" roughness={0.9} metalness={0.1} />
    </mesh>
  );
};

// Componente principal do ambiente de Recife
export default function RecifeEnvironment() {
  const skyRef = useRef();  // Cores do céu mudando ao longo do tempo, com ciclo mais lento
  useFrame(({ clock }) => {
    try {
      if (skyRef.current) {
        // Movimento mais lento e com amplitude menor
        const time = clock.getElapsedTime() * 0.03; // Mais lento
        const x = Math.sin(time) * 8; // Reduzido de 10 para 8
        const y = Math.cos(time) * 1.5 + 5; // Reduzido de 2 para 1.5
        const z = Math.cos(time) * 8; // Reduzido de 10 para 8
        
        // Acessar sunPosition de forma segura verificando a existência em cada passo
        const sunPos = skyRef.current.material?.uniforms?.sunPosition?.value;
        
        if (sunPos && typeof sunPos.set === 'function') {
          sunPos.set(x, y, z);
        }
      }
    } catch (error) {
      // Registra o erro de forma mais discreta
      console.debug('[Recife Environment] Ignorando erro na animação do céu:', error.message);
    }
  });
  // Criar prédios da cidade de Recife
  const buildings = useMemo(() => {
    const buildingsList = [];
    const colors = [
      '#d8d8d8', '#e4e4e4', '#f0f0f0', '#f8f8f8',
      '#e0e8f0', '#e8f0f8', '#d8e0f0', '#f0e8d8'
    ];
    
    const buildingCount = 20;
    for (let i = 0; i < buildingCount; i++) {
      const posX = -35 + i * 4 - Math.random() * 3;
      const posZ = -33 - Math.random() * 15;
      const width = 2 + Math.random() * 2;
      const height = 5 + Math.random() * 15;
      const depth = 2 + Math.random() * 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      buildingsList.push(
        <Building 
          key={`building-${i}`}
          position={[posX, height / 2 - 2, posZ]}
          width={width}
          height={height}
          depth={depth}
          color={color}
        />
      );
    }
    
    return buildingsList;
  }, []);
  
  // Criar palmeiras ao longo da praia
  const palmTrees = useMemo(() => {
    const trees = [];
    
    for (let i = 0; i < 10; i++) {
      const posX = -20 + i * 5 - Math.random() * 2;
      const posZ = -18 - Math.random() * 5;
      const scale = 0.8 + Math.random() * 0.5;
      
      trees.push(
        <PalmTree 
          key={`palm-${i}`}
          position={[posX, -1.95, posZ]}
          scale={scale}
        />
      );
    }
    
    return trees;
  }, []);
  return (
    <group>
      {/* Céu */}
      <Sky 
        ref={skyRef}
        distance={450000} 
        sunPosition={[0, 5, 10]} 
        inclination={0.5} 
        azimuth={0.25} 
        turbidity={10}
        rayleigh={2}        mieCoefficient={0.005}
        mieDirectionalG={0.8}
      />
      
      {/* Estrelas (visíveis ao entardecer) */}
      <Stars radius={100} depth={50} count={500} factor={4} fade={true} />
      
      {/* Oceano */}
      <Ocean />
      
      {/* Praia */}
      <Beach />
      
      {/* Prédios */}
      {buildings}
      
      {/* Palmeiras */}
      {palmTrees}
      
      {/* Nuvens */}
      <Cloud position={[-10, 15, -15]} speed={0.2} opacity={0.7} />
      <Cloud position={[15, 12, -20]} speed={0.1} opacity={0.5} />
      <Cloud position={[0, 20, -30]} speed={0.15} opacity={0.6} />
      <Cloud position={[-20, 18, -25]} speed={0.12} opacity={0.6} />
      
      {/* Elementos flutuantes característicos */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere position={[5, 5, -10]} args={[1, 16, 16]}>
          <meshStandardMaterial 
            color={COLORS.primary.DEFAULT} 
            emissive={COLORS.primary.DEFAULT}
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
          />
        </Sphere>
      </Float>

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.7}>
        <Sphere position={[-8, 8, -15]} args={[1.5, 16, 16]}>
          <meshStandardMaterial 
            color={COLORS.accent.DEFAULT}
            emissive={COLORS.accent.DEFAULT}
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
          />
        </Sphere>
      </Float>

      <Float speed={0.8} rotationIntensity={0.5} floatIntensity={0.3}>
        <Sphere position={[10, 12, -20]} args={[2, 16, 16]}>
          <meshStandardMaterial 
            color={COLORS.complementary.pink}
            emissive={COLORS.complementary.pink}
            emissiveIntensity={0.3}
            transparent
            opacity={0.5}
          />
        </Sphere>
      </Float>
    </group>
  );
}
