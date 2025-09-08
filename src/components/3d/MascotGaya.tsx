import React from 'react'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

export default function MascotGaya() {
  const mesh = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.z = Math.sin(clock.getElapsedTime()) * 0.2
    }
  })
  return (
    <mesh ref={mesh} position={[0, 0.5, 0]} castShadow>
      <coneGeometry args={[0.3, 1, 32]} />
      <meshStandardMaterial color="#FF1744" />
    </mesh>
  )
} 