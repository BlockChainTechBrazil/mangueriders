// Utilitário de depuração para o jogo

// Função para registrar mensagens de depuração no console
export const logDebug = (message, data = null) => {
  console.log(`[DEBUG] ${message}`, data || '');
};

// Função para registrar erros no console
export const logError = (message, error = null) => {
  console.error(`[ERROR] ${message}`, error || '');
};

// Função para registrar informações sobre o estado do jogo
export const logGameState = (gameStore) => {
  const {
    gameState,
    currentMap,
    mapData,
    player,
    enemies,
    activeBombs
  } = gameStore;
  
  console.group('Game State');
  console.log('Game State:', gameState);
  console.log('Current Map:', currentMap);
  console.log('Map Data:', mapData ? `${mapData.length}x${mapData[0].length}` : 'null');
  console.log('Player:', player);
  console.log('Enemies:', enemies.length);
  console.log('Active Bombs:', activeBombs.length);
  console.groupEnd();
};

// Função para visualizar o mapa no console
export const visualizeMap = (mapData) => {
  if (!mapData) {
    console.log('No map data to visualize');
    return;
  }
  
  const symbols = {
    0: '⬛', // Empty
    1: '⬜', // Wall
    2: '🟫', // Destructible
    3: '💣', // Bomb
    4: '💥', // Explosion
    5: '🎁', // Power-up
    6: '🥚', // Dino Egg
    7: '🟦', // Water
    8: '🌀', // Portal
  };
  
  let visualization = '';
  
  for (let y = 0; y < mapData.length; y++) {
    let row = '';
    for (let x = 0; x < mapData[y].length; x++) {
      row += symbols[mapData[y][x]] || '❓';
    }
    visualization += row + '\n';
  }
  
  console.log('Map Visualization:');
  console.log(visualization);
};

// Função para visualizar a posição do jogador no mapa
export const visualizePlayerPosition = (mapData, playerPosition) => {
  if (!mapData || !playerPosition) {
    console.log('Cannot visualize player position');
    return;
  }
  
  const symbols = {
    0: '⬛', // Empty
    1: '⬜', // Wall
    2: '🟫', // Destructible
    3: '💣', // Bomb
    4: '💥', // Explosion
    5: '🎁', // Power-up
    6: '🥚', // Dino Egg
    7: '🟦', // Water
    8: '🌀', // Portal
  };
  
  const playerX = Math.floor(playerPosition.x);
  const playerY = Math.floor(playerPosition.y);
  
  let visualization = '';
  
  for (let y = 0; y < mapData.length; y++) {
    let row = '';
    for (let x = 0; x < mapData[y].length; x++) {
      if (x === playerX && y === playerY) {
        row += '🟢'; // Player
      } else {
        row += symbols[mapData[y][x]] || '❓';
      }
    }
    visualization += row + '\n';
  }
  
  console.log('Player Position Visualization:');
  console.log(visualization);
  console.log(`Player at: (${playerPosition.x}, ${playerPosition.y})`);
};

// Exporta todas as funções
export default {
  logDebug,
  logError,
  logGameState,
  visualizeMap,
  visualizePlayerPosition
};

