import { realtimeDb } from './firebase.js';
import { ref, push, set, onValue, off, remove, update } from 'firebase/database';

class MultiplayerService {
  constructor() {
    this.currentRoom = null;
    this.playerId = null;
    this.listeners = new Map();
  }

  // Gerar ID único para o jogador
  generatePlayerId() {
    return 'player_' + Math.random().toString(36).substr(2, 9);
  }

  // Criar uma nova sala de jogo
  async createRoom(playerData, roomOptions = {}) {
    console.log("createRoom chamado com:", JSON.stringify(playerData, null, 2));
    console.log("Opções da sala:", JSON.stringify(roomOptions, null, 2));

    // Validação completa dos dados do jogador
    if (!playerData) {
      const errorMsg = 'Dados do jogador (playerData) não foram fornecidos ao criar a sala.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    // Verificar campos obrigatórios
    if (!playerData.name) {
      const errorMsg = 'O nome do jogador é obrigatório para criar uma sala.';
      console.error(errorMsg, { playerData });
      throw new Error(errorMsg);
    }

    if (!playerData.character) {
      const errorMsg = 'O personagem do jogador é obrigatório para criar uma sala.';
      console.error(errorMsg, { playerData });
      throw new Error(errorMsg);
    }

    const { name: playerName, character: selectedCharacter } = playerData;
    const { roomName = `Sala de ${playerName}`, bet = 0 } = roomOptions;

    try {
      const roomsRef = ref(realtimeDb, 'rooms');
      const newRoomRef = push(roomsRef);
      const roomId = newRoomRef.key;

      // IMPORTANTE: Garantir a consistência do ID do jogador
      // Se o jogador já tem um ID, usamos ele, caso contrário geramos um novo
      // E certifique-se de que o mesmo ID seja usado em toda a aplicação
      this.playerId = playerData.id || this.generatePlayerId();

      // Se o jogador não tinha ID, atualizamos o objeto playerData para garantir consistência
      if (!playerData.id) {
        playerData.id = this.playerId;
        console.log("ID do jogador gerado e sincronizado:", this.playerId);
      }

      this.currentRoom = roomId;

      const roomData = {
        id: roomId,
        name: roomName,
        host: this.playerId,
        status: 'waiting', // waiting, playing, finished
        maxPlayers: 5,
        currentPlayers: 2, // Já conta o bot
        createdAt: Date.now(),
        bet: bet,
        gameState: {
          map: 'forest', // default map
          round: 1,
          timeLeft: 180, // 3 minutes
          powerUps: {},
          bombs: {},
          explosions: {}
        },
        players: {
          [this.playerId]: {
            id: this.playerId,
            name: playerName,
            character: selectedCharacter,
            position: { x: 1, y: 1 },
            health: 3,
            bombCount: 1,
            bombRange: 1,
            speed: 1,
            score: 0,
            isAlive: true,
            isReady: false,
            joinedAt: Date.now()
          },
          bot_1: {
            id: 'bot_1',
            name: 'Bot',
            character: 'Weet',
            position: { x: 17, y: 1 },
            health: 3,
            bombCount: 1,
            bombRange: 1,
            speed: 1,
            score: 0,
            isAlive: true,
            isReady: true,
            isBot: true,
            joinedAt: Date.now()
          }
        }
      };

      await set(newRoomRef, roomData);

      console.log(`Sala criada: ${roomId}`);
      return { roomId, playerId: this.playerId };
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      throw error;
    }
  }

  // Entrar em uma sala existente
  async joinRoom(roomId, playerData) {
    if (!playerData || !playerData.character) {
      const errorMsg = 'Dados do jogador (playerData) são inválidos ou não foram fornecidos ao entrar na sala.';
      console.error(errorMsg, { playerData });
      throw new Error(errorMsg);
    }
    const { name: playerName, character: selectedCharacter } = playerData;
    try {
      const roomRef = ref(realtimeDb, `rooms/${roomId}`);

      // Verificar se a sala existe e tem espaço
      return new Promise((resolve, reject) => {
        onValue(roomRef, (snapshot) => {
          const roomData = snapshot.val();

          if (!roomData) {
            reject(new Error('Sala não encontrada'));
            return;
          }

          if (roomData.currentPlayers >= roomData.maxPlayers) {
            reject(new Error('Sala lotada'));
            return;
          }

          if (roomData.status !== 'waiting') {
            reject(new Error('Jogo já iniciado'));
            return;
          }

          // Não verificamos mais se o personagem já foi escolhido
          // Permitimos personagens repetidos entre os jogadores

          this.playerId = this.generatePlayerId();
          this.currentRoom = roomId;

          // Adicionar jogador à sala
          const playerData = {
            id: this.playerId,
            name: playerName,
            character: selectedCharacter,
            position: this.getSpawnPosition(roomData.currentPlayers),
            health: 3,
            bombCount: 1,
            bombRange: 1,
            speed: 1,
            score: 0,
            isAlive: true,
            isReady: false,
            joinedAt: Date.now()
          };

          const updates = {};
          updates[`rooms/${roomId}/players/${this.playerId}`] = playerData;
          updates[`rooms/${roomId}/currentPlayers`] = roomData.currentPlayers + 1;

          update(ref(realtimeDb), updates).then(() => {
            console.log(`Entrou na sala: ${roomId}`);
            resolve({ roomId, playerId: this.playerId });
          }).catch(reject);

          // Remove o listener após a primeira verificação
          off(roomRef);
        }, { onlyOnce: true });
      });
    } catch (error) {
      console.error('Erro ao entrar na sala:', error);
      throw error;
    }
  }

  // Obter posição de spawn baseada no número de jogadores
  getSpawnPosition(playerCount) {
    const spawnPositions = [
      { x: 1, y: 1 },
      { x: 13, y: 1 },
      { x: 1, y: 11 },
      { x: 13, y: 11 },
      { x: 7, y: 6 }
    ];
    return spawnPositions[playerCount] || { x: 1, y: 1 };
  }

  // Listar salas disponíveis
  async listAvailableRooms() {
    try {
      const roomsRef = ref(realtimeDb, 'rooms');

      return new Promise((resolve) => {
        onValue(roomsRef, (snapshot) => {
          const rooms = snapshot.val() || {};
          const availableRooms = Object.values(rooms)
            .filter(room =>
              room.status === 'waiting' &&
              room.currentPlayers < room.maxPlayers &&
              (Date.now() - room.createdAt) < 300000 // Salas criadas há menos de 5 minutos
            )
            .map(room => ({
              id: room.id,
              currentPlayers: room.currentPlayers,
              maxPlayers: room.maxPlayers,
              host: Object.values(room.players)[0]?.name || 'Desconhecido',
              map: room.gameState.map
            }));

          resolve(availableRooms);
        }, { onlyOnce: true });
      });
    } catch (error) {
      console.error('Erro ao listar salas:', error);
      return [];
    }
  }

  // Marcar jogador como pronto
  async setPlayerReady(isReady = true) {
    if (!this.currentRoom || !this.playerId) return;

    try {
      const playerRef = ref(realtimeDb, `rooms/${this.currentRoom}/players/${this.playerId}/isReady`);
      await set(playerRef, isReady);
    } catch (error) {
      console.error('Erro ao definir status de pronto:', error);
    }
  }

  // Atualizar posição do jogador
  async updatePlayerPosition(position) {
    if (!this.currentRoom || !this.playerId) return;

    try {
      const positionRef = ref(realtimeDb, `rooms/${this.currentRoom}/players/${this.playerId}/position`);
      await set(positionRef, position);
    } catch (error) {
      console.error('Erro ao atualizar posição:', error);
    }
  }

  // Colocar bomba
  async placeBomb(position) {
    if (!this.currentRoom || !this.playerId) return;

    try {
      const bombId = `bomb_${Date.now()}_${this.playerId}`;
      const bombRef = ref(realtimeDb, `rooms/${this.currentRoom}/gameState/bombs/${bombId}`);

      const bombData = {
        id: bombId,
        playerId: this.playerId,
        position: position,
        range: 1, // Será obtido do jogador
        timer: 3000, // 3 segundos
        placedAt: Date.now()
      };

      await set(bombRef, bombData);
      return bombId;
    } catch (error) {
      console.error('Erro ao colocar bomba:', error);
    }
  }

  // Atualizar personagem do jogador
  async updateCharacter(character) {
    if (!this.currentRoom || !this.playerId) return;

    try {
      const characterRef = ref(realtimeDb, `rooms/${this.currentRoom}/players/${this.playerId}/character`);
      await set(characterRef, character);
    } catch (error) {
      console.error('Erro ao atualizar personagem:', error);
      throw error;
    }
  }

  // Escutar mudanças na sala
  onRoomUpdate(callback) {
    if (!this.currentRoom) return;

    const roomRef = ref(realtimeDb, `rooms/${this.currentRoom}`);
    const listenerId = 'room_' + Date.now();

    onValue(roomRef, callback);
    this.listeners.set(listenerId, { ref: roomRef, callback });

    return listenerId;
  }

  // Escutar mudanças nos jogadores
  onPlayersUpdate(callback) {
    if (!this.currentRoom) return;

    const playersRef = ref(realtimeDb, `rooms/${this.currentRoom}/players`);
    const listenerId = 'players_' + Date.now();

    onValue(playersRef, callback);
    this.listeners.set(listenerId, { ref: playersRef, callback });

    return listenerId;
  }

  // Escutar mudanças no estado do jogo
  onGameStateUpdate(callback) {
    if (!this.currentRoom) return;

    const gameStateRef = ref(realtimeDb, `rooms/${this.currentRoom}/gameState`);
    const listenerId = 'gameState_' + Date.now();

    onValue(gameStateRef, callback);
    this.listeners.set(listenerId, { ref: gameStateRef, callback });

    return listenerId;
  }

  // Remover listener
  removeListener(listenerId) {
    const listener = this.listeners.get(listenerId);
    if (listener) {
      off(listener.ref, listener.callback);
      this.listeners.delete(listenerId);
    }
  }

  // Sair da sala
  async leaveRoom() {
    if (!this.currentRoom || !this.playerId) return;

    try {
      // Remover jogador da sala
      const playerRef = ref(realtimeDb, `rooms/${this.currentRoom}/players/${this.playerId}`);
      await remove(playerRef);

      // Atualizar contador de jogadores
      const roomRef = ref(realtimeDb, `rooms/${this.currentRoom}`);
      onValue(roomRef, async (snapshot) => {
        const roomData = snapshot.val();
        if (roomData) {
          const currentPlayers = Object.keys(roomData.players || {}).length;
          await update(ref(realtimeDb), {
            [`rooms/${this.currentRoom}/currentPlayers`]: currentPlayers
          });

          // Se não há mais jogadores, remover a sala
          if (currentPlayers === 0) {
            await remove(roomRef);
          }
        }
      }, { onlyOnce: true });

      // Remover todos os listeners
      this.listeners.forEach((listener, id) => {
        this.removeListener(id);
      });

      this.currentRoom = null;
      this.playerId = null;
    } catch (error) {
      console.error('Erro ao sair da sala:', error);
    }
  }

  // Excluir uma sala (apenas para administradores ou o host)
  async deleteRoom(roomId) {
    try {
      // Primeiro, verifique se o usuário é o host ou tem permissões para excluir
      const roomRef = ref(realtimeDb, `rooms/${roomId}`);

      // Remover a sala completamente
      await remove(roomRef);
      console.log(`Sala ${roomId} excluída com sucesso`);
      return true;
    } catch (error) {
      console.error('Erro ao excluir sala:', error);
      throw error;
    }
  }

  // Iniciar jogo (qualquer jogador pode fazer isso)
  async startGame() {
    if (!this.currentRoom) return;

    try {
      console.log("Iniciando jogo. ID do jogador atual:", this.playerId);

      // Verificar se sou o host antes de iniciar (para logs de depuração)
      const hostRef = ref(realtimeDb, `rooms/${this.currentRoom}/host`);
      onValue(hostRef, async (snapshot) => {
        const hostId = snapshot.val();
        console.log("Host ID da sala:", hostId);
        console.log("Sou o host?", hostId === this.playerId);

        const updates = {};
        updates[`rooms/${this.currentRoom}/status`] = 'playing';
        updates[`rooms/${this.currentRoom}/gameState/startedAt`] = Date.now();

        await update(ref(realtimeDb), updates);
      }, { onlyOnce: true });

    } catch (error) {
      console.error('Erro ao iniciar jogo:', error);
    }
  }

  // Obter informações da sala atual
  getCurrentRoom() {
    return this.currentRoom;
  }

  // Obter ID do jogador atual
  getCurrentPlayerId() {
    return this.playerId;
  }
}

// Exportar instância singleton
const multiplayerService = new MultiplayerService();
export default multiplayerService;

// --- EXPORTAÇÕES NOMEADAS PARA CORRIGIR O ERRO ---

// Exporta os métodos da instância para que a importação nomeada funcione.
// Isso resolve o erro "does not provide an export named 'createRoom'".
export const createRoom = (playerData, roomOptions = {}) => {
  // Garantir que multiplayerService.playerId e playerData.id estejam sincronizados
  if (playerData.id) {
    multiplayerService.playerId = playerData.id;
  } else if (multiplayerService.playerId) {
    playerData.id = multiplayerService.playerId;
  }
  return multiplayerService.createRoom(playerData, roomOptions);
};

export const joinRoom = (roomId, playerData) => {
  return multiplayerService.joinRoom(roomId, playerData);
};

export const leaveRoom = () => {
  return multiplayerService.leaveRoom();
};

export const startGame = () => {
  console.log("startGame chamado, player ID atual:", multiplayerService.playerId);

  // Verificar se o serviço tem um ID atual
  if (!multiplayerService.playerId) {
    console.error("ERRO: Tentando iniciar jogo sem um ID de jogador!");
  }

  // O método do serviço não precisa do ID da sala, pois já o conhece.
  return multiplayerService.startGame();
};

// Funções de listener que o Lobby espera.
export const onPlayerListChange = (roomId, callback) => {
  const playersRef = ref(realtimeDb, `rooms/${roomId}/players`);
  const listener = onValue(playersRef, (snapshot) => {
    const playersData = snapshot.val() || {};
    callback(Object.values(playersData));
  });
  // Retorna a função para remover o listener (unsubscribe)
  return () => off(playersRef, listener);
};

export const onGameStart = (roomId, callback) => {
  const statusRef = ref(realtimeDb, `rooms/${roomId}/status`);
  const listener = onValue(statusRef, (snapshot) => {
    if (snapshot.val() === 'playing') {
      callback();
    }
  });
  // Retorna a função para remover o listener (unsubscribe)
  return () => off(statusRef, listener);
};

// Função para listar salas disponíveis
export const getAvailableRooms = (callback) => {
  const roomsRef = ref(realtimeDb, 'rooms');
  const listener = onValue(roomsRef, (snapshot) => {
    const rooms = snapshot.val();
    if (!rooms) {
      callback([]);
      return;
    }

    // Converter para array e filtrar apenas salas no status 'waiting'
    const availableRooms = Object.entries(rooms)
      .map(([id, room]) => ({
        id,
        name: room.name || `Sala ${id.substring(0, 6)}`,
        host: room.players ? Object.values(room.players)[0]?.name : 'Desconhecido',
        currentPlayers: room.currentPlayers || 0,
        maxPlayers: room.maxPlayers || 5,
        bet: room.bet || 0,
        status: room.status
      }))
      .filter(room => room.status === 'waiting');

    callback(availableRooms);
  });

  // Retorna a função para remover o listener (unsubscribe)
  return () => off(roomsRef, listener);
};

// Atualizar personagem
export const updateCharacter = (character) => {
  return multiplayerService.updateCharacter(character);
};

// Marcar jogador como pronto
export const setPlayerReady = (isReady) => {
  return multiplayerService.setPlayerReady(isReady);
};

// Excluir uma sala
export const deleteRoom = (roomId) => {
  return multiplayerService.deleteRoom(roomId);
};

