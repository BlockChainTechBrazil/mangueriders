import { BLOCK_TYPES, MAPS } from './constants';

/**
 * Gera um mapa aleatório baseado no tipo de mapa
 * @param {string} mapType - Tipo de mapa (FOREST, CAVE, etc.)
 * @returns {Array} - Matriz 2D representando o mapa
 */
export const generateMap = (mapType) => {
  const mapConfig = MAPS[mapType];
  if (!mapConfig) return null;
  
  const { width, height } = mapConfig.size;
  const map = Array(height).fill().map(() => Array(width).fill(BLOCK_TYPES.EMPTY));
  
  // Adiciona paredes nas bordas
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        map[y][x] = BLOCK_TYPES.WALL;
      }
    }
  }
  
  // Adiciona paredes fixas em posições alternadas (estilo Bomberman)
  for (let y = 2; y < height - 2; y += 2) {
    for (let x = 2; x < width - 2; x += 2) {
      map[y][x] = BLOCK_TYPES.WALL;
    }
  }
  
  // Adiciona blocos destrutíveis aleatoriamente
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      // Pula posições onde já existem paredes
      if (map[y][x] === BLOCK_TYPES.WALL) continue;
      
      // Deixa espaço livre para o jogador começar (geralmente nos cantos)
      if ((x === 1 && y === 1) || 
          (x === 1 && y === 2) || 
          (x === 2 && y === 1) ||
          (x === width - 2 && y === height - 2) ||
          (x === width - 3 && y === height - 2) ||
          (x === width - 2 && y === height - 3)) {
        continue;
      }
      
      // 40% de chance de gerar um bloco destrutível
      if (Math.random() < 0.4) {
        map[y][x] = BLOCK_TYPES.DESTRUCTIBLE;
      }
    }
  }
  
  // Adiciona características específicas do mapa
  switch (mapType) {
    case 'FOREST':
      // Adiciona água em algumas áreas
      addWaterPatches(map, 3);
      break;
    case 'CAVE':
      // Mais paredes fixas
      addExtraWalls(map, 5);
      break;
    case 'DESERT':
      // Mais espaços abertos
      removeRandomDestructibles(map, 0.3);
      break;
    case 'SWAMP':
      // Mais água
      addWaterPatches(map, 6);
      break;
    case 'ARENA':
      // Mapa simétrico para PvP
      makeMapSymmetric(map);
      break;
    default:
      break;
  }
  
  // Adiciona ovos de dinossauro escondidos
  addDinoEggs(map, mapType);
  
  return map;
};

/**
 * Adiciona manchas de água ao mapa
 * @param {Array} map - Matriz do mapa
 * @param {number} count - Número de manchas de água
 */
const addWaterPatches = (map, count) => {
  const height = map.length;
  const width = map[0].length;
  
  for (let i = 0; i < count; i++) {
    // Escolhe um ponto inicial aleatório que não seja uma parede
    let startX, startY;
    do {
      startX = Math.floor(Math.random() * (width - 4)) + 2;
      startY = Math.floor(Math.random() * (height - 4)) + 2;
    } while (map[startY][startX] === BLOCK_TYPES.WALL);
    
    // Cria uma mancha de água de tamanho aleatório
    const patchSize = Math.floor(Math.random() * 3) + 2;
    for (let y = startY; y < Math.min(startY + patchSize, height - 1); y++) {
      for (let x = startX; x < Math.min(startX + patchSize, width - 1); x++) {
        if (map[y][x] !== BLOCK_TYPES.WALL) {
          map[y][x] = BLOCK_TYPES.WATER;
        }
      }
    }
  }
};

/**
 * Adiciona paredes extras ao mapa
 * @param {Array} map - Matriz do mapa
 * @param {number} count - Número de paredes extras
 */
const addExtraWalls = (map, count) => {
  const height = map.length;
  const width = map[0].length;
  
  for (let i = 0; i < count; i++) {
    // Escolhe um ponto inicial aleatório que não seja uma borda
    const startX = Math.floor(Math.random() * (width - 4)) + 2;
    const startY = Math.floor(Math.random() * (height - 4)) + 2;
    
    // Decide se a parede será horizontal ou vertical
    const isHorizontal = Math.random() > 0.5;
    
    // Tamanho da parede
    const wallSize = Math.floor(Math.random() * 3) + 2;
    
    if (isHorizontal) {
      for (let x = startX; x < Math.min(startX + wallSize, width - 1); x++) {
        map[startY][x] = BLOCK_TYPES.WALL;
      }
    } else {
      for (let y = startY; y < Math.min(startY + wallSize, height - 1); y++) {
        map[y][startX] = BLOCK_TYPES.WALL;
      }
    }
  }
};

/**
 * Remove blocos destrutíveis aleatoriamente para criar espaços abertos
 * @param {Array} map - Matriz do mapa
 * @param {number} probability - Probabilidade de remover um bloco destrutível
 */
const removeRandomDestructibles = (map, probability) => {
  const height = map.length;
  const width = map[0].length;
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (map[y][x] === BLOCK_TYPES.DESTRUCTIBLE && Math.random() < probability) {
        map[y][x] = BLOCK_TYPES.EMPTY;
      }
    }
  }
};

/**
 * Torna o mapa simétrico para PvP
 * @param {Array} map - Matriz do mapa
 */
const makeMapSymmetric = (map) => {
  const height = map.length;
  const width = map[0].length;
  
  // Copia a metade superior para a metade inferior
  for (let y = 0; y < Math.floor(height / 2); y++) {
    for (let x = 0; x < width; x++) {
      map[height - 1 - y][x] = map[y][x];
    }
  }
  
  // Copia a metade esquerda para a metade direita
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < Math.floor(width / 2); x++) {
      map[y][width - 1 - x] = map[y][x];
    }
  }
};

/**
 * Adiciona ovos de dinossauro escondidos no mapa
 * @param {Array} map - Matriz do mapa
 * @param {string} mapType - Tipo de mapa
 */
const addDinoEggs = (map, mapType) => {
  const height = map.length;
  const width = map[0].length;
  
  // Número de ovos baseado no tipo de mapa
  let eggCount;
  switch (mapType) {
    case 'FOREST':
      eggCount = 3;
      break;
    case 'CAVE':
      eggCount = 2;
      break;
    case 'DESERT':
      eggCount = 1;
      break;
    case 'SWAMP':
      eggCount = 2;
      break;
    case 'ARENA':
      eggCount = 0; // Sem ovos na arena PvP
      break;
    default:
      eggCount = 1;
  }
  
  // Adiciona os ovos em blocos destrutíveis
  let eggsAdded = 0;
  while (eggsAdded < eggCount) {
    const x = Math.floor(Math.random() * (width - 2)) + 1;
    const y = Math.floor(Math.random() * (height - 2)) + 1;
    
    if (map[y][x] === BLOCK_TYPES.DESTRUCTIBLE) {
      // Marca este bloco destrutível como contendo um ovo
      // Na implementação real, precisaríamos de uma estrutura de dados adicional
      // para rastrear quais blocos contêm ovos
      eggsAdded++;
    }
  }
};

/**
 * Verifica se há colisão entre um objeto e o mapa
 * @param {Object} position - Posição do objeto {x, y}
 * @param {Array} map - Matriz do mapa
 * @param {Array} blockTypes - Tipos de blocos que causam colisão
 * @returns {boolean} - true se houver colisão
 */
export const checkCollision = (position, map, blockTypes = [BLOCK_TYPES.WALL, BLOCK_TYPES.DESTRUCTIBLE]) => {
  if (!map) return false;
  
  // Converte a posição do mundo para coordenadas do grid
  const gridX = Math.floor(position.x);
  const gridY = Math.floor(position.y);
  
  // Verifica se está dentro dos limites do mapa
  if (gridX < 0 || gridY < 0 || gridY >= map.length || gridX >= map[0].length) {
    return true; // Colisão com os limites do mapa
  }
  
  // Verifica se o tipo de bloco na posição causa colisão
  return blockTypes.includes(map[gridY][gridX]);
};

/**
 * Calcula as posições afetadas por uma explosão
 * @param {Object} bombPosition - Posição da bomba {x, y}
 * @param {number} range - Alcance da explosão
 * @param {Array} map - Matriz do mapa
 * @returns {Array} - Array de posições afetadas pela explosão
 */
export const calculateExplosionPositions = (bombPosition, range, map) => {
  if (!map) return [bombPosition];
  
  const positions = [bombPosition]; // Posição central
  const directions = [
    { dx: 1, dy: 0 },  // direita
    { dx: -1, dy: 0 }, // esquerda
    { dx: 0, dy: 1 },  // baixo
    { dx: 0, dy: -1 }  // cima
  ];
  
  // Para cada direção, expande a explosão até o alcance ou até encontrar um obstáculo
  directions.forEach(dir => {
    for (let i = 1; i <= range; i++) {
      const x = bombPosition.x + (dir.dx * i);
      const y = bombPosition.y + (dir.dy * i);
      
      // Verifica se está dentro dos limites do mapa
      if (x < 0 || y < 0 || y >= map.length || x >= map[0].length) {
        break;
      }
      
      // Adiciona a posição à lista de posições afetadas
      positions.push({ x, y });
      
      // Se encontrar uma parede, para a explosão nessa direção
      if (map[y][x] === BLOCK_TYPES.WALL) {
        break;
      }
      
      // Se encontrar um bloco destrutível, inclui na explosão mas não continua
      if (map[y][x] === BLOCK_TYPES.DESTRUCTIBLE) {
        break;
      }
    }
  });
  
  return positions;
};

/**
 * Gera um power-up aleatório
 * @returns {string} - Chave do power-up
 */
export const generateRandomPowerUp = () => {
  const powerUps = [
    'BOMB_UP',
    'FIRE_UP',
    'SPEED_UP',
    'FULL_ARMOR',
    'REMOTE_BOMB',
    'KICK',
    'PASS',
    'RANDOMIZER'
  ];
  
  const randomIndex = Math.floor(Math.random() * powerUps.length);
  return powerUps[randomIndex];
};

/**
 * Calcula a posição inicial do jogador com base no mapa
 * @param {Array} map - Matriz do mapa
 * @param {number} playerIndex - Índice do jogador (0-3 para até 4 jogadores)
 * @returns {Object} - Posição inicial {x, y}
 */
export const getPlayerStartPosition = (map, playerIndex = 0) => {
  if (!map) return { x: 1, y: 1 };
  
  const height = map.length;
  const width = map[0].length;
  
  // Posições iniciais nos cantos do mapa
  const startPositions = [
    { x: 1, y: 1 },                    // Canto superior esquerdo
    { x: width - 2, y: 1 },            // Canto superior direito
    { x: 1, y: height - 2 },           // Canto inferior esquerdo
    { x: width - 2, y: height - 2 }    // Canto inferior direito
  ];
  
  return startPositions[playerIndex % 4];
};

