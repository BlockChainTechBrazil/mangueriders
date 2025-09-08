import React, { useState, useEffect } from "react";
import useGameStore from "../game/store/gameStore";
import PlayerSetup from "../components/PlayerSetup.tsx";
import MultiplayerLobby from "./MultiplayerLobby.tsx";

const MultiplayerPage = () => {
  // Verifica o estado inicial do jogador no store
  const player = useGameStore((state) => state.player);
  const [isPlayerSetupComplete, setPlayerSetupComplete] = useState(
    !!(player && player.name && player.character)
  );

  // Efeito para observar mudanças no estado do jogador
  useEffect(() => {
    const unsubscribe = useGameStore.subscribe(
      (state) => state.player,
      (player) => {
        if (player && player.name && player.character) {
          setPlayerSetupComplete(true);
        }
      }
    );
    return unsubscribe; // Limpa a inscrição ao desmontar
  }, []);

  const handleSetupComplete = () => {
    setPlayerSetupComplete(true);
  };

  if (!isPlayerSetupComplete) {
    return <PlayerSetup onSetupComplete={handleSetupComplete} />;
  }

  return <MultiplayerLobby />;
};

export default MultiplayerPage;
