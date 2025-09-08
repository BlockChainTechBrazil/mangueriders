import React from 'react'
import { useRef } from 'react'
import { Mesh } from 'three'

export default function Boat() {
  const mesh = useRef<Mesh>(null)
  return (
    <mesh ref={mesh} position={[5, -0.5, 3]} castShadow>
      <boxGeometry args={[1.5, 0.3, 0.5]} />
      <meshStandardMaterial color="#00C853" />
    </mesh>
  )
} 