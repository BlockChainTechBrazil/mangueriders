// @ts-nocheck
import React from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { useEffect } from "react";
import GameUI from "../game/components/ui/GameUI";
import Game from "./PageGame/Game";
import { MapType } from "./PageGame/maps";
import useGameStore from "../game/store/gameStore";
import { Navigate } from "react-router-dom";

const GamePageMultiplayer = () => {
  // Use apenas as props que realmente precisamos
  const { roomId, playersInLobby } = useGameStore();

  // Efeito para desativar o scroll e esconder o Header ao entrar na página do jogo
  useEffect(() => {
    // Salva o estilo de overflow original do body
    const originalOverflow = document.body.style.overflow;
    // Desativa o scroll
    document.body.style.overflow = "hidden";

    // Esconde o Header
    const headerElement = document.querySelector("header");
    if (headerElement) {
      headerElement.style.display = "none";
    }

    // Ajusta o padding-top do conteúdo para compensar a ausência do header
    const contentWrapper = document.querySelector(".content-wrapper");
    if (contentWrapper) {
      contentWrapper.style.paddingTop = "0";
    }

    // Limpa os efeitos ao sair da página
    return () => {
      // Restaura o scroll
      document.body.style.overflow = originalOverflow;

      // Restaura a exibição do Header
      if (headerElement) {
        headerElement.style.display = "block";
      }

      // Restaura o padding original
      if (contentWrapper) {
        contentWrapper.style.paddingTop = "5rem";
      }
    };
  }, []);

  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "placeBomb", keys: ["Space"] },
  ];

  // Redirecionar de volta ao lobby se não estiver em uma sala
  if (!roomId) {
    return <Navigate to="/multiplayer" replace />;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{ position: [0, 10, 10], fov: 60 }} gl={{ antialias: true }}
          style={{ background: "#87CEEB" }}
        >
          <Game mapType={MapType.FOREST} />
          {/* Debug helpers (descomente para adicionar) */}
          {/* <gridHelper args={[100, 100]} /> */}
          {/* <axesHelper args={[10]} /> */}
        </Canvas>
      </KeyboardControls>
      <GameUI isMultiplayer={true} />
    </div>
  );
};

export default GamePageMultiplayer;
