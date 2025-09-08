import { create } from 'zustand';
import { CHARACTERS, MAPS } from '../utils/constants';

// Store para gerenciar o estado do jogo
const useGameStore = create((set) => ({
  // Estado do jogo
  gameState: 'menu', // menu, playing, paused, gameOver
  currentMap: null,
  mapData: null,

  // Estados do multiplayer
  roomId: null,
  playersInLobby: [],

  // Jogador
  player: {
    id: `player_${Math.random().toString(36).substr(2, 9)}`, // ID único para o jogador
    name: '', // Nome do jogador - adicionado para evitar undefined
    character: 'ALEX', // Personagem padrão (chave do objeto CHARACTERS)
    characterData: null, // Dados completos do personagem
    position: { x: 0, y: 0 },
    lives: 3,
    bombs: 1,
    bombRange: 2,
    speed: 1,
    powerUps: [],
    currentDino: null,
    score: 0,
    modelPath: '/models/characters/Alex.glb', // Caminho do modelo 3D
  },

  // Inimigos
  enemies: [],

  // Bombas ativas
  activeBombs: [],

  // Dinossauros coletados
  collectedDinos: [],

  // Ações
  setPlayer: (playerData) => set((state) => ({
    player: { ...state.player, ...playerData }
  })),
  setGameState: (state) => set({ gameState: state }),

  // Ações do multiplayer
  setRoomId: (roomId) => set({ roomId }),
  setPlayersInLobby: (players) => set({ playersInLobby: players }),

  setCurrentMap: (mapKey) => set(() => {
    // Carregar dados do mapa a partir do mapKey
    const mapData = MAPS[mapKey] || MAPS.FOREST;

    return {
      currentMap: mapKey,
      mapData: mapData,
    };
  }),
  setMapData: (mapData) => set({ mapData }),

  // Ações do jogador
  // Score movido para dentro do player
  setScore: (score) => set((state) => ({
    player: { ...state.player, score }
  })),
  setPlayerCharacter: (characterKey) => set((state) => {
    // Log para debug
    console.log("Configurando personagem no store:", characterKey);

    // Verificar se a chave existe em CHARACTERS
    if (!CHARACTERS[characterKey]) {
      console.warn(`Personagem ${characterKey} não encontrado. Usando personagem padrão.`);
      // Obtém a primeira chave disponível como padrão
      characterKey = Object.keys(CHARACTERS)[0];
    }

    // Garantir que temos dados válidos
    const characterData = CHARACTERS[characterKey];

    // Garante que o modelPath seja definido corretamente
    let modelPath = characterData?.modelPath || '/models/characters/Alex.glb';

    return {
      player: {
        ...state.player,
        character: characterKey,
        characterData,
        // Inicializar propriedades com base nos dados do personagem
        bombs: characterData?.initialBombs || 1,
        bombRange: characterData?.initialBombRange || 2,
        speed: characterData?.initialSpeed || 1,
        modelPath: modelPath || '/models/characters/Alex.glb',
      }
    };
  }),

  setPlayerPosition: (position) => set((state) => ({
    player: { ...state.player, position }
  })),

  addPlayerBomb: () => set((state) => ({
    player: { ...state.player, bombs: state.player.bombs + 1 }
  })),

  increaseBombRange: () => set((state) => ({
    player: { ...state.player, bombRange: state.player.bombRange + 1 }
  })),

  increasePlayerSpeed: () => set((state) => ({
    player: { ...state.player, speed: state.player.speed + 0.2 }
  })),

  addPowerUp: (powerUp) => set((state) => ({
    player: {
      ...state.player,
      powerUps: [...state.player.powerUps, powerUp]
    }
  })),

  setCurrentDino: (dino) => set((state) => ({
    player: { ...state.player, currentDino: dino }
  })),

  addCollectedDino: (dino) => set((state) => ({
    collectedDinos: [...state.collectedDinos, dino]
  })),

  // Ações de bombas
  placeBomb: (position) => set((state) => {
    // Verifica se o jogador ainda tem bombas disponíveis
    if (state.activeBombs.length >= state.player.bombs) {
      return state;
    }

    // Cria uma nova bomba
    const newBomb = {
      id: `bomb-${Date.now()}`,
      position,
      range: state.player.bombRange,
      timer: 3, // 3 segundos até explodir
      placedAt: Date.now(),
    };

    return {
      activeBombs: [...state.activeBombs, newBomb]
    };
  }),

  removeBomb: (bombId) => set((state) => ({
    activeBombs: state.activeBombs.filter(bomb => bomb.id !== bombId)
  })),

  // Ações de inimigos
  setEnemies: (enemies) => set({ enemies }),

  updateEnemyPosition: (enemyId, position) => set((state) => ({
    enemies: state.enemies.map(enemy =>
      enemy.id === enemyId ? { ...enemy, position } : enemy
    )
  })),

  removeEnemy: (enemyId) => set((state) => ({
    enemies: state.enemies.filter(enemy => enemy.id !== enemyId),
    player: {
      ...state.player,
      score: state.player.score + 100 // Adiciona pontos ao player ao eliminar um inimigo
    }
  })),

  // Reset do jogo
  resetGame: () => {
    console.log("resetGame chamado no gameStore");

    // Obtém o estado atual para preservar o personagem selecionado
    const currentState = useGameStore.getState();
    const currentCharacterKey = currentState.player.character || 'ALEX';
    const playerName = currentState.player.name || '';

    // Usa o personagem anteriormente selecionado pelo jogador ou o padrão
    const characterData = CHARACTERS[currentCharacterKey] || CHARACTERS.ALEX;
    console.log("Usando personagem para resetGame:", currentCharacterKey);

    set({
      gameState: 'menu',
      currentMap: null,
      mapData: null,
      roomId: null,
      playersInLobby: [],
      player: {
        name: playerName, // Preserva o nome do jogador
        character: currentCharacterKey,
        characterData: characterData,
        position: { x: 0, y: 0 },
        lives: 3,
        bombs: characterData.initialBombs || 1,
        bombRange: characterData.initialBombRange || 2,
        speed: characterData.initialSpeed || 1,
        powerUps: [],
        currentDino: null,
        score: 0,
        modelPath: characterData.modelPath || '/models/characters/Alex.glb',
      },
      enemies: [],
      activeBombs: [],
      collectedDinos: [],
    });
    console.log("Estado do jogo resetado com sucesso");
  },
}));

export default useGameStore;

