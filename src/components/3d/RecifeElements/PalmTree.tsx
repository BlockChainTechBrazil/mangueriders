import React from 'react'

export default function PalmTree() {
  return (
    <group position={[-3, 0, 3]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.2, 2, 8]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[0, 1, 0]} castShadow>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#00C853" />
      </mesh>
    </group>
  )
} 