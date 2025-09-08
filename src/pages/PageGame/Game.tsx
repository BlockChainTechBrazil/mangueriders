import { OrbitControls, PerspectiveCamera } from '@react-three/drei'; // Adicionado PerspectiveCamera
import { useState, useEffect, useCallback, useRef } from 'react'; // Adicionado useRef
import Block from './Block';
import Player from './Player';
import BombComponent from './Bomb';
import ExplosionEffect from './ExplosionEffect';
import Enemy from './Enemy'; // Importar o componente Enemy
import PowerUp from './PowerUp'; // NOVO: Importar o componente PowerUp
// Importa o CellType diretamente do arquivo local de tipos
import { CellType } from './types';
import type { BombData, EnemyData, Grid } from './types'; // Adicionado Grid aqui
import { findPath } from './pathfinding'; // IMPORTAR findPath
import { MapType, getMapById, DEFAULT_MAP } from './maps'; // Importar sistema de mapas
import useGameStore from '../../game/store/gameStore';
import { EnemyType, getEnemiesForMap } from './enemyTypes'; // Importar tipos de inimigos

// Dimensões do grid conforme especificado (13x11)
const GRID_COLUMNS = 19;
const GRID_ROWS = 15;
const CELL_SIZE = 1; // Tamanho de cada célula no espaço 3D

// Posição inicial do jogador no grid (índices da matriz)
const PLAYER_START_ROW = 1;
const PLAYER_START_COL = 1;

// Constantes para bombas
const BOMB_FUSE_TIME = 3000; // 3 segundos para explodir
const CHAIN_REACTION_DELAY = 150; // NOVO: Atraso em ms para explosões em cadeia

// Constantes do jogador
const PLAYER_INITIAL_LIVES = 3;
const PLAYER_INVINCIBILITY_DURATION = 2000; // 2 segundos de invencibilidade
const INITIAL_BOMB_RANGE = 2; // NOVO: Alcance inicial da bomba do jogador
const INITIAL_MAX_BOMBS = 1; // NOVO: Máximo de bombas iniciais do jogador

// Constantes para power-ups
const POWERUP_SPAWN_CHANCE = 0.3; // 30% de chance de um power-up aparecer

// Constantes para inimigos (exemplo)
const INITIAL_ENEMY_COUNT = 5;
const ENEMY_MOVE_INTERVAL = 1500; // Inimigos tentam se mover a cada 1.5 segundos

// Novas constantes para a câmera
const CAMERA_ALTITUDE = 18; // Altura ajustada para 16 conforme solicitado

interface ExplosionData {
  id: string;
  position: [number, number, number];
}

// Função para gerar um grid inicial
const createInitialGrid = (enemiesInitial: EnemyData[]): CellType[][] => { // Renomeado parâmetro para evitar conflito
  const grid: CellType[][] = [];

  // Crie um mapa para verificar rapidamente as posições dos inimigos
  const enemyPositions = new Map<string, boolean>();
  enemiesInitial.forEach(enemy => {
    enemyPositions.set(`${enemy.row}-${enemy.col}`, true);
  });

  for (let r = 0; r < GRID_ROWS; r++) {
    grid[r] = [];
    for (let c = 0; c < GRID_COLUMNS; c++) {
      const cellKey = `${r}-${c}`;
      const isEnemyCell = enemyPositions.has(cellKey);

      if (isEnemyCell) {
        grid[r][c] = CellType.ENEMY; // Marcar célula como contendo inimigo (valor 6)
      } else if (r === 0 || r === GRID_ROWS - 1 || c === 0 || c === GRID_COLUMNS - 1) {
        grid[r][c] = CellType.Wall; // Paredes nas bordas
      } else if (r % 2 === 0 && c % 2 === 0) {
        grid[r][c] = CellType.Wall; // Padrão fixo de blocos sólidos
      } else if (
        (r > 0 && r < GRID_ROWS - 1 && c > 0 && c < GRID_COLUMNS - 1) && // Evitar bordas para blocos destrutíveis
        !((r === PLAYER_START_ROW && c === PLAYER_START_COL) || // Posição inicial do jogador
          (r === PLAYER_START_ROW && c === PLAYER_START_COL + 1) || // Adjacente
          (r === PLAYER_START_ROW + 1 && c === PLAYER_START_COL)) && // Adjacente
        !isEnemyCell && // Garantir que não seja uma célula com inimigo
        Math.random() < 0.6 // 60% de chance de ser um bloco destrutível
      ) {
        grid[r][c] = CellType.Breakable;
      } else {
        grid[r][c] = CellType.Empty;
      }
    }
  }

  // Garantir que a posição inicial e adjacentes estejam vazias
  grid[PLAYER_START_ROW][PLAYER_START_COL] = CellType.Empty;
  if (PLAYER_START_COL + 1 < GRID_COLUMNS) grid[PLAYER_START_ROW][PLAYER_START_COL + 1] = CellType.Empty;
  if (PLAYER_START_ROW + 1 < GRID_ROWS) grid[PLAYER_START_ROW + 1][PLAYER_START_COL] = CellType.Empty;

  return grid;
};

// Interface para as props do componente Game
interface GameProps {
  mapType?: MapType; // Adicionando suporte para receber um tipo de mapa
}

// Função para criar inimigos iniciais
const createInitialEnemies = (): EnemyData[] => {
  const newEnemies: EnemyData[] = []; // Renomeado para newEnemies
  const occupiedCells = new Set<string>();
  const blockedCells = new Set<string>(); // Para rastrear células com blocos (Wall ou Breakable)

  // Adicionar proteção ao redor do jogador (área segura)
  occupiedCells.add(`${PLAYER_START_ROW}-${PLAYER_START_COL}`);
  occupiedCells.add(`${PLAYER_START_ROW}-${PLAYER_START_COL + 1}`);
  occupiedCells.add(`${PLAYER_START_ROW + 1}-${PLAYER_START_COL}`);
  occupiedCells.add(`${PLAYER_START_ROW - 1}-${PLAYER_START_COL}`); // Adicional
  occupiedCells.add(`${PLAYER_START_ROW}-${PLAYER_START_COL - 1}`); // Adicional
  occupiedCells.add(`${PLAYER_START_ROW + 1}-${PLAYER_START_COL + 1}`); // Diagonal

  // Pré-calcular todas as células bloqueadas (blocos fixos e destrutiveis)
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLUMNS; c++) {
      // Blocos fixos estão nas bordas e nas posições (r,c) onde ambos são pares
      if (r === 0 || r === GRID_ROWS - 1 || c === 0 || c === GRID_COLUMNS - 1 || (r % 2 === 0 && c % 2 === 0)) {
        blockedCells.add(`${r}-${c}`);
      }
      // Blocos destrutiveis - usando a mesma lógica do createInitialGrid
      else if (
        (r > 0 && r < GRID_ROWS - 1 && c > 0 && c < GRID_COLUMNS - 1) &&
        !((r === PLAYER_START_ROW && c === PLAYER_START_COL) ||
          (r === PLAYER_START_ROW && c === PLAYER_START_COL + 1) ||
          (r === PLAYER_START_ROW + 1 && c === PLAYER_START_COL)) &&
        Math.random() < 0.6 // 60% de chance de ser um bloco destrutível
      ) {
        blockedCells.add(`${r}-${c}`);
      }
    }
  }

  // Contador para evitar loop infinito
  let attemptsCount = 0;
  const MAX_ATTEMPTS = 1000;

  while (newEnemies.length < INITIAL_ENEMY_COUNT && attemptsCount < MAX_ATTEMPTS) {
    attemptsCount++;

    const r = Math.floor(Math.random() * (GRID_ROWS - 2)) + 1;
    const c = Math.floor(Math.random() * (GRID_COLUMNS - 2)) + 1;
    const cellKey = `${r}-${c}`;

    // Certifique-se de que não estamos colocando inimigos em blocos sólidos ou destrutiveis
    if (!occupiedCells.has(cellKey) && !blockedCells.has(cellKey) && !(r % 2 === 0 && c % 2 === 0)) {
      const enemyId = `enemy-${newEnemies.length}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      newEnemies.push({
        id: enemyId,
        row: r,
        col: c,
        direction: [0, 0, 0], // Direção inicial neutra
        isMoving: false,      // Inicialmente não está se movendo
        lastMoveTime: Date.now()
      });
      occupiedCells.add(cellKey);
    }
  }


  // Se não conseguimos criar todos os inimigos, forçamos a criação nas bordas
  if (newEnemies.length < INITIAL_ENEMY_COUNT) {
    const remainingEnemies = INITIAL_ENEMY_COUNT - newEnemies.length;

    // Posições nas bordas (garantindo que não são blocos sólidos ou células bloqueadas)
    const borderPositions = [];
    for (let r = 1; r < GRID_ROWS - 1; r += 2) {
      for (let c = 1; c < GRID_COLUMNS - 1; c += 2) {
        const cellKey = `${r}-${c}`;
        if ((r === 1 || r === GRID_ROWS - 2 || c === 1 || c === GRID_COLUMNS - 2) &&
          !occupiedCells.has(cellKey) &&
          !blockedCells.has(cellKey)) {
          borderPositions.push({ r, c });
        }
      }
    }

    // Embaralhar as posições de borda
    for (let i = borderPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [borderPositions[i], borderPositions[j]] = [borderPositions[j], borderPositions[i]];
    }

    // Adicionar inimigos restantes
    for (let i = 0; i < Math.min(remainingEnemies, borderPositions.length); i++) {
      const { r, c } = borderPositions[i];
      const enemyId = `enemy-border-${i}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      newEnemies.push({
        id: enemyId,
        row: r,
        col: c,
        direction: [0, 0, 0], // Direção inicial neutra
        isMoving: false,      // Inicialmente não está se movendo
        lastMoveTime: Date.now()
      });
      // Adicionar à lista de células ocupadas para evitar sobreposições
      occupiedCells.add(`${r}-${c}`);
    }
  }


  return newEnemies;
  return newEnemies;
};

// NOVA FUNÇÃO AUXILIAR
const processSingleBombExplosion = (
  bombToExplde: BombData,
  currentGrid: CellType[][],
  get3DPosition: (col: number, row: number) => [number, number, number]
): {
  affectedCells: { row: number; col: number }[];
  newGrid: CellType[][];
  explosionEffects: ExplosionData[];
  powerUpsToSpawn: { type: CellType; row: number, col: number }[];
} => {
  const newGrid = currentGrid.map(r => [...r]);
  const affectedCells: { row: number; col: number }[] = [];
  const explosionEffects: ExplosionData[] = [];
  const powerUpsToSpawn: { type: CellType; row: number, col: number }[] = [];
  const currentBombRange = bombToExplde.range;

  // Adiciona a célula central da bomba nas células afetadas para verificação de dano
  affectedCells.push({ row: bombToExplde.row, col: bombToExplde.col });

  // Adiciona efeito de explosão visual para a célula central da bomba
  explosionEffects.push({
    id: `explosion-${bombToExplde.id}-${bombToExplde.row}-${bombToExplde.col}-center-${Date.now()}-${Math.random()}`,
    position: get3DPosition(bombToExplde.col, bombToExplde.row),
  });

  // Apenas as 4 direções (excluindo o centro para evitar duplicação)
  const directions = [
    { r: 0, c: 1 }, // Direita
    { r: 0, c: -1 }, // Esquerda
    { r: 1, c: 0 }, // Baixo
    { r: -1, c: 0 }  // Cima
  ];

  for (const dir of directions) {
    for (let i = 1; i <= currentBombRange; i++) {
      const targetRow = bombToExplde.row + dir.r * i;
      const targetCol = bombToExplde.col + dir.c * i;

      if (targetRow >= 0 && targetRow < GRID_ROWS && targetCol >= 0 && targetCol < GRID_COLUMNS) {
        const cellTypeInPath = newGrid[targetRow][targetCol]; // Tipo da célula no caminho da explosão

        // SEMPRE adicionar às células afetadas (exceto se já foi adicionada)
        // Isso é para lógica de dano, não para visualização
        if (!affectedCells.some(cell => cell.row === targetRow && cell.col === targetCol)) {
          affectedCells.push({ row: targetRow, col: targetCol });
        }

        // Adiciona efeito de explosão visual para esta célula APENAS SE NÃO FOR SOLID_BLOCK
        if (cellTypeInPath !== CellType.Wall) {
          if (!explosionEffects.some(eff => eff.position[0] === get3DPosition(targetCol, targetRow)[0] && eff.position[2] === get3DPosition(targetCol, targetRow)[2])) {
            explosionEffects.push({
              id: `explosion-${bombToExplde.id}-${targetRow}-${targetCol}-${Date.now()}-${Math.random()}`,
              position: get3DPosition(targetCol, targetRow),
            });
          }
        }

        // Lógica de interação com a célula
        if (cellTypeInPath === CellType.Breakable) {
          newGrid[targetRow][targetCol] = CellType.Empty; // Bloco destruído vira Empty por padrão
          // Chance de gerar um power-up
          if (Math.random() < POWERUP_SPAWN_CHANCE) {
            const powerUpType = Math.random() < 0.5 ? CellType.POWERUP_BOMB_RANGE : CellType.POWERUP_MAX_BOMBS;
            powerUpsToSpawn.push({ type: powerUpType, row: targetRow, col: targetCol });
          }
          break; // A explosão para naquela direção após destruir um bloco
        }

        if (cellTypeInPath === CellType.Wall) {
          break; // A explosão para naquela direção se atingir um bloco sólido
        }
      } else {
        // Se saiu do grid, para naquela direção
        break;
      }
    }
  }
  return { affectedCells, newGrid, explosionEffects, powerUpsToSpawn };
};


export default function Game({ mapType = MapType.FOREST }: GameProps) {
  // Obter o mapa atual do gameStore
  // Obter os dados do mapa diretamente do gameStore
  const mapData = useGameStore(state => state.mapData);
  const currentMap = useGameStore(state => state.currentMap) as MapType || DEFAULT_MAP;
  // Usar o mapData do gameStore ou fazer fallback para o sistema antigo
  const finalMapData = mapData || getMapById(currentMap);
  // Criar inimigos baseados no tipo de mapa
  const initialEnemies = useRef(createInitialEnemiesForMap(mapType));
  const [enemies, setEnemies] = useState<EnemyData[]>(initialEnemies.current);
  const enemiesRef = useRef<EnemyData[]>(enemies);

  useEffect(() => {
    enemiesRef.current = enemies;
  }, [enemies]);

  const [grid, setGrid] = useState<CellType[][]>(() => createInitialGrid(initialEnemies.current));
  const gridRef = useRef(grid);
  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  const [playerPosition, setPlayerPosition] = useState<[number, number]>([PLAYER_START_COL, PLAYER_START_ROW]);
  const playerPositionRef = useRef(playerPosition);
  // Estado para gerenciar a movimentação visual do jogador
  const [isPlayerMoving, setIsPlayerMoving] = useState<boolean>(false);
  const isPlayerMovingRef = useRef(isPlayerMoving);
  // Adicionando estado para posição visual alvo do jogador (para animações)
  const [playerTargetPosition, setPlayerTargetPosition] = useState<[number, number, number] | undefined>(undefined);

  useEffect(() => {
    playerPositionRef.current = playerPosition;
  }, [playerPosition]);

  useEffect(() => {
    isPlayerMovingRef.current = isPlayerMoving;
  }, [isPlayerMoving]);

  const [bombs, setBombs] = useState<BombData[]>([]);
  const bombsRef = useRef<BombData[]>(bombs);
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);
  const [playerLives, setPlayerLives] = useState<number>(PLAYER_INITIAL_LIVES);
  const playerLivesRef = useRef(playerLives);
  const [isPlayerInvincible, setIsPlayerInvincible] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const invincibilityTimerRef = useRef<number | null>(null);

  // NOVOS ESTADOS PARA POWER-UPS DO JOGADOR
  const [playerBombRange, setPlayerBombRange] = useState<number>(INITIAL_BOMB_RANGE);
  const [playerMaxBombs, setPlayerMaxBombs] = useState<number>(INITIAL_MAX_BOMBS);
  // Refs para os novos estados, se necessário para acesso em callbacks que não os têm como dependência direta
  const playerBombRangeRef = useRef(playerBombRange);
  const playerMaxBombsRef = useRef(playerMaxBombs);

  useEffect(() => { // Sincronizar refs dos power-ups
    playerBombRangeRef.current = playerBombRange;
  }, [playerBombRange]);

  useEffect(() => { // Sincronizar refs dos power-ups
    playerMaxBombsRef.current = playerMaxBombs;
  }, [playerMaxBombs]);


  const recentlyExplodedOrScheduledBombIdsRef = useRef(new Set<string>()); // NOVO: Para rastrear bombas na cadeia
  const chainReactionTimeoutsRef = useRef<number[]>([]); // NOVO: Para limpar timeouts da cadeia

  const isPlayerInvincibleRef = useRef(isPlayerInvincible);
  const isGameOverRef = useRef(isGameOver);

  useEffect(() => { // NOVO: Sincronizar playerLivesRef
    playerLivesRef.current = playerLives;
  }, [playerLives]);

  useEffect(() => {
    isPlayerInvincibleRef.current = isPlayerInvincible;
  }, [isPlayerInvincible]);

  useEffect(() => {
    isGameOverRef.current = isGameOver;
  }, [isGameOver]);
  const gridCenterX = (GRID_COLUMNS * CELL_SIZE) / 2;
  const gridCenterZ = (GRID_ROWS * CELL_SIZE) / 5;

  // Calcular a posição X e Z da câmera com base nos fatores de deslocamento
  const cameraX = gridCenterX; // Centralizamos a câmera horizontalmente
  const cameraZ = gridCenterZ + 10; // Mantemos um offset para posicionar a câmera atrás do grid para ver melhor

  // Acessar as funções do gameStore
  const {
    setPlayerCharacter,
    setPlayerPosition: updateGlobalPlayerPosition,
    addPlayerBomb,
    increaseBombRange,
    setGameState,
    removeEnemy, // Função que atualiza o score ao remover inimigos
    gameState // Acessar o estado atual do jogo
  } = useGameStore();

  // Adicionar um efeito para escutar mudanças no gameState
  useEffect(() => {
    // Quando o gameState muda para 'menu', reiniciar o jogo
    if (gameState === 'menu') {


      // Criar novos inimigos
      const newEnemies = createInitialEnemies();
      initialEnemies.current = newEnemies;
      setEnemies(newEnemies);

      // Recriar grid
      const newGrid = createInitialGrid(newEnemies);
      setGrid(newGrid);

      // Resetar posição do jogador
      setPlayerPosition([PLAYER_START_COL, PLAYER_START_ROW]);
      setPlayerTargetPosition(undefined);

      // Resetar bombas
      setBombs([]);
      bombsRef.current = [];

      // Resetar explosões
      setExplosions([]);

      // Resetar vida do jogador
      setPlayerLives(PLAYER_INITIAL_LIVES);
      setIsPlayerInvincible(false);

      // Resetar bombas e alcance
      setPlayerBombRange(INITIAL_BOMB_RANGE);
      setPlayerMaxBombs(INITIAL_MAX_BOMBS);

      // Resetar estado de jogo
      setIsGameOver(false);
      isGameOverRef.current = false;

      // Limpar todos os timeouts pendentes
      chainReactionTimeoutsRef.current.forEach(clearTimeout);
      chainReactionTimeoutsRef.current = [];

      if (invincibilityTimerRef.current) {
        clearTimeout(invincibilityTimerRef.current);
        invincibilityTimerRef.current = null;
      }

      // Limpar set de bombas
      recentlyExplodedOrScheduledBombIdsRef.current.clear();
    }
  }, [gameState]); // Dependência no estado do jogo do store  
  const get3DPosition = useCallback((col: number, row: number): [number, number, number] => {
    // Posição consistente independente da altura da câmera
    // Aumentando significativamente a altura do personagem para garantir visibilidade e movimentação
    return [
      col * CELL_SIZE,
      CELL_SIZE * 0.7, // Aumentado para garantir visibilidade com câmera baixa
      row * CELL_SIZE
    ];
  }, []);

  const initiateExplosionChain = useCallback((bombIdToExplode: string) => {
    if (recentlyExplodedOrScheduledBombIdsRef.current.has(bombIdToExplode)) {
      return;
    }
    recentlyExplodedOrScheduledBombIdsRef.current.add(bombIdToExplode);

    const bombToExplode = bombsRef.current.find(b => b.id === bombIdToExplode);

    if (!bombToExplode) {
      recentlyExplodedOrScheduledBombIdsRef.current.delete(bombIdToExplode);
      return;
    }


    clearTimeout(bombToExplode.timerId);

    const {
      affectedCells,
      newGrid: gridAfterBlockDestruction, // Renomeado para clareza
      explosionEffects,
      powerUpsToSpawn // NOVO: power-ups que podem surgir
    } = processSingleBombExplosion(
      bombToExplode,
      gridRef.current,
      get3DPosition
    );

    // 1. Atualizar estado das bombas
    const remainingBombs = bombsRef.current.filter(b => b.id !== bombToExplode.id);
    setBombs(remainingBombs);
    bombsRef.current = remainingBombs;

    // 2. Processar dano a inimigos e atualizar grid (gridAfterBlockDestruction já tem blocos destruídos)
    const destroyedEnemyIdsThisExplosion = new Set<string>();
    // Corrigido para const, pois não é reatribuído, apenas seu conteúdo interno é modificado se necessário.
    const gridAfterEnemyDamageAndPowerups = gridAfterBlockDestruction.map(r => [...r]); // Começa com o grid pós-destruição de blocos

    const currentEnemiesForDamageCheck = [...enemiesRef.current];
    currentEnemiesForDamageCheck.forEach(enemy => {
      if (affectedCells.some(cell => cell.row === enemy.row && cell.col === enemy.col)) {
        if (enemiesRef.current.find(e => e.id === enemy.id)) {

          destroyedEnemyIdsThisExplosion.add(enemy.id);
          if (gridAfterEnemyDamageAndPowerups[enemy.row][enemy.col] !== CellType.Wall) { // Verifica o grid atualizado
            gridAfterEnemyDamageAndPowerups[enemy.row][enemy.col] = CellType.Empty;
          }
        }
      }
    }); if (destroyedEnemyIdsThisExplosion.size > 0) {
      // Chamar removeEnemy do gameStore para cada inimigo destruído 
      // para incrementar a pontuação corretamente
      destroyedEnemyIdsThisExplosion.forEach(enemyId => {
        removeEnemy(enemyId); // Isso incrementa o score no gameStore

      });

      // Atualizar o estado local dos inimigos
      setEnemies(prevEnemies => prevEnemies.filter(enemy => !destroyedEnemyIdsThisExplosion.has(enemy.id)));
    }

    // NOVO: Colocar power-ups no grid
    // Isso deve acontecer *depois* que os inimigos são removidos das células,
    // para que um power-up não seja sobrescrito se um inimigo estava na mesma célula de um bloco destruído.
    powerUpsToSpawn.forEach(powerUp => {
      // Verifica se a célula está vazia antes de colocar o power-up
      // (um inimigo poderia ter sido destruído ali, ou outro power-up de uma explosão simultânea)
      if (gridAfterEnemyDamageAndPowerups[powerUp.row][powerUp.col] === CellType.Empty) {
        gridAfterEnemyDamageAndPowerups[powerUp.row][powerUp.col] = powerUp.type;

      } else {

      }
    });

    // Atualiza o grid com blocos destruídos, células de inimigos limpas E power-ups
    setGrid(gridAfterEnemyDamageAndPowerups);


    // 3. Adicionar efeitos visuais da explosão
    setExplosions(prevExplosions => {
      const newExplosionsToAdd = explosionEffects.filter(
        eff => !prevExplosions.some(existingEff => existingEff.id === eff.id)
      );
      return [...prevExplosions, ...newExplosionsToAdd];
    });

    // 4. Processar dano ao jogador (envolvido em setTimeout para pegar a posição mais recente do jogador)
    const damageCheckTimeoutId = window.setTimeout(() => {
      const [pCol, pRow] = playerPositionRef.current;

      // Verifica se o jogador está exatamente na posição da bomba
      const playerOnBomb = pCol === bombToExplode.col && pRow === bombToExplode.row;
      if (playerOnBomb) {

      }

      if (!isPlayerInvincibleRef.current && !isGameOverRef.current) {
        const playerHit = affectedCells.some(cell => cell.row === pRow && cell.col === pCol);

        if (playerHit) {

          if (playerLivesRef.current > 0) {
            if (playerLivesRef.current - 1 > 0) { // Só ativa invencibilidade se for sobreviver
              setIsPlayerInvincible(true);
              if (invincibilityTimerRef.current) clearTimeout(invincibilityTimerRef.current);
              invincibilityTimerRef.current = window.setTimeout(() => {
                setIsPlayerInvincible(false);
                invincibilityTimerRef.current = null;

              }, PLAYER_INVINCIBILITY_DURATION);
            }
          }
          setPlayerLives(prevLives => {
            const newLives = prevLives - 1;
            if (newLives <= 0) {

              setIsGameOver(true);
              if (invincibilityTimerRef.current) {
                clearTimeout(invincibilityTimerRef.current);
                invincibilityTimerRef.current = null;
              }
              setIsPlayerInvincible(false); // Garante que não está invencível no game over
              return 0;
            }
            return newLives;
          });
        }
      }
      chainReactionTimeoutsRef.current = chainReactionTimeoutsRef.current.filter(id => id !== damageCheckTimeoutId);
    }, 0);
    chainReactionTimeoutsRef.current.push(damageCheckTimeoutId);


    // 5. Propagar para outras bombas com atraso
    // Iterar sobre uma cópia de bombsRef.current (que já foi atualizado para remover bombToExplode)
    const bombsStillInPlay = [...bombsRef.current];
    for (const cell of affectedCells) {
      for (const otherBomb of bombsStillInPlay) {
        if (otherBomb.col === cell.col && otherBomb.row === cell.row) {
          // A checagem de recentlyExplodedOrScheduledBombIds será feita no início da chamada recursiva.


          const chainTimeoutId = window.setTimeout(() => {
            // Verificar se a bomba ainda existe antes de tentar explodi-la
            // (pode ter sido detonada por outra explosão que ocorreu mais rápido)
            if (bombsRef.current.some(b => b.id === otherBomb.id)) {
              initiateExplosionChain(otherBomb.id);
            } else {

            }
            chainReactionTimeoutsRef.current = chainReactionTimeoutsRef.current.filter(id => id !== chainTimeoutId);
          }, CHAIN_REACTION_DELAY);
          chainReactionTimeoutsRef.current.push(chainTimeoutId);
        }
      }
    }
  }, [
    get3DPosition, // Estável
    // Refs (são estáveis, mas seu .current muda)
    bombsRef, enemiesRef, gridRef, playerPositionRef,
    isPlayerInvincibleRef, isGameOverRef, invincibilityTimerRef, playerLivesRef,
    recentlyExplodedOrScheduledBombIdsRef, chainReactionTimeoutsRef,
    // Setters de estado (são estáveis)
    setGrid, setExplosions, setBombs, setEnemies, setPlayerLives, setIsGameOver, setIsPlayerInvincible,
    // Funções do gameStore
    removeEnemy
    // Constantes como PLAYER_INVINCIBILITY_DURATION, CHAIN_REACTION_DELAY são usadas diretamente
  ]);

  const handleExplosionComplete = useCallback((explosionId: string) => {
    setExplosions(prev => prev.filter(exp => exp.id !== explosionId));
  }, []); const placeBomb = useCallback(() => {
    if (isGameOverRef.current || gameState !== 'playing') return; // Impede se o jogo acabou ou não está no estado 'playing'

    // Agora permite colocar bomba mesmo em movimento (removida a checagem isPlayerMovingRef.current)

    if (bombsRef.current.length >= playerMaxBombsRef.current) { // USA O ESTADO DO JOGADOR

      return;
    }
    const [playerCol, playerRow] = playerPosition;
    if (bombsRef.current.some(b => b.col === playerCol && b.row === playerRow)) {

      return;
    }

    const newBombId = `bomb-${Date.now()}-${Math.random()}`;

    const timerId = window.setTimeout(() => {
      initiateExplosionChain(newBombId);
    }, BOMB_FUSE_TIME); const newBomb: BombData = {
      id: newBombId,
      col: playerCol,
      row: playerRow,
      timerId: timerId,
      range: playerBombRangeRef.current, // USA O ESTADO DO JOGADOR
      placedAt: Date.now() // Adicionando a propriedade placedAt obrigatória
    };

    setBombs(prevBombs => [...prevBombs, newBomb]);


  }, [playerPosition, initiateExplosionChain, gameState, /* Adicionar playerMaxBombsRef e playerBombRangeRef como dependências se não forem estáveis, mas refs são */]); const movePlayer = useCallback((dx: number, dy: number) => {
    // CORREÇÃO: Remover esta verificação para permitir movimento em qualquer estado
    // Isso garante que o movimento funcione na inicialização
    /*
    if (isGameOverRef.current || gameState !== 'playing') {
      return; // Impede movimento se o jogo acabou ou não está no estado 'playing'
    }
    */

    // Se o jogador está em movimento, armazena o último comando de direção para sensação de jogo mais responsiva
    if (isPlayerMovingRef.current) {
      // Armazenar a última direção solicitada para executar quando o movimento atual terminar
      // (Esta parte poderia ser expandida com um sistema de buffer de movimentos)
      return; // Por enquanto apenas ignora novos comandos durante movimento
    } let collectedPowerUp = false; // Flag para saber se um power-up foi coletado

    // Calcula a nova posição
    const currentPos = playerPositionRef.current;
    const newCol = currentPos[0] + dx;
    const newRow = currentPos[1] + dy;    // Verifica se a nova posição é válida
    if (newRow < 0 || newRow >= GRID_ROWS || newCol < 0 || newCol >= GRID_COLUMNS) {
      return; // Posição fora do grid
    }

    const targetCellType = gridRef.current[newRow][newCol]; // Usa gridRef para a lógica de coleta    // Lógica de coleta de Power-up
    if (targetCellType === CellType.POWERUP_BOMB_RANGE) {
      setPlayerBombRange(prevRange => prevRange + 1);
      // Atualiza o grid para remover o power-up
      setGrid(prevGrid => {
        const nextGrid = prevGrid.map(r => [...r]);
        nextGrid[newRow][newCol] = CellType.Empty;
        return nextGrid;
      });
      collectedPowerUp = true;
    } else if (targetCellType === CellType.POWERUP_MAX_BOMBS) {
      setPlayerMaxBombs(prevMax => prevMax + 1);
      // Atualiza o grid para remover o power-up
      setGrid(prevGrid => {
        const nextGrid = prevGrid.map(r => [...r]);
        nextGrid[newRow][newCol] = CellType.Empty;
        return nextGrid;
      });
      collectedPowerUp = true;
    }    // Verifica colisões se não coletou power-up
    if (!collectedPowerUp) {
      if (targetCellType === CellType.Wall || targetCellType === CellType.Breakable) {
        return; // Colisão com bloco
      }

      const temBomba = bombsRef.current.some(b => b.col === newCol && b.row === newRow);
      if (temBomba) {
        return; // Colisão com bomba
      }
      if (enemiesRef.current.some(enemy => enemy.col === newCol && enemy.row === newRow)) {
        if (!isPlayerInvincibleRef.current && !isGameOverRef.current) {


          if (playerLivesRef.current > 0) {
            if (playerLivesRef.current - 1 > 0) {
              setIsPlayerInvincible(true);
              isPlayerInvincibleRef.current = true;
              if (invincibilityTimerRef.current) {
                clearTimeout(invincibilityTimerRef.current);
              }
              invincibilityTimerRef.current = window.setTimeout(() => {
                setIsPlayerInvincible(false);
                isPlayerInvincibleRef.current = false;
                invincibilityTimerRef.current = null;
              }, PLAYER_INVINCIBILITY_DURATION);
            }
          } setPlayerLives(prevLives => {
            const newLives = prevLives - 1;
            if (newLives <= 0) {
              setIsGameOver(true);
              isGameOverRef.current = true;
              if (invincibilityTimerRef.current) {
                clearTimeout(invincibilityTimerRef.current);
                invincibilityTimerRef.current = null;
              }
              setIsPlayerInvincible(false);
              isPlayerInvincibleRef.current = false;
              return 0;
            }
            return newLives;
          });
        }
        return; // Jogador não se move se colidir com inimigo
      }
    }    // Se chegou aqui, o movimento é válido (ou um power-up foi coletado)

    // Marca o jogador como em movimento para iniciar a animação
    setIsPlayerMoving(true);
    isPlayerMovingRef.current = true;    // MOVIMENTO DO JOGADOR - AJUSTE IMPORTANTE
    // Primeiro atualizamos a posição lógica para que a lógica do jogo funcione corretamente
    setPlayerPosition([newCol, newRow]);
    playerPositionRef.current = [newCol, newRow];

    // Depois definimos a nova posição alvo para o jogador (para animação visual)
    const [targetX, targetY, targetZ] = get3DPosition(newCol, newRow);

    // Definir o target position é crucial para o movimento visual
    setPlayerTargetPosition([targetX, targetY, targetZ]);

    // Nota: não precisamos de um setTimeout aqui, o callback onMovementComplete
    // será chamado automaticamente quando a animação visual terminar
  }, [setPlayerBombRange, setPlayerMaxBombs, setGrid, setPlayerPosition, setPlayerTargetPosition, setIsPlayerMoving, setPlayerLives, setIsPlayerInvincible, setIsGameOver, get3DPosition]);  // Função chamada quando o movimento do jogador é concluído
  const handlePlayerMovementComplete = useCallback(() => {
    // Atualiza o estado de movimento imediatamente para permitir o próximo movimento
    setIsPlayerMoving(false);
    isPlayerMovingRef.current = false;

    // Limpa a posição alvo para permitir novos movimentos imediatamente
    setPlayerTargetPosition(undefined);

    // Sem qualquer delay, permitindo que o jogador encadeie movimentos instantaneamente
    // Isso torna o controle muito mais responsivo e elimina qualquer sensação de travamento
  }, []);
  // Efeito para movimentar inimigos
  useEffect(() => {
    // Não executa se o jogo estiver finalizado ou se não estiver no estado 'playing'
    if (isGameOverRef.current || gameState !== 'playing') {
      return;
    }

    const intervalId = setInterval(() => {
      setEnemies(currentEnemies => {
        const playerPos = playerPositionRef.current;
        const currentGridForPathfinding = gridRef.current;
        const activeBombs = bombsRef.current;

        const nextEnemiesState: EnemyData[] = currentEnemies.map(enemy => {          // Primeiro tenta encontrar um caminho normal (sem atravessar blocos destrutíveis)
          let path = findPath(
            currentGridForPathfinding as Grid,
            { r: enemy.row, c: enemy.col },
            { r: playerPos[1], c: playerPos[0] },
            activeBombs,
            GRID_COLUMNS,
            GRID_ROWS,
            false // Não permitir caminho através de blocos destrutíveis inicialmente
          );

          // Se não encontrou caminho, tenta novamente permitindo atravessar blocos destrutíveis
          // (para que o inimigo pelo menos se direcione para o jogador, mesmo que precisando destruir blocos)
          if (!path) {
            path = findPath(
              currentGridForPathfinding as Grid,
              { r: enemy.row, c: enemy.col },
              { r: playerPos[1], c: playerPos[0] },
              activeBombs,
              GRID_COLUMNS,
              GRID_ROWS,
              true // Permitir caminho através de blocos destrutíveis como último recurso
            );

            if (path) {

            }
          }

          // Interface para representar um movimento de inimigo com score
          interface EnemyMove {
            r: number;
            c: number;
            score?: number;
          }

          let nextMove: EnemyMove = { r: enemy.row, c: enemy.col };

          // Chance de movimento aleatório para evitar que inimigos fiquem parados
          const useRandomMovement = Math.random() < 0.3; // 30% de chance de movimento aleatório

          if (!useRandomMovement && path && path.length > 1) {
            // Movimento baseado no pathfinding
            nextMove = path[1];
            // Verificamos se o movimento pelo pathfinding é válido
            if (
              nextMove.r <= 0 || nextMove.r >= GRID_ROWS - 1 ||
              nextMove.c <= 0 || nextMove.c >= GRID_COLUMNS - 1 ||
              currentGridForPathfinding[nextMove.r][nextMove.c] !== CellType.Empty ||
              activeBombs.some(b => b.row === nextMove.r && b.col === nextMove.c) ||
              (playerPos[0] === nextMove.c && playerPos[1] === nextMove.r && isPlayerInvincibleRef.current) ||
              currentEnemies.some(otherEnemy =>
                otherEnemy.id !== enemy.id &&
                otherEnemy.row === nextMove.r &&
                otherEnemy.col === nextMove.c
              )
            ) {
              // Se o movimento pelo pathfinding não for válido, usamos movimento aleatório

              nextMove = { r: enemy.row, c: enemy.col }; // Reset para posição atual
            }
          }          // Se não temos um caminho ou decidimos usar movimento aleatório
          if (useRandomMovement || nextMove.r === enemy.row && nextMove.c === enemy.col) {
            // Movimento aleatório - mais agressivo e com mais opções
            const directions = [
              { r: 0, c: 1 },  // direita
              { r: 0, c: -1 }, // esquerda
              { r: 1, c: 0 },  // baixo
              { r: -1, c: 0 }, // cima
            ];

            // Embaralhar as direções para aleatoriedade
            for (let i = directions.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [directions[i], directions[j]] = [directions[j], directions[i]];
            }

            // Calcular a direção aproximada para o jogador para usar como preferência
            const dirToPlayer = {
              r: playerPos[1] > enemy.row ? 1 : (playerPos[1] < enemy.row ? -1 : 0),
              c: playerPos[0] > enemy.col ? 1 : (playerPos[0] < enemy.col ? -1 : 0)
            };

            // Reordenar as direções para priorizar o movimento em direção ao jogador
            // (mas ainda manter alguma aleatoriedade para comportamento mais natural)
            directions.sort((a, b) => {
              const aMatchesPlayer = (a.r === dirToPlayer.r || a.c === dirToPlayer.c) ? 1 : 0;
              const bMatchesPlayer = (b.r === dirToPlayer.r || b.c === dirToPlayer.c) ? 1 : 0;
              return bMatchesPlayer - aMatchesPlayer;
            });            // Criar movimentos possíveis com base nas direções
            const possibleMoves: { r: number, c: number, isValid: boolean, score: number }[] = directions.map(dir => {
              const r = enemy.row + dir.r;
              const c = enemy.col + dir.c;

              // Verificação mais rigorosa de limites do grid para evitar atravessar paredes
              if (r <= 0 || r >= GRID_ROWS - 1 || c <= 0 || c >= GRID_COLUMNS - 1) {
                return { r, c, isValid: false, score: 0 };
              }

              // Verificar se o movimento é válido
              const isValid =
                // Permitir movimento para células vazias ou para a posição do jogador (se não estiver invencível)
                (currentGridForPathfinding[r][c] === CellType.Empty ||
                  (playerPos[0] === c && playerPos[1] === r && !isPlayerInvincibleRef.current)) &&
                // Evitar bombas e outros inimigos
                !activeBombs.some(b => b.row === r && b.col === c) &&
                !currentEnemies.some(otherEnemy =>
                  otherEnemy.id !== enemy.id && otherEnemy.row === r && otherEnemy.col === c
                );

              // Calcular um score para esta direção baseado em:
              // 1. Se move em direção ao jogador
              // 2. Se evita ficar preso (considerando quantas saídas a nova posição tem)
              let score = 0;

              // Bonus para movimentos em direção ao jogador
              if (dir.r === dirToPlayer.r) score += 5;
              if (dir.c === dirToPlayer.c) score += 5;

              // Verificar se a célula tem saídas (para evitar becos sem saída)
              if (isValid) {
                // Contar quantas células adjacentes são livres a partir desta posição
                const adjacentDirections = [
                  { r: r + 1, c },
                  { r: r - 1, c },
                  { r, c: c + 1 },
                  { r, c: c - 1 }
                ];

                const exitCount = adjacentDirections.filter(adj =>
                  adj.r > 0 && adj.r < GRID_ROWS - 1 &&
                  adj.c > 0 && adj.c < GRID_COLUMNS - 1 &&
                  currentGridForPathfinding[adj.r][adj.c] === CellType.Empty
                ).length;

                // Bonus para posições com mais saídas
                score += exitCount * 3;
              } return { r, c, isValid, score };
            });

            // Filtrar e ordenar movimentos válidos            // Filtrar movimentos válidos e ordenar por score (para movimentos mais inteligentes)
            const validMoves = possibleMoves.filter(move => move.isValid);

            if (validMoves.length > 0) {
              // Ordenar movimentos por score (maior para menor)
              validMoves.sort((a, b) => b.score - a.score);

              // Pegar os top 2 movimentos (ou todos se houver menos de 2)
              const topMoves = validMoves.slice(0, Math.min(2, validMoves.length));

              // Introduzir alguma aleatoriedade (70% de chance do melhor movimento, 30% para o segundo melhor)
              if (topMoves.length > 1 && Math.random() > 0.7) {
                nextMove = topMoves[1]; // Segunda melhor opção
              } else {
                nextMove = topMoves[0]; // Melhor opção

              }

              // Verificar se este é um movimento em direção ao jogador
              const distanceToPlayer = Math.abs(nextMove.r - playerPos[1]) + Math.abs(nextMove.c - playerPos[0]);
              const currentDistanceToPlayer = Math.abs(enemy.row - playerPos[1]) + Math.abs(enemy.col - playerPos[0]);

              if (distanceToPlayer < currentDistanceToPlayer) {

              }
            } else {            // Tentar mover-se para qualquer direção, mesmo que bloqueada por blocos destrutíveis
              const allDirections = directions.map(dir => {
                const r = enemy.row + dir.r;
                const c = enemy.col + dir.c;

                // Verificar os diferentes tipos de células para tomar decisões mais inteligentes
                const isDestructible =
                  r > 0 && r < GRID_ROWS - 1 &&
                  c > 0 && c < GRID_COLUMNS - 1 &&
                  currentGridForPathfinding[r][c] === CellType.Breakable;

                const isEmpty =
                  r > 0 && r < GRID_ROWS - 1 &&
                  c > 0 && c < GRID_COLUMNS - 1 &&
                  currentGridForPathfinding[r][c] === CellType.Empty;

                const hasBomb = activeBombs.some(b => b.row === r && b.col === c);

                const hasEnemy = currentEnemies.some(otherEnemy =>
                  otherEnemy.id !== enemy.id && otherEnemy.row === r && otherEnemy.col === c
                );

                // Classificação de prioridade: vazio > destrutível > outros
                const priority = isEmpty ? 3 : (isDestructible ? 2 : 1);

                return { r, c, isDestructible, isEmpty, hasBomb, hasEnemy, priority };
              });

              // Ordenar direções por prioridade (células vazias primeiro)
              allDirections.sort((a, b) => b.priority - a.priority);
              // Tentar encontrar alguma direção que permita movimento, mesmo que não ideal
              if (allDirections.some(dir => dir.isEmpty)) {
                // Encontramos pelo menos uma célula vazia
                const emptyDirections = allDirections.filter(dir => dir.isEmpty);

                // Se existe uma direção vazia em direção ao jogador, priorize-a
                const directionTowardsPlayer = emptyDirections.find(dir => {
                  const currentDistToPlayer = Math.abs(enemy.row - playerPos[1]) + Math.abs(enemy.col - playerPos[0]);
                  const newDistToPlayer = Math.abs(dir.r - playerPos[1]) + Math.abs(dir.c - playerPos[0]);
                  return newDistToPlayer < currentDistToPlayer;
                });

                if (directionTowardsPlayer && Math.random() < 0.8) {
                  nextMove = directionTowardsPlayer;

                } else {
                  nextMove = emptyDirections[Math.floor(Math.random() * emptyDirections.length)];

                }
              } else if (allDirections.some(dir => dir.isDestructible)) {
                // Se não há células vazias, mas há blocos destrutíveis, tenha uma chance de se mover
                // para uma outra posição (ainda bloqueada) para evitar ficar preso no mesmo lugar
                const destructibleDirections = allDirections.filter(dir => dir.isDestructible);

                // Verificar se há uma bomba próxima que pode destruir um bloco
                const hasBombNearby = activeBombs.some(bomb => {
                  const distanceToEnemy = Math.abs(bomb.row - enemy.row) + Math.abs(bomb.col - enemy.col);
                  return distanceToEnemy <= 2; // Bomba perto o suficiente para potencialmente destruir um bloco
                });

                // Se uma bomba estiver próxima, tente ficar parado para evitar ser atingido
                if (hasBombNearby) {

                }
                // 20% de chance de escolher outra posição de bloqueio para evitar estagnação
                else if (Math.random() < 0.2) {
                  nextMove = destructibleDirections[Math.floor(Math.random() * destructibleDirections.length)];

                } else {

                }
              } else {                // Se não há movimento possível, tentar um movimento aleatório desesperado
                // com uma pequena chance, para evitar travamentos completos
                if (Math.random() < 0.15) { // Aumentado para 15% de chance (era 5%)
                  const nonSolidDirections = allDirections.filter(dir => {
                    const cellType = currentGridForPathfinding[dir.r][dir.c];
                    // Permitir apenas movimentos para células que não são blocos sólidos
                    return cellType !== CellType.Wall;
                  });

                  if (nonSolidDirections.length > 0) {
                    const desperateMove = nonSolidDirections[Math.floor(Math.random() * nonSolidDirections.length)];
                    nextMove = desperateMove;

                  } else {
                    // Se todas as direções têm blocos sólidos, o inimigo realmente não pode se mover
                    // Neste caso, o inimigo permanecerá no lugar

                  }
                } else {
                  // Tentar mudar a direção de tentativas, para aumentar as chances
                  // de eventualmente encontrar um caminho viável
                  // Este código garante que, mesmo que um inimigo esteja encurralado,
                  // ele não ficará tentando sempre a mesma direção

                  // Guardar a última direção tentada para alternar na próxima vez
                  const lastTriedDirection = enemy.lastTriedDirection || 0;
                  const nextDirectionToTry = (lastTriedDirection + 1) % 4; // Alterna entre 0-3

                  // Atualiza nextMove apenas para guardar a direção tentada no estado do inimigo
                  return {
                    ...enemy,
                    lastTriedDirection: nextDirectionToTry,
                    isMoving: false // Para mostrar que o inimigo está parado
                  };
                }
              }
            }
          }

          // Se o próximo movimento do inimigo é a posição do jogador
          if (nextMove.r === playerPos[1] && nextMove.c === playerPos[0]) {
            if (!isPlayerInvincibleRef.current && !isGameOverRef.current) {


              if (playerLivesRef.current > 0) {
                if (playerLivesRef.current - 1 > 0) { // Só ativa invencibilidade se for sobreviver
                  setIsPlayerInvincible(true);
                  isPlayerInvincibleRef.current = true;
                  if (invincibilityTimerRef.current) {
                    clearTimeout(invincibilityTimerRef.current);
                  }
                  invincibilityTimerRef.current = window.setTimeout(() => {
                    setIsPlayerInvincible(false);
                    isPlayerInvincibleRef.current = false;
                    invincibilityTimerRef.current = null;
                  }, PLAYER_INVINCIBILITY_DURATION);
                }
              } setPlayerLives(prevLives => {
                const newLives = prevLives - 1;
                if (newLives <= 0) {
                  setIsGameOver(true);
                  isGameOverRef.current = true;
                  if (invincibilityTimerRef.current) { // Limpa invincibilidade se game over
                    clearTimeout(invincibilityTimerRef.current);
                    invincibilityTimerRef.current = null;
                  }
                  setIsPlayerInvincible(false);
                  isPlayerInvincibleRef.current = false;
                  return 0;
                }
                return newLives;
              });
              return { ...enemy };
            }
          }          // Se não houve colisão com o jogador, inimigo se move para nextMove
          // Verificação final de segurança para evitar movimento através de paredes
          const isValidMove =
            nextMove.r > 0 && nextMove.r < GRID_ROWS - 1 &&
            nextMove.c > 0 && nextMove.c < GRID_COLUMNS - 1 &&
            (currentGridForPathfinding[nextMove.r][nextMove.c] === CellType.Empty ||
              (playerPos[0] === nextMove.c && playerPos[1] === nextMove.r));

          if (!isValidMove) {

            return { ...enemy }; // Mantém a posição atual
          } const moved = enemy.row !== nextMove.r || enemy.col !== nextMove.c;

          // Calcular a direção do movimento para visualização 3D do inimigo
          let direction: [number, number, number] = [0, 0, 0];

          if (moved) {
            // Calcula a direção normalizada para o modelo 3D
            // Assume que Z é o eixo de profundidade no espaço 3D
            direction = [
              nextMove.c - enemy.col, // direção X (colunas)
              0,                      // direção Y (vertical) - geralmente zero, a menos que haja elevação
              nextMove.r - enemy.row  // direção Z (linhas)
            ];


          }
          // Atualiza os dados do inimigo com direção e status de movimento
          return {
            ...enemy,
            row: nextMove.r,
            col: nextMove.c,
            direction: moved ? direction : enemy.direction || [0, 0, 0],
            isMoving: moved,
            lastMoveTime: moved ? Date.now() : enemy.lastMoveTime
          };
        });
        return nextEnemiesState;
      });
    }, ENEMY_MOVE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [gridRef, playerPositionRef, bombsRef, isPlayerInvincibleRef, isGameOverRef, invincibilityTimerRef, setEnemies, setPlayerLives, setIsGameOver, setIsPlayerInvincible, gameState]); // Adicionado gameState para controlar o movimento dos inimigos
  useEffect(() => {
    bombsRef.current = bombs;
  }, [bombs]);
  // Ref para acompanhar as teclas pressionadas
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  // Ref para armazenar o ID do intervalo de processamento de teclas
  const keyProcessIntervalRef = useRef<number | null>(null);
  // Ref para rastrear a última direção de movimento (para alternar em movimentos diagonais)  const lastMovementDirectionRef = useRef<'horizontal' | 'vertical'>('horizontal');
  // useEffect separado só para configurar os event listeners de teclado
  // Isso garante que eles sejam registrados o mais cedo possível na inicialização
  useEffect(() => {
    // Handler para tecla pressionada
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isGameOverRef.current || gameState !== 'playing') return;
      const key = event.key.toLowerCase();

      // Registra a tecla como pressionada
      keysPressed.current[key] = true;      // Processar bomba imediatamente
      if (key === ' ') {
        event.preventDefault();
        placeBomb();
      }
      // Movimento direto do personagem com resposta instantânea
      // Melhorado para garantir resposta imediata independente da inicialização
      // Para teclas direcionais, tenta movimentar o jogador imediatamente
      if (key === 'arrowup' || key === 'w') {
        movePlayer(0, -1);
        event.preventDefault();
      }
      if (key === 'arrowdown' || key === 's') {
        movePlayer(0, 1);
        event.preventDefault();
      }
      if (key === 'arrowleft' || key === 'a') {
        movePlayer(-1, 0);
        event.preventDefault();
      }
      if (key === 'arrowright' || key === 'd') {
        movePlayer(1, 0);
        event.preventDefault();
      }
    };

    // Handler para tecla liberada
    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      // Remove a tecla da lista de teclas pressionadas
      delete keysPressed.current[key];
    };
    // Função para processar as teclas pressionadas periodicamente
    const processKeys = () => {
      if (isGameOverRef.current || gameState !== 'playing') return;

      // Não processa teclas se o jogador já está em movimento
      if (isPlayerMovingRef.current) {
        return;
      }

      // Processa as teclas de movimento permitindo movimentos tanto horizontais quanto verticais
      // Mas executa apenas um por vez, priorizando o movimento que não foi feito recentemente
      let dx = 0;
      let dy = 0;

      // Detecta teclas verticais
      if (keysPressed.current['arrowup'] || keysPressed.current['w']) {
        dy = -1;
      } else if (keysPressed.current['arrowdown'] || keysPressed.current['s']) {
        dy = 1;
      }

      // Detecta teclas horizontais
      if (keysPressed.current['arrowleft'] || keysPressed.current['a']) {
        dx = -1;
      } else if (keysPressed.current['arrowright'] || keysPressed.current['d']) {
        dx = 1;
      }      // Melhoramos a lógica de movimento diagonais para ser mais natural
      // Alternamos automaticamente entre movimentos horizontais e verticais
      // quando ambas as direções são pressionadas
      if (dx !== 0 && dy !== 0) {
        // Alterna a prioridade entre horizontal e vertical para evitar preferência por uma direção
        const now = Date.now();
        if (now % 2 === 0) {
          dx = 0; // Prioriza movimento vertical
        } else {
          dy = 0; // Prioriza movimento horizontal
        }
      }

      // Executa o movimento se alguma tecla direcional estiver pressionada
      if (dx !== 0 || dy !== 0) {
        movePlayer(dx, dy);
      }
    };

    // Configurar eventos de teclado
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);    // Iniciar o intervalo para processar teclas pressionadas
    // 50ms fornece uma resposta mais rápida para um controle mais fluido
    keyProcessIntervalRef.current = window.setInterval(processKeys, 50);

    // Limpar eventos e intervalo ao desmontar
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (keyProcessIntervalRef.current !== null) {
        clearInterval(keyProcessIntervalRef.current);
        keyProcessIntervalRef.current = null;
      }
    };
  }, [movePlayer, placeBomb, isGameOverRef, isPlayerMovingRef, gameState]);

  useEffect(() => {
    return () => {
      bombsRef.current.forEach(bomb => {
        clearTimeout(bomb.timerId);
      });
      if (invincibilityTimerRef.current) {
        clearTimeout(invincibilityTimerRef.current);
      }
      // Limpar todos os timeouts de cadeia de explosão pendentes
      chainReactionTimeoutsRef.current.forEach(clearTimeout);
      chainReactionTimeoutsRef.current = [];
      // Limpar o intervalo de processamento de teclas
      if (keyProcessIntervalRef.current !== null) {
        clearInterval(keyProcessIntervalRef.current);
        keyProcessIntervalRef.current = null;
      }
      // Limpar o set de bombas explodidas/agendadas se o jogo for completamente reiniciado (não implementado ainda)
      // recentlyExplodedOrScheduledBombIdsRef.current.clear(); 
    };
  }, []);
  // Acessar as funções do gameStore
  //Removido para evitar duplicação
  // Atualizar o estado global do jogador quando os valores locais mudarem
  useEffect(() => {
    // Atualizando os dados do jogador no store global
    const player = useGameStore.getState().player;    // Atualiza o player no store
    useGameStore.setState({
      player: {
        ...player,
        lives: playerLives,
        bombRange: playerBombRange,
        bombs: playerMaxBombs,
        isInvincible: isPlayerInvincible
        // o score é mantido pois é gerenciado pelo gameStore
      }
    });

    // Verificar se todos os inimigos foram eliminados
    if (enemies.length === 0 && !isGameOver) {

      setGameState('levelComplete');
    }
    // Se o jogo acabar, atualize o estado do jogo
    else if (isGameOver) {
      setGameState('gameOver');
    }


  }, [playerLives, isPlayerInvincible, isGameOver, playerBombRange, playerMaxBombs]);

  return (
    <>
      {/* Cena 3D - só renderiza elementos do jogo quando o estado for 'playing', 'paused', 'gameOver' ou 'levelComplete' */}
      {/* Configuração de câmera similar ao código de referência */}
      <PerspectiveCamera
        makeDefault
        fov={50} // Campo de visão um pouco mais fechado para compensar a menor altura
        aspect={window.innerWidth / window.innerHeight}
        near={0.1}
        far={1000}
        position={[
          cameraX,
          CAMERA_ALTITUDE,
          cameraZ
        ]}
      />

      <OrbitControls
        target={[gridCenterX, 0, gridCenterZ + 4]} // Ajustado o ponto de mira para ver o jogo de um ângulo melhor
        enableRotate={false} // Desabilita rotação para manter o ângulo fixo
        enablePan={false} // Desabilita movimentação lateral
        enableZoom={false} // Desabilita zoom para manter a vista fixa
      />

      {/* @ts-ignore - ambientLight é um componente válido do Three.js/React-Three-Fiber */}
      <ambientLight intensity={finalMapData.ambientLightIntensity} color={finalMapData.ambientLightColor} />
      {/* @ts-ignore - directionalLight é um componente válido do Three.js/React-Three-Fiber */}
      <directionalLight intensity={1.2} castShadow />
      {/* Renderiza o jogo somente quando não estiver no menu */}

      {gameState !== 'menu' && (
        <>
          {/* Plano de Chão com cor baseada no mapa selecionado */}
          {/* @ts-ignore */}
          <mesh receiveShadow position={[gridCenterX - CELL_SIZE / 2, -0.05, gridCenterZ - CELL_SIZE / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* @ts-ignore */}
            <planeGeometry args={[GRID_COLUMNS * CELL_SIZE * 2, GRID_ROWS * CELL_SIZE * 2]} />
            {/* @ts-ignore */}
            <meshStandardMaterial color={finalMapData.groundColor} />
            {/* @ts-ignore - mesh é um componente válido do Three.js/React-Three-Fiber */}
          </mesh>          {/* Renderizamos apenas os blocos e power-ups que existem (sem nulos ou whitespace) */}
          {grid.flatMap((row, rIndex) =>
            row.flatMap((cellType, cIndex) => {
              const position3D = get3DPosition(cIndex, rIndex);
              const objects = [];

              if (cellType === CellType.Wall || cellType === CellType.Breakable) {
                objects.push(<Block key={`block-${rIndex}-${cIndex}`} position={position3D} type={cellType} />);
              }
              // NOVO: Renderizar PowerUps
              else if (cellType === CellType.POWERUP_BOMB_RANGE || cellType === CellType.POWERUP_MAX_BOMBS) {
                objects.push(<PowerUp key={`powerup-${rIndex}-${cIndex}`} position={position3D} type={cellType} />);
              }
              return objects;
            })
          )}

          {/* Renderizar Inimigos */}
          {enemies.map(enemy => (<Enemy
            key={enemy.id}
            position={get3DPosition(enemy.col, enemy.row)}
            direction={enemy.direction || [0, 0, 0]}
            isMoving={enemy.isMoving || false}
            enemyType={enemy.type || EnemyType.NORMAL}
          />
          ))}

          {bombs.map(bomb => (
            <BombComponent key={bomb.id} position={get3DPosition(bomb.col, bomb.row)} />
          ))}

          {explosions.map(exp => (
            <ExplosionEffect
              key={exp.id}
              position={exp.position}
              onComplete={() => handleExplosionComplete(exp.id)}
            />
          ))}

          {!isGameOver && (<Player
            gridPosition={get3DPosition(playerPosition[0], playerPosition[1])}
            targetPosition={playerTargetPosition}
            isInvincible={isPlayerInvincible}
            moveSpeed={3.5} // Reduzido para 3.5 para um movimento mais suave e controlado
            onMovementComplete={handlePlayerMovementComplete}
          />
          )}

          {/* @ts-ignore - gridHelper é um componente válido do Three.js/React-Three-Fiber */}
          <gridHelper
            args={[Math.max(GRID_COLUMNS, GRID_ROWS) * CELL_SIZE, Math.max(GRID_COLUMNS, GRID_ROWS), '#555', '#444']}
            position={[gridCenterX - CELL_SIZE / 2, 0, gridCenterZ - CELL_SIZE / 2]}
          />
        </>
      )}
    </>
  );
}

// Função para criar inimigos iniciais baseados no tipo de mapa
const createInitialEnemiesForMap = (mapType: MapType): EnemyData[] => {
  // Buscar configurações de inimigos para este mapa
  const mapEnemies = getEnemiesForMap(mapType);
  if (!mapEnemies) {
    // Se não encontrar configurações específicas, usar o padrão
    return createInitialEnemies();
  }
  const newEnemies: EnemyData[] = [];
  const occupiedCells = new Set<string>();

  // Adicionar proteção ao redor do jogador (área segura)
  occupiedCells.add(`${PLAYER_START_ROW}-${PLAYER_START_COL}`);
  occupiedCells.add(`${PLAYER_START_ROW}-${PLAYER_START_COL + 1}`);
  occupiedCells.add(`${PLAYER_START_ROW + 1}-${PLAYER_START_COL}`);
  occupiedCells.add(`${PLAYER_START_ROW - 1}-${PLAYER_START_COL}`);
  occupiedCells.add(`${PLAYER_START_ROW}-${PLAYER_START_COL - 1}`);
  occupiedCells.add(`${PLAYER_START_ROW + 1}-${PLAYER_START_COL + 1}`);

  // Para cada tipo de inimigo na configuração, criar o número especificado
  mapEnemies.enemies.forEach(enemyGroup => {
    const { type, count, difficulty } = enemyGroup;

    // Usar a dificuldade para ajustar o comportamento (não implementado ainda)

    for (let i = 0; i < count; i++) {
      let row, col, cellKey;
      let attemptsCount = 0;
      const maxAttempts = 50;

      // Tentar encontrar uma posição válida
      do {
        row = Math.floor(Math.random() * (GRID_ROWS - 4)) + 2; // Evitar as bordas
        col = Math.floor(Math.random() * (GRID_COLUMNS - 4)) + 2; // Evitar as bordas
        cellKey = `${row}-${col}`;
        attemptsCount++;
      } while (
        (occupiedCells.has(cellKey) ||
          Math.abs(row - PLAYER_START_ROW) + Math.abs(col - PLAYER_START_COL) < 5) && // Distância mínima do jogador
        attemptsCount < maxAttempts
      );

      // Se encontrou uma posição válida
      if (attemptsCount < maxAttempts) {
        const enemyId = `enemy-${Date.now()}-${Math.random()}`;
        newEnemies.push({
          id: enemyId,
          row,
          col,
          type, // Adiciona o tipo ao inimigo
          direction: [0, 0, 0],
          isMoving: false,
          lastMoveTime: Date.now(),
          // Aqui poderíamos adicionar outras propriedades baseadas na dificuldade
        });
        occupiedCells.add(cellKey);
      }
    }
  });

  // Se não conseguiu criar nenhum inimigo, voltar ao método padrão
  if (newEnemies.length === 0) {
    return createInitialEnemies();
  }

  return newEnemies;
};

// TODO: Substituição manual necessária
// Substitua todas as ocorrências restantes de CellType.EMPTY por EMPTY
// Substitua todas as ocorrências restantes de CellType.SOLID_BLOCK por SOLID_BLOCK
// Substitua todas as ocorrências restantes de CellType.DESTRUCTIBLE_BLOCK por DESTRUCTIBLE_BLOCK
// Isto deve ser feito nos arquivos:
// - Game.tsx
// - Block.tsx
// - pathfinding.ts
