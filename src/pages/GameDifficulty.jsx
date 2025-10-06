import React, { useState } from 'react';
import GamePage from './GamePage';
import DifficultyMenu from '../components/DifficultyMenu';

export default function GameDifficulty() {
  const [difficulty, setDifficulty] = useState(null); // null significa que o menu está ativo

  const handleSelectDifficulty = (numEnemies) => {
    setDifficulty(numEnemies);
  };

  return (
    <div className="game-container h-screen overflow-hidden">
      {difficulty === null ? (
        <DifficultyMenu onSelectDifficulty={handleSelectDifficulty} />
      ) : (
        <GamePage numEnemies={difficulty} />
      )}
    </div>
  );
}