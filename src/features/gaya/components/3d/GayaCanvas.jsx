import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Billboard,
  Loader,
} from "@react-three/drei";
import "@/features/gaya/utils/three-polyfills";
import { useScroll } from "framer-motion";

// Importar componentes personalizados
import { GayaMascot } from "./GayaMascot";
import RecifeEnvironment from "./RecifeEnvironment";
import { BitcoinModel } from "./BitcoinModel";

// Desativar explicitamente o carregamento de modelos do jogo
if (typeof window !== "undefined") {
  window.SKIP_GAME_ASSETS = true;
  window.LOAD_WALLET = false;
  window.LOAD_NFT = false;
  window.LOAD_GAME = false;
  window.LOAD_3D_MODELS = false;
}

const LoadingScreen = () => (
  <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gaya-darkGray z-50">
    <div className="flex flex-col items-center">
      <div className="w-32 h-32 relative">
        <div className="absolute inset-0 bg-gaya-primary rounded-full animate-pulse"></div>
      </div>
      <h2 className="text-gaya-white text-3xl font-bold mt-8">
        Carregando GAYA
      </h2>
      <p className="text-gaya-lightGray mt-2">
        Preparando a experiência recifense...
      </p>
    </div>
  </div>
);

// Componente para gerenciamento da câmera - versão extremamente reduzida
const CameraController = ({ scrollPosition }) => {
  const { camera } = useThree();
  const cameraRef = useRef(camera);

  useEffect(() => {
    cameraRef.current = camera;
    // Inicialização da câmera em posição ajustada para melhor visualização do Bitcoin
    cameraRef.current.position.set(0, 3, 8); // Ajustado para ver melhor o Bitcoin
    cameraRef.current.lookAt(0, 2, 0); // Focando na altura do Bitcoin
  }, [camera]);

  useFrame(() => {
    // Move a câmera com base na posição de rolagem, com limites bem restritos
    if (typeof scrollPosition.get === "function") {
      const scroll = scrollPosition.get();
      // Limitamos o efeito do scroll na câmera com valores mínimos
      const scrollFactor = Math.max(0, Math.min(0.3, scroll)); // Limita entre 0 e 0.3
      const targetY = 3 - scrollFactor * 2; // Valores muito mais suaves

      // Suavização extremamente lenta da movimentação da câmera
      cameraRef.current.position.y =
        cameraRef.current.position.y +
        (targetY - cameraRef.current.position.y) * 0.02;

      // Ajusta o lookAt para focar no Bitcoin e depois descer suavemente
      const lookAtY = Math.max(1, cameraRef.current.position.y - 1);
      cameraRef.current.lookAt(0, lookAtY, 0);
    }
  });

  return null;
};

// Efeitos 3D Flutuantes - drasticamente reduzidos
const FloatingEffects = () => {
  return (
    <group>
      {" "}
      {Array(3)
        .fill()
        .map((_, i) => (
          <group key={i}>
            <Billboard
              position={[
                Math.sin(i / 3) * 5, // Reduzido drasticamente
                Math.cos(i / 2) * 1.5 + 1.5, // Reduzido drasticamente
                Math.sin(i) * -3 - 2, // Reduzido drasticamente
              ]}
            >
              <mesh>
                <sphereGeometry args={[0.15, 12, 12]} />{" "}
                {/* Tamanho muito menor */}
                <meshStandardMaterial
                  color={
                    i % 3 === 0
                      ? "#FF5A00"
                      : i % 3 === 1
                      ? "#00B2FF"
                      : "#FFCC00"
                  }
                  emissive={
                    i % 3 === 0
                      ? "#FF5A00"
                      : i % 3 === 1
                      ? "#00B2FF"
                      : "#FFCC00"
                  }
                  emissiveIntensity={0.3} // Reduzido ainda mais
                  transparent
                  opacity={0.5} // Mais transparente
                />{" "}
              </mesh>
            </Billboard>
          </group>
        ))}
    </group>
  );
};

// Componente principal do Canvas 3D
const GayaCanvas = ({ scrollContainer }) => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    container: scrollContainer,
    smooth: 0.05, // Suavização ainda maior no scroll
    offset: ["start start", "end start"], // Aumentar visibilidade inicial
  });

  return (
    <>
      <Canvas
        shadows
        dpr={[0.8, 1.5]} // Reduzido para melhorar performance
        className="fixed top-0 left-0 w-full h-screen gaya-canvas"
        ref={scrollRef}
        gl={{ antialias: false }} // Desativar antialias para melhor performance
        frameloop="demand" // Renderizar apenas quando necessário
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          {/* Controladores e Câmera */}{" "}
          <PerspectiveCamera
            makeDefault
            position={[0, 3, 7]} // Reduzido drasticamente
            fov={45} // Reduzido drasticamente
          />
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 6} // Ainda mais restritivo
            maxPolarAngle={Math.PI / 3} // Muito mais restritivo
            minAzimuthAngle={-Math.PI / 8} // Extremamente restritivo
            maxAzimuthAngle={Math.PI / 8} // Extremamente restritivo
            enableDamping
            dampingFactor={0.1} // Aumento do damping para movimentos mais lentos
          />
          <CameraController scrollPosition={scrollYProgress} />
          {/* Ambiente 3D de Recife */}
          <RecifeEnvironment />
          {/* Efeitos flutuantes drasticamente reduzidos */}
          <FloatingEffects />{" "}
          {/* Mascote GAYA - posição e escala muito mais reduzidas */}
          <GayaMascot position={[0, 0.5, -0.5]} scale={0.5} />
          {/* Bitcoin centralizado (será substituído pelo GAYA token) */}
          <BitcoinModel
            position={[0, 2.5, 0.5]}
            scale={2}
            rotationSpeed={0.5}
          />
          {/* Ambiente de luz e reflexos */}
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
      <Loader
        containerStyles={{
          background:
            "linear-gradient(135deg, #FF5A00 0%, #FF00AA 50%, #A200FF 100%)",
        }}
        innerStyles={{
          background: "#ffffff",
          width: "50%",
        }}
        barStyles={{
          background: "#FFCC00",
        }}
        dataStyles={{
          color: "#ffffff",
          fontSize: "1rem",
          fontWeight: "bold",
        }}
        dataInterpolation={(p) => `Carregando GAYA... ${p.toFixed(0)}%`}
      />
    </>
  );
};

export default GayaCanvas;
