import React, { useRef, useMemo } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFloatingAnimation } from '@/features/gaya/hooks/useAnimations';
import { COLORS } from '@/styles/gaya/colors';

// Componente do Mascote GAYA avançado feito com primitivas simples
export function GayaMascot({ position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef();
  const bodyRef = useRef();
  const headRef = useRef();
  
  // Usar o hook de animação flutuante
  useFloatingAnimation(groupRef, { speed: 1.5, intensity: 0.8 });
  
  // Cores para o mascote
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: COLORS.primary.DEFAULT,
      metalness: 0.3,
      roughness: 0.2,
      emissive: COLORS.primary.DEFAULT,
      emissiveIntensity: 0.2,
    });
  }, []);
  
  const hornMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: COLORS.accent.DEFAULT,
      metalness: 0.4,
      roughness: 0.3,
      emissive: COLORS.accent.DEFAULT,
      emissiveIntensity: 0.1,
    });
  }, []);
  
  const eyeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: COLORS.neutral.black,
      metalness: 0.1,
      roughness: 0.1,
    });
  }, []);
  
  // Animação dos olhos
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Animação do corpo girando suavemente
    if (bodyRef.current) {
      bodyRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
    }
    
    // Animação da cabeça olhando em volta
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
      headRef.current.rotation.x = Math.sin(time * 0.4) * 0.1;
    }
  });
    return (
    <group ref={groupRef} position={position} scale={[scale * 0.8, scale * 0.8, scale * 0.8]}>
      {/* Corpo - reduzido em escala */}
      <group ref={bodyRef} position={[0, 0.5, 0]}>
        <mesh castShadow receiveShadow material={material}>
          <capsuleGeometry args={[0.7, 1.8, 16, 32]} />
        </mesh>
        
        {/* Braços */}
        <group position={[0, 0.2, 0]}>
          {/* Braço esquerdo */}
          <mesh castShadow position={[-1.1, 0, 0]} rotation={[0, 0, -Math.PI / 3]}>
            <capsuleGeometry args={[0.25, 1, 8, 16]} />
            <primitive object={material} />
          </mesh>
          
          {/* Braço direito */}
          <mesh castShadow position={[1.1, 0, 0]} rotation={[0, 0, Math.PI / 3]}>
            <capsuleGeometry args={[0.25, 1, 8, 16]} />
            <primitive object={material} />
          </mesh>
        </group>
        
        {/* Pernas */}
        <group position={[0, -1.2, 0]}>
          {/* Perna esquerda */}
          <mesh castShadow position={[-0.4, 0, 0]}>
            <capsuleGeometry args={[0.3, 1, 8, 16]} />
            <primitive object={material} />
          </mesh>
          
          {/* Perna direita */}
          <mesh castShadow position={[0.4, 0, 0]}>
            <capsuleGeometry args={[0.3, 1, 8, 16]} />
            <primitive object={material} />
          </mesh>
        </group>
      </group>
      
      {/* Cabeça */}
      <group ref={headRef} position={[0, 2, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.9, 32, 32]} />
          <primitive object={material} />
        </mesh>
        
        {/* Olhos */}
        <group position={[0, 0.2, 0.7]}>
          {/* Olho esquerdo */}
          <mesh castShadow position={[-0.3, 0, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <primitive object={eyeMaterial} />
          </mesh>
          
          {/* Olho direito */}
          <mesh castShadow position={[0.3, 0, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <primitive object={eyeMaterial} />
          </mesh>
        </group>
        
        {/* Boca */}
        <mesh castShadow position={[0, -0.2, 0.7]} rotation={[0, 0, Math.PI / 2]}>
          <sphereGeometry args={[0.2, 8, 2, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <primitive object={eyeMaterial} />
        </mesh>
        
        {/* Chifres */}
        <group position={[0, 0.7, 0]}>
          {/* Chifre esquerdo */}
          <mesh castShadow position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
            <coneGeometry args={[0.2, 1, 16]} />
            <primitive object={hornMaterial} />
          </mesh>
          
          {/* Chifre direito */}
          <mesh castShadow position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <coneGeometry args={[0.2, 1, 16]} />
            <primitive object={hornMaterial} />
          </mesh>
        </group>
      </group>
      
      {/* Base com texto GAYA */}
      <mesh receiveShadow position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 32]} />
        <meshStandardMaterial color={COLORS.complementary.purple} />
      </mesh>
    </group>
  );
}

// Exportar um componente GLTF caso seja necessário usar um modelo externo mais tarde
export function GayaMascotGLTF({ url, position = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, groupRef);
  
  useFloatingAnimation(groupRef, { speed: 0.8, intensity: 0.5 });
  
  React.useEffect(() => {
    // Iniciar animação quando disponível
    if (actions && actions.idle) {
      actions.idle.play();
    }
  }, [actions]);
  
  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      <primitive object={scene} />
    </group>
  );
}
