// @ts-nocheck
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import Block from './Block';
import Player from './Player';
import BombComponent from './Bomb';
import ExplosionEffect from './ExplosionEffect';
import { CellType } from './types';
import type { BombData, Grid } from './types';
import type { PlayerData } from './playerTypes';
import React from 'react';
import { MapType, getMapById, DEFAULT_MAP } from './maps';
import useGameStore from '../../game/store/gameStore';
import { realtimeDb } from '../../services/firebase';
import { ref, onValue, off, set, update } from 'firebase/database';
import OtherPlayer from './OtherPlayer';

const GRID_COLUMNS = 18;
const GRID_ROWS = 16;
const CELL_SIZE = 1;

const BOMB_FUSE_TIME = 3000; // 3 segundos para explodir
const CHAIN_REACTION_DELAY = 150;
const PLAYER_INVINCIBILITY_DURATION = 2000;
const INITIAL_BOMB_RANGE = 2;
const INITIAL_MAX_BOMBS = 1;
const CAMERA_ALTITUDE = 16;

// Posições de spawn para até 5 jogadores
const SPAWN_POSITIONS = [
  { row: 1, col: 1 },   // Canto superior esquerdo
  { row: 1, col: GRID_COLUMNS - 2 },  // Canto superior direito
  { row: GRID_ROWS - 2, col: 1 },     // Canto inferior esquerdo
  { row: GRID_ROWS - 2, col: GRID_COLUMNS - 2 }, // Canto inferior direito
  { row: Math.floor(GRID_ROWS / 2), col: Math.floor(GRID_COLUMNS / 2) } // Centro
];

interface ExplosionData {
  id: string;
  position: [number, number, number];
}

interface MultiplayerGameProps {
  roomId: string;
}

const MultiplayerGame: React.FC<MultiplayerGameProps> = ({ roomId }) => {
  const {
    player: localPlayer,
    roomId: storeRoomId,
    playersInLobby,
    setGameState
  } = useGameStore();

  // Estado para rastrear o ID do host
  const [hostId, setHostId] = useState<string | null>(null);

  const [grid, setGrid] = useState<Grid>([]);
  const [bombs, setBombs] = useState<BombData[]>([]);
  const [explosions, setExplosions] = useState<ExplosionData[]>([]);
  const [powerUps, setPowerUps] = useState<any[]>([]); // Simplificado para este exemplo
  const [activePlayers, setActivePlayers] = useState<PlayerData[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [mapType, setMapType] = useState<MapType>(DEFAULT_MAP);

  const playerRef = useRef<any>(null);
  const gridRef = useRef<Grid>([]);
  const bombsRef = useRef<BombData[]>([]);

  // Referência às unsubscribe functions para os listeners do Firebase
  const listenersRef = useRef<{ [key: string]: () => void }>({});

  // Inicialização do jogo
  useEffect(() => {
    // Validação do roomId
    if (!roomId) {
      console.error("RoomId não fornecido para o MultiplayerGame");
      return;
    }

    console.log(`Iniciando jogo multiplayer na sala: ${roomId}`);

    // Inicialização do mapa
    initializeGame();

    // Configuração dos listeners para o Firebase
    setupFirebaseListeners();

    // Limpeza ao desmontar
    return () => {
      cleanupFirebaseListeners();
    };
  }, [roomId]);
  // Configuração dos listeners do Firebase
  const setupFirebaseListeners = () => {
    const gameStateRef = ref(realtimeDb, `rooms/${roomId}/gameState`);
    const playersRef = ref(realtimeDb, `rooms/${roomId}/players`);
    const bombsRef = ref(realtimeDb, `rooms/${roomId}/gameState/bombs`);
    const hostRef = ref(realtimeDb, `rooms/${roomId}/host`);

    // Listener para obter o hostId
    const hostListener = onValue(hostRef, (snapshot) => {
      const hostIdFromDb = snapshot.val();
      console.log("Host ID da sala (jogo):", hostIdFromDb);
      console.log("ID do jogador atual (jogo):", localPlayer?.id);
      console.log("É o host?", hostIdFromDb === localPlayer?.id);
      setHostId(hostIdFromDb);
    });

    // Listener para o estado do jogo
    const gameStateListener = onValue(gameStateRef, (snapshot) => {
      const gameState = snapshot.val();
      if (!gameState) return;

      if (gameState.status === 'ended') {
        setGameEnded(true);
        setWinner(gameState.winner);
      }
    });

    // Listener para mudanças nos jogadores
    const playersListener = onValue(playersRef, (snapshot) => {
      const players = snapshot.val();
      if (!players) return;

      const activePlayers = Object.values(players) as PlayerData[];
      setActivePlayers(activePlayers);

      // Verifica se apenas um jogador está vivo (vencedor)
      const alivePlayers = activePlayers.filter(p => p.isAlive);
      if (gameStarted && alivePlayers.length === 1 && activePlayers.length > 1) {
        const winner = alivePlayers[0];
        endGame(winner.name);
      }
    });

    // Listener para bombas
    const bombsListener = onValue(bombsRef, (snapshot) => {
      const bombsData = snapshot.val();
      if (!bombsData) {
        setBombs([]);
        return;
      }

      const bombsList = Object.values(bombsData) as BombData[];
      setBombs(bombsList);

      // Processa as explosões das bombas
      bombsList.forEach(bomb => {
        const now = Date.now();
        if (now - bomb.placedAt >= BOMB_FUSE_TIME && !bomb.exploded) {
          handleBombExplosion(bomb.id);
        }
      });
    });    // Salva as referências para limpeza posteriormente
    listenersRef.current = {
      gameState: () => off(gameStateRef, 'value', gameStateListener),
      players: () => off(playersRef, 'value', playersListener),
      bombs: () => off(bombsRef, 'value', bombsListener),
      host: () => off(hostRef, 'value', hostListener)
    };
  };

  // Limpeza dos listeners do Firebase
  const cleanupFirebaseListeners = () => {
    Object.values(listenersRef.current).forEach(unsubscribe => unsubscribe());
  };

  // Inicializa o jogo com o mapa e posições dos jogadores
  const initializeGame = () => {
    // Carrega o mapa padrão (pode ser alterado para receber o mapa do Firebase)
    const mapData = getMapById(mapType);

    // Inicializa o grid do jogo
    const newGrid: Grid = [];

    for (let row = 0; row < GRID_ROWS; row++) {
      newGrid[row] = [];
      for (let col = 0; col < GRID_COLUMNS; col++) {
        if (mapData && mapData.grid && mapData.grid[row] && typeof mapData.grid[row][col] !== 'undefined') {
          // Converter valor 2 (Block) para 1 (Wall) para garantir compatibilidade
          const cellValue = mapData.grid[row][col];
          newGrid[row][col] = cellValue === 2 ? CellType.Wall : cellValue;
        } else {
          // Se não houver dados do mapa, usar um padrão
          if (row === 0 || row === GRID_ROWS - 1 || col === 0 || col === GRID_COLUMNS - 1) {
            newGrid[row][col] = CellType.Wall; // Bordas são muros          } else if (row % 2 === 0 && col % 2 === 0) {
            newGrid[row][col] = CellType.Wall; // Blocos inquebraveis em posições alternadas
          } else {
            // Randomizar entre espaço vazio e blocos quebráveis
            newGrid[row][col] = Math.random() < 0.5 ? CellType.Breakable : CellType.Empty;
          }
        }        // Garantir que as posições de spawn estejam livres
        SPAWN_POSITIONS.forEach(pos => {
          if (row === pos.row && col === pos.col) {
            newGrid[row][col] = CellType.Empty;

            // Também limpar células adjacentes para dar espaço ao jogador
            // Certifique-se de que a linha existe antes de tentar acessá-la
            if (row > 0 && newGrid[row - 1]) newGrid[row - 1][col] = CellType.Empty;
            if (col > 0) newGrid[row][col - 1] = CellType.Empty;
            if (row < GRID_ROWS - 1 && newGrid[row + 1]) newGrid[row + 1][col] = CellType.Empty;
            if (col < GRID_COLUMNS - 1) newGrid[row][col + 1] = CellType.Empty;
          }
        });
      }
    }

    setGrid(newGrid);
    gridRef.current = newGrid;

    // Posicionar os jogadores nas posições de spawn
    const gameStateRef = ref(realtimeDb, `rooms/${roomId}/gameState`);
    update(gameStateRef, {
      grid: newGrid,
      startedAt: Date.now(),
      status: 'playing'
    });

    // Posicionar os jogadores nas posições de spawn (se já não estiverem posicionados)
    positionPlayersAtSpawn();

    setGameStarted(true);
  };

  // Posiciona os jogadores nas posições de spawn
  const positionPlayersAtSpawn = () => {
    const updates: { [path: string]: any } = {};

    playersInLobby.forEach((player, index) => {
      const spawnPos = SPAWN_POSITIONS[index % SPAWN_POSITIONS.length];
      updates[`rooms/${roomId}/players/${player.id}/position`] = {
        x: spawnPos.col * CELL_SIZE,
        y: 0.5, // Altura do jogador acima do solo
        z: spawnPos.row * CELL_SIZE
      };
    });

    update(ref(realtimeDb), updates);
  };

  // Processa a explosão de uma bomba
  const handleBombExplosion = (bombId: string) => {
    // Atualizar estado da bomba no Firebase
    const bombRef = ref(realtimeDb, `rooms/${roomId}/gameState/bombs/${bombId}`);
    update(bombRef, { exploded: true });

    // Criar explosão visual (será processada pelo cliente)
    const bomb = bombs.find(b => b.id === bombId);
    if (bomb) {
      createExplosion(bomb.position[0], bomb.position[1], bomb.position[2], bomb.range || INITIAL_BOMB_RANGE);
    }

    // Remover a bomba após alguns segundos
    setTimeout(() => {
      set(bombRef, null);
    }, 1000);
  };

  // Cria uma explosão visual
  const createExplosion = (x: number, y: number, z: number, range: number) => {
    const newExplosion: ExplosionData = {
      id: `explosion-${Date.now()}-${x}-${z}`,
      position: [x, y, z]
    };

    setExplosions(prev => [...prev, newExplosion]);

    // Remover a explosão após 1 segundo
    setTimeout(() => {
      setExplosions(prev => prev.filter(exp => exp.id !== newExplosion.id));
    }, 1000);

    // Checamos danos aos jogadores e blocos quebráveis
    // Esta parte seria implementada em uma versão completa
  };

  // Finaliza o jogo
  const endGame = (winnerName: string) => {
    // Atualizar o estado do jogo no Firebase
    const gameStateRef = ref(realtimeDb, `rooms/${roomId}/gameState`);
    update(gameStateRef, {
      status: 'ended',
      winner: winnerName,
      endedAt: Date.now()
    });

    setGameEnded(true);
    setWinner(winnerName);

    // Após alguns segundos, redirecionar para o lobby
    setTimeout(() => {
      setGameState('menu');
    }, 5000);
  };
  // Renderiza os blocos do mapa de forma otimizada sem elementos nulos ou whitespace
  const renderBlocks = () => {
    const blocks = [];

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const cellType = grid[row][col];

        if (cellType === CellType.Wall || cellType === CellType.Breakable) {
          blocks.push(
            <Block
              key={`block-${row}-${col}`}
              position={[col * CELL_SIZE, 0.5, row * CELL_SIZE]}
              type={cellType}
            />
          );
        }
      }
    }

    return blocks;
  };

  // Renderiza as bombas
  const renderBombs = () => {
    return bombs.map(bomb => (
      <BombComponent
        key={bomb.id}
        position={bomb.position}
        fuseTime={BOMB_FUSE_TIME}
        exploded={bomb.exploded}
      />
    ));
  };

  // Renderiza as explosões
  const renderExplosions = () => {
    return explosions.map(explosion => (<ExplosionEffect
      key={explosion.id}
      position={explosion.position}
      onComplete={() => { }}
    />
    ));
  };

  // Renderiza o jogador local, outros jogadores e o bot
  const renderPlayers = () => {
    return activePlayers.map(playerData => {
      // Determinar se este é o jogador local
      const isLocalPlayer = playerData.id === localPlayer.id;
      const isBot = playerData.isBot;

      if (isLocalPlayer) {
        return (<Player
          key={playerData.id}
          position={[
            playerData.position.x,
            playerData.position.y,
            playerData.position.z
          ]}
          characterType={playerData.character}
          roomId={roomId}
          playerId={playerData.id}
          grid={grid}
        />
        );
      } else if (isBot) {
        return (
          <OtherPlayer
            key={playerData.id}
            position={[
              playerData.position.x,
              playerData.position.y,
              playerData.position.z
            ]}
            characterType={playerData.character}
            playerId={playerData.id}
            isBot={true}
            aiLevel={playerData.aiLevel || 'medium'}
            grid={grid}
            // Aqui será implementada a lógica de IA nas próximas etapas
          />
        );
      } else {
        return (
          <OtherPlayer
            key={playerData.id}
            position={[
              playerData.position.x,
              playerData.position.y,
              playerData.position.z
            ]}
            characterType={playerData.character}
            playerId={playerData.id}
          />
        );
      }
    });
  };

  // Interface do jogo (tela de fim de jogo, etc.)
  const renderGameUI = () => {
    if (gameEnded && winner) {
      return (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h2>Fim de Jogo!</h2>
          <p>{winner} venceu!</p>
          <p>Voltando ao lobby em alguns segundos...</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Piso do jogo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[GRID_COLUMNS * CELL_SIZE / 2, 0, GRID_ROWS * CELL_SIZE / 2]}>
        <planeGeometry args={[GRID_COLUMNS * CELL_SIZE, GRID_ROWS * CELL_SIZE]} />
        <meshStandardMaterial color="#4a6938" />
      </mesh>

      {/* Renderiza os elementos do jogo */}
      {renderBlocks()}
      {renderBombs()}
      {renderExplosions()}
      {renderPlayers()}

      {/* Iluminação */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />

      {/* Câmera */}
      <PerspectiveCamera
        makeDefault
        position={[GRID_COLUMNS * CELL_SIZE / 2, CAMERA_ALTITUDE, GRID_ROWS * CELL_SIZE + 5]}
        rotation={[-Math.PI / 4, 0, 0]}
      />

      {/* Controle da câmera (opcional) */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={30}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
      />

      {/* UI em elemento HTML sobreposto ao canvas */}
      {renderGameUI()}
    </>
  );
};

export default MultiplayerGame;
