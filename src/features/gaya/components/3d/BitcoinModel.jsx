import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "@/styles/gaya/colors";

// Componente que cria uma moeda Bitcoin 3D
export function BitcoinModel({
  position = [0, 0, 0],
  scale = 1,
  rotationSpeed = 0.5,
}) {
  const groupRef = useRef();
  const coinRef = useRef();

  // Textura para o símbolo do Bitcoin
  const coinMaterial = useRef(
    new THREE.MeshStandardMaterial({
      color: COLORS.accent.DEFAULT,
      emissive: COLORS.accent.DEFAULT,
      metalness: 0.8,
      roughness: 0.2,
      emissiveIntensity: 0.4,
    })
  );

  // Animação de rotação da moeda
  useFrame(({ clock }) => {
    if (coinRef.current) {
      // Rotação principal da moeda
      coinRef.current.rotation.y += 0.01 * rotationSpeed;

      // Pequena oscilação para efeito mais dinâmico
      const oscilation = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      groupRef.current.position.y = position[1] + oscilation;

      // Efeito de brilho pulsante
      const pulseIntensity = Math.sin(clock.getElapsedTime() * 2) * 0.2 + 0.4;
      if (coinMaterial.current) {
        coinMaterial.current.emissiveIntensity = pulseIntensity;
      }
    }
  });

  // Criar o símbolo B sobreposto na moeda
  const createBitcoinSymbol = () => {
    return (
      <group position={[0, 0, 0.21]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 32, 1]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 32, 1]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 32, 1]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh position={[0.06, 0, 0]}>
          <boxGeometry args={[0.2, 0.7, 0.04]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      </group>
    );
  };

  // Criar o mesmo símbolo para o verso da moeda (rotacionado)
  const createReverseBitcoinSymbol = () => {
    return (
      <group position={[0, 0, -0.21]} rotation={[0, Math.PI, 0]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 32, 1]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 32, 1]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.05, 32, 1]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh position={[0.06, 0, 0]}>
          <boxGeometry args={[0.2, 0.7, 0.04]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      </group>
    );
  };

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      <group ref={coinRef}>
        {/* Corpo da moeda */}
        <mesh>
          <cylinderGeometry args={[1, 1, 0.2, 64]} />
          <primitive object={coinMaterial.current} />
        </mesh>

        {/* Borda da moeda */}
        <mesh>
          <torusGeometry args={[1, 0.1, 16, 64]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Símbolo Bitcoin Frente */}
        {createBitcoinSymbol()}

        {/* Símbolo Bitcoin Verso */}
        {createReverseBitcoinSymbol()}

        {/* Efeito de brilho ao redor da moeda */}
        <mesh>
          <torusGeometry args={[1.2, 0.03, 16, 64]} />
          <meshStandardMaterial
            color="#FFFFFF"
            emissive="#FFFFFF"
            emissiveIntensity={0.8}
            transparent={true}
            opacity={0.7}
          />
        </mesh>
      </group>
    </group>
  );
}

export default BitcoinModel;
