import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Scene from '../components/3d/Scene'
import HeroSection from '../components/ui/HeroSection'
import AboutSection from '../components/ui/AboutSection'
import TokenomicsSection from '../components/ui/TokenomicsSection'
import RoadmapSection from '../components/ui/RoadmapSection'
import CommunitySection from '../components/ui/CommunitySection'
import FAQSection from '../components/ui/FAQSection'
import FooterSection from '../components/ui/FooterSection'

export default function GayaLandingPage() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-b from-blue-300 to-yellow-100">
      <Canvas
        className="fixed inset-0 z-0"
        camera={{ position: [0, 2, 10], fov: 60 }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <main className="relative z-10 pointer-events-none">
        <HeroSection />
        <AboutSection />
        <TokenomicsSection />
        <RoadmapSection />
        <CommunitySection />
        <FAQSection />
        <FooterSection />
      </main>
    </div>
  )
} 