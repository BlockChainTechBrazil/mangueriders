import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { useEffect } from 'react';
import GameUI from '../game/components/ui/GameUI';
import Game from './PageGame/Game';

const GamePage = () => {
  // Efeito para desativar o scroll e esconder o Header ao entrar na página do jogo
  useEffect(() => {
    // Salva o estilo de overflow original do body
    const originalOverflow = document.body.style.overflow;
    // Desativa o scroll
    document.body.style.overflow = 'hidden';
    
    // Esconde o Header
    const headerElement = document.querySelector('header');
    if (headerElement) {
      headerElement.style.display = 'none';
    }
    
    // Ajusta o padding-top do conteúdo para compensar a ausência do header
    const contentWrapper = document.querySelector('.content-wrapper');
    if (contentWrapper) {
      contentWrapper.style.paddingTop = '0';
    }
    
    // Limpa os efeitos ao sair da página
    return () => {
      // Restaura o scroll
      document.body.style.overflow = originalOverflow;
      
      // Restaura a exibição do Header
      if (headerElement) {
        headerElement.style.display = 'block';
      }
      
      // Restaura o padding original
      if (contentWrapper) {
        contentWrapper.style.paddingTop = '5rem'; // 20px em rem (equivalente a pt-20)
      }
    };
  }, []);

  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'right', keys: ['ArrowRight', 'KeyD'] },
    { name: 'space', keys: ['Space'] },
    { name: 'escape', keys: ['Escape', 'KeyP'] },
  ];

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <KeyboardControls map={keyboardMap}>
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-4/5 h-4/5 relative shadow-2xl rounded-lg overflow-hidden">
            <Canvas
              shadows
              className="w-full h-full"
              gl={{ 
                antialias: true,  
                alpha: true,
                preserveDrawingBuffer: true,
                logarithmicDepthBuffer: true,
                physicallyCorrectLights: true,
                toneMapping: 'ACESFilmic',
                precision: "highp"
              }}
              camera={{
                fov: 60,
                position: [15, 15, 15],
                near: 0.1,
                far: 1000
              }}
              onCreated={({ gl, scene }) => {
                gl.setClearColor("#222222");
                gl.setPixelRatio(window.devicePixelRatio);
                scene.background = new THREE.Color("#222222");
              }}
            >
              <color attach="background" args={["#222222"]} />
              <Game />
            </Canvas>
          </div>
        </div>
        
        {/* UI Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <GameUI />
        </div>
      </KeyboardControls>
    </div>
  );
};

export default GamePage;

