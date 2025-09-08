import React from 'react'

export default function Buildings() {
  return (
    <group position={[-6, 0, -4]}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[i * 2, 1, 0]} castShadow>
          <boxGeometry args={[1, 3 + Math.random() * 2, 1]} />
          <meshStandardMaterial color="#0099FF" />
        </mesh>
      ))}
    </group>
  )
} 