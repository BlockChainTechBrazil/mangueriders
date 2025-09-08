import React from "react";
import useGameStore from "../../store/gameStore";
import { CHARACTERS, MAPS } from "../../utils/constants";
import MainMenu from "./MainMenu";
import GameHUD from "./GameHUD";
import PauseMenu from "./PauseMenu";
import GameOverScreen from "./GameOverScreen";
import LevelCompleteScreen from "./LevelCompleteScreen";

const GameUI = ({ isMultiplayer = false }) => {
  const { gameState, player, setGameState, resetGame } = useGameStore();

  // Manipuladores de eventos
  const handleStartGame = () => {
    setGameState("playing");
  };

  const handlePauseGame = () => {
    setGameState("paused");
  };

  const handleResumeGame = () => {
    setGameState("playing");
  };

  const handleRestartGame = () => {
    console.log("Reiniciando o jogo...");
    resetGame();
    setGameState("menu");
  };

  // No modo multiplayer, não mostrar o menu principal
  if (isMultiplayer && gameState === "menu") {
    return null;
  }

  // Renderiza a UI com base no estado do jogo
  const renderGameUI = () => {
    switch (gameState) {
      case "menu":
        return (
          <MainMenu
            characters={Object.values(CHARACTERS)}
            maps={Object.values(MAPS)}
            onStartGame={handleStartGame}
          />
        );
      case "playing":
        return (
          <GameHUD
            player={player}
            onPause={handlePauseGame}
            isMultiplayer={isMultiplayer}
          />
        );
      case "paused":
        return (
          <PauseMenu
            onResume={handleResumeGame}
            onRestart={handleRestartGame}
            isMultiplayer={isMultiplayer}
          />
        );
      case "gameOver":
        return (
          <GameOverScreen
            score={player.score}
            onRestart={handleRestartGame}
            isMultiplayer={isMultiplayer}
          />
        );
      case "levelComplete":
        return (
          <LevelCompleteScreen
            score={player.score}
            onNextLevel={handleRestartGame}
            onMainMenu={handleRestartGame}
            isMultiplayer={isMultiplayer}
          />
        );
      default:
        return null;
    }
  };

  return <div className="game-ui">{renderGameUI()}</div>;
};

export default GameUI;
