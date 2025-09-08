import { OrbitControls, Environment } from '@react-three/drei'
import MascotGaya from './MascotGaya'
import Beach from './RecifeElements/Beach'
import Buildings from './RecifeElements/Buildings'
import FrevoUmbrella from './RecifeElements/FrevoUmbrella'
import Boat from './RecifeElements/Boat'
import PalmTree from './RecifeElements/PalmTree'

export default function Scene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <Beach />
      <Buildings />
      <FrevoUmbrella />
      <Boat />
      <PalmTree />
      <MascotGaya />
      <Environment preset="sunset" />
      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  )
} 