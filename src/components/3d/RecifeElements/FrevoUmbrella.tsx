import React from 'react'
import { useRef } from 'react'
import { Mesh } from 'three'

export default function FrevoUmbrella() {
  const mesh = useRef<Mesh>(null)
  return (
    <mesh ref={mesh} position={[2, 0.5, 2]} castShadow>
      <coneGeometry args={[0.7, 0.5, 8]} />
      <meshStandardMaterial color="#FF1744" />
    </mesh>
  )
} 