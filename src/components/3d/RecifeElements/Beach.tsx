import React from 'react'
import { useRef } from 'react'
import { Mesh } from 'three'

export default function Beach() {
  const mesh = useRef<Mesh>(null)
  return (
    <mesh ref={mesh} position={[0, -1, 0]} receiveShadow>
      <boxGeometry args={[20, 0.5, 10]} />
      <meshStandardMaterial color="#FFD600" />
    </mesh>
  )
} 