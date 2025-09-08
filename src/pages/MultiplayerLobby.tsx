// @ts-nocheck
import { useState, useEffect } from "react";
import useGameStore from "../game/store/gameStore";
import { useNavigate } from "react-router-dom";
import { realtimeDb } from "../services/firebase";
import { ref, onValue, set } from "firebase/database";
import {
  createRoom,
  joinRoom,
  onPlayerListChange,
  onGameStart,
  leaveRoom,
  startGame,
  getAvailableRooms,
  deleteRoom,
  updateCharacter,
  setPlayerReady,
} from "../services/multiplayerService";
import GameSetup from "../components/GameSetup";
import React from "react"; // Added missing import for React

const MultiplayerLobby = () => {
  const { roomId, playersInLobby, setRoomId, setPlayersInLobby, setGameState } =
    useGameStore();
  const playerData = useGameStore((state) => state.player); // CORREÇÃO: Pega os dados do jogador corretamente
  const navigate = useNavigate(); // Hook de navegação

  // LOGS DE DEPURAÇÃO INICIAIS
  React.useEffect(() => {
    console.log('MultiplayerLobby MONTADO:', { roomId, playerData });
  }, [roomId, playerData]);

  const [joinRoomId, setJoinRoomId] = useState("");
  const [error, setError] = useState("");
  const [roomName, setRoomName] = useState(
    `Sala de ${playerData?.name || "Jogador"}`
  );
  const [betValue, setBetValue] = useState(0);
  const [betValueFormatted, setBetValueFormatted] = useState("R$ 0,00");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [showGameSetup, setShowGameSetup] = useState(false);

  // Estado para armazenar o ID do host
  const [hostId, setHostId] = useState(null);

  // Estado para controlar se o jogador atual está pronto
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // Estado para controlar a seleção de personagem
  const [selectedCharacter, setSelectedCharacter] = useState(playerData?.character || "Alex");

  // Lista de personagens disponíveis
  const availableCharacters = ["Alex", "Raiado", "Weet"];
  // Estado para personagem do bot
  const [botCharacter, setBotCharacter] = useState("Weet");

  // Função para formatar valor em centavos para formato de moeda
  const formatCurrencyFromCents = (cents) => {
    const reais = cents / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(reais);
  };

  // Função para converter valor formatado para número
  const parseCurrencyToNumber = (formattedValue) => {
    // Remove tudo que não é dígito
    const numericString = formattedValue.replace(/\D/g, '');
    const cents = parseInt(numericString) || 0;
    return cents / 100;
  };

  // Função para lidar com mudanças no input de aposta
  const handleBetValueChange = (e) => {
    const inputValue = e.target.value;

    // Remove tudo que não é dígito
    const numericValue = inputValue.replace(/\D/g, '');

    // Converte para centavos
    const cents = parseInt(numericValue) || 0;

    // Formata o valor
    const formatted = formatCurrencyFromCents(cents);
    setBetValueFormatted(formatted);

    // Converte para valor decimal
    const numeric = cents / 100;
    setBetValue(numeric);
  };

  // Função para alternar o status de pronto do jogador
  const togglePlayerReady = async () => {
    if (!roomId || !playerData?.id) {
      setError("Não foi possível marcar como pronto: dados do jogador ou sala ausentes.");
      return;
    }

    try {
      const newReadyState = !isPlayerReady;
      setIsPlayerReady(newReadyState);

      await setPlayerReady(newReadyState);

      // Força sincronização com backend após atualização
      const playerReadyRef = ref(realtimeDb, `rooms/${roomId}/players/${playerData.id}/isReady`);
      onValue(playerReadyRef, (snapshot) => {
        const readyStatus = snapshot.val() || false;
        setIsPlayerReady(readyStatus);
      }, { onlyOnce: true });
    } catch (error) {
      setError("Erro ao atualizar status de pronto. Tente novamente.");
      setIsPlayerReady(!isPlayerReady);
    }
  };

  // Função para alterar o personagem do jogador
  const handleCharacterChange = async (newCharacter) => {
    if (!roomId || !playerData?.id) return;

    try {
      setSelectedCharacter(newCharacter);

      // Usar o serviço multiplayer para atualizar o personagem
      await updateCharacter(newCharacter);

      console.log(`Jogador ${playerData.name} selecionou personagem: ${newCharacter}`);
    } catch (error) {
      console.error("Erro ao atualizar personagem:", error);
      // Reverter o estado local em caso de erro
      setSelectedCharacter(selectedCharacter);
    }
  };

  // Função para alterar personagem do bot
  const handleBotCharacterChange = async (newCharacter) => {
    if (!roomId) return;
    try {
      setBotCharacter(newCharacter);
      // Atualiza personagem do bot no backend
      const botRef = ref(realtimeDb, `rooms/${roomId}/players/bot_1/character`);
      await set(botRef, newCharacter);
    } catch (error) {
      setBotCharacter(botCharacter);
    }
  };

  // UseEffect para buscar o hostId da sala
  useEffect(() => {
    if (roomId) {
      const roomRef = ref(realtimeDb, `rooms/${roomId}/host`);
      onValue(roomRef, (snapshot) => {
        const hostIdFromDb = snapshot.val();
        console.log("Host ID da sala (lobby):", hostIdFromDb);
        setHostId(hostIdFromDb);
      });

      // Escutar o status de pronto do jogador atual
      if (playerData?.id) {
        const playerReadyRef = ref(realtimeDb, `rooms/${roomId}/players/${playerData.id}/isReady`);
        onValue(playerReadyRef, (snapshot) => {
          const readyStatus = snapshot.val() || false;
          setIsPlayerReady(readyStatus);
        });

        // Escutar o personagem selecionado do jogador atual
        const playerCharacterRef = ref(realtimeDb, `rooms/${roomId}/players/${playerData.id}/character`);
        onValue(playerCharacterRef, (snapshot) => {
          const character = snapshot.val() || playerData?.character || "Alex";
          setSelectedCharacter(character);
        });
      }
    }
    return () => {
      // Limpar o estado ao desmontar o componente
      setHostId(null);
      setIsPlayerReady(false);
    };
  }, [roomId, playerData?.id]);

  // Efeito para escutar eventos quando entramos em uma sala
  useEffect(() => {
    let unsubscribePlayers;
    let unsubscribeGameStart;

    if (roomId) {
      // Escuta por mudanças na lista de jogadores
      unsubscribePlayers = onPlayerListChange(roomId, (players) => {
        setPlayersInLobby(players);
      });

      // Escuta pelo evento de início de jogo
      unsubscribeGameStart = onGameStart(roomId, () => {
        setGameState("playing");
        // Navegue para a página do jogo multiplayer
        navigate("/multiplayer/game");
      });
    }

    // Função de limpeza para sair da sala e parar de escutar os eventos
    return () => {
      if (unsubscribePlayers) unsubscribePlayers();
      if (unsubscribeGameStart) unsubscribeGameStart();
    };
  }, [roomId, setPlayersInLobby, setGameState, navigate]);

  // Efeito para carregar salas disponíveis
  useEffect(() => {
    const unsubscribeRooms = getAvailableRooms((rooms) => {
      setAvailableRooms(rooms);
    });

    return () => {
      if (unsubscribeRooms) unsubscribeRooms();
    };
  }, []);

  const handleCreateRoom = async () => {
    try {
      setError("");
      // Log detalhado do playerData para depuração
      console.log(
        "Dados do jogador enviados para createRoom:",
        JSON.stringify(playerData, null, 2)
      );

      // Garantir que temos um ID de jogador consistente
      if (playerData && !playerData.id) {
        console.error("playerData.id é undefined ou null, isso não deveria acontecer");
      }

      // Verificar se o nome está presente
      if (!playerData || !playerData.name) {
        setError(
          "Erro: O nome do jogador não foi definido. Por favor, configure seu perfil primeiro."
        );
        console.error(
          "Tentativa de criar sala com nome indefinido:",
          playerData
        );
        return;
      }

      // Opções da sala
      const roomOptions = {
        roomName: roomName,
        bet: betValue,
      };

      // Atualizar os dados do jogador com o personagem selecionado
      const updatedPlayerData = {
        ...playerData,
        character: selectedCharacter
      };

      const result = await createRoom(updatedPlayerData, roomOptions);
      setRoomId(result.roomId); // Extrai o roomId do objeto retornado

      console.log("Sala criada com sucesso:", {
        roomId: result.roomId,
        playerId: result.playerId,
        playerDataId: playerData.id,
        selectedCharacter: selectedCharacter
      });
    } catch (err) {
      setError("Erro ao criar a sala. Tente novamente.");
      console.error(err);
    }
  };

  const handleJoinRoom = async (roomIdToJoin = joinRoomId) => {
    if (!roomIdToJoin) {
      setError("Por favor, insira ou selecione o ID da sala.");
      return;
    }
    try {
      setError("");
      await joinRoom(roomIdToJoin, playerData);
      setRoomId(roomIdToJoin);
    } catch (err) {
      setError(
        "Não foi possível entrar na sala. Verifique se a sala existe e tem espaço disponível."
      );
      console.error(err);
    }
  };

  const handleStartGame = () => {
    // Em vez de iniciar o jogo diretamente, mostrar a tela de configuração do jogo
    // Verificar se há jogadores e se o usuário atual existe
    if (playersInLobby.length > 0 && playerData) {
      // Verificar se o jogador atual é o host baseado no ID salvo na sala
      const isHost = playerData.id && hostId && playerData.id === hostId;

      // Adicionar logs para depuração
      console.log("Verificando host:", {
        "playerData.id": playerData.id,
        "hostId": hostId,
        "isHost": isHost
      });

      if (isHost) {
        // Verificar se o próprio host está pronto
        if (!isPlayerReady) {
          setError("Você precisa estar pronto antes de iniciar o jogo!");
          setTimeout(() => setError(""), 5000);
          return;
        }

        // Verificar se todos os jogadores estão prontos
        const playersNotReady = playersInLobby.filter(player => !player.isReady);

        if (playersNotReady.length > 0) {
          const notReadyNames = playersNotReady.map(p => p.name || 'Jogador').join(', ');
          setError(`Aguardando jogadores ficarem prontos: ${notReadyNames}`);
          setTimeout(() => setError(""), 5000);
          return;
        }

        setShowGameSetup(true);
      } else {
        setError(`Apenas o host pode iniciar o jogo. Seu ID: ${playerData.id}, Host ID: ${hostId}`);
        setTimeout(() => setError(""), 5000); // Remove a mensagem após 5 segundos
      }
    }
  };

  // Função para iniciar o jogo depois da configuração
  const startGameAfterSetup = () => {
    // O serviço vai notificar todos os jogadores para iniciar o jogo
    startGame(roomId);
  };

  const handleLeaveRoom = () => {
    if (playerData) {
      leaveRoom(roomId, playerData.id);
    }
    setRoomId(null);
    setPlayersInLobby([]);
    setIsPlayerReady(false); // Resetar o status de pronto
    setSelectedCharacter(playerData?.character || "Alex"); // Resetar personagem
  };

  // Função para lidar com a exclusão de salas
  const handleDeleteRoom = async (roomIdToDelete) => {
    try {
      setError("");
      await deleteRoom(roomIdToDelete);
      // A lista de salas será atualizada automaticamente via listener
    } catch (err) {
      setError("Não foi possível excluir a sala. Verifique suas permissões.");
      console.error(err);
    }
  };

  // Tela de Lobby (quando já está em uma sala)
  if (roomId) {
    // Qualquer jogador pode iniciar o jogo, não apenas o host

    // Obter detalhes da sala atual (usaremos para mostrar o nome e valor da aposta)
    const currentRoom = availableRooms.find((room) => room.id === roomId) || {
      name: `Sala ${roomId.substring(0, 6)}`,
      bet: 0,
    };

    // Mostrar a tela de configuração do jogo se showGameSetup for true
    if (showGameSetup) {
      return (
        <GameSetup
          roomId={roomId}
          players={playersInLobby}
          onStartGame={startGameAfterSetup}
          onCancel={() => setShowGameSetup(false)}
        />
      );
    }

    return (
      <div style={styles.lobbyContainer}>
        <h2>{currentRoom.name}</h2>
        <p style={styles.roomIdText}>
          ID da Sala: <strong>{roomId}</strong>
        </p>
        <p>Compartilhe este ID com seus amigos!</p>
        {currentRoom.bet > 0 && (
          <p>
            Valor da aposta: <strong>{currentRoom.bet.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
          </p>
        )}

        {playerData?.id && hostId === playerData.id ? (
          <div>
            <button
              onClick={togglePlayerReady}
              style={{
                ...styles.button,
                backgroundColor: isPlayerReady ? "#d9534f" : "#5cb85c",
                fontSize: "1.1rem",
                marginTop: "10px",
                padding: "12px 20px",
                marginRight: "10px",
              }}
            >
              {isPlayerReady ? "Cancelar Pronto" : "Estou Pronto!"}
            </button>
            <button
              onClick={handleStartGame}
              style={{
                ...styles.button,
                backgroundColor: "#4CAF50",
                fontSize: "1.1rem",
                marginTop: "10px",
                padding: "12px 20px",
              }}
              disabled={playersInLobby.length < 1}
            >
              Iniciar Jogo{" "}
              {playersInLobby.length > 0 &&
                `(${playersInLobby.length} ${playersInLobby.length === 1 ? "jogador" : "jogadores"
                })`}
            </button>
            <p style={styles.hostInfo}>
              Como host, você também precisa estar pronto para iniciar o jogo
            </p>
          </div>
        ) : (
          <div>
            <button
              onClick={togglePlayerReady}
              style={{
                ...styles.button,
                backgroundColor: isPlayerReady ? "#d9534f" : "#5cb85c",
                fontSize: "1.1rem",
                marginTop: "10px",
                padding: "12px 20px",
              }}
            >
              {isPlayerReady ? "Cancelar Pronto" : "Estou Pronto!"}
            </button>
            <p style={styles.waitingText}>
              Aguardando o host iniciar o jogo ({playersInLobby.length}/5 jogadores)
            </p>
          </div>
        )}

        {/* Seletor de Personagem */}
        <div style={styles.characterSelection}>
          <h4>Selecionar Personagem:</h4>
          <div style={styles.characterGrid}>
            {availableCharacters.map((character) => (
              <div
                key={character}
                onClick={() => handleCharacterChange(character)}
                style={{
                  ...styles.characterOption,
                  backgroundColor: selectedCharacter === character ? "#4CAF50" : "#444",
                  border: selectedCharacter === character ? "3px solid #2ecc71" : "2px solid #666",
                }}
              >
                <div
                  style={{
                    ...styles.characterAvatar,
                    backgroundColor:
                      character === "Alex"
                        ? "#3498db"
                        : character === "Raiado"
                          ? "#e74c3c"
                          : character === "Weet"
                            ? "#2ecc71"
                            : "#333",
                  }}
                >
                  {character}
                </div>
                <span style={styles.characterName}>{character}</span>
                {selectedCharacter === character && (
                  <span style={styles.selectedBadge}>✓ Selecionado</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Seletor de Personagem do Bot */}
        <h4>Selecionar Personagem do Bot:</h4>
        <div style={styles.characterGrid}>
          {availableCharacters.map((character) => (
            <div
              key={character}
              onClick={() => handleBotCharacterChange(character)}
              style={{
                ...styles.characterOption,
                backgroundColor: botCharacter === character ? "#4CAF50" : "#444",
                border: botCharacter === character ? "3px solid #2ecc71" : "2px solid #666",
              }}
            >
              <div
                style={{
                  ...styles.characterAvatar,
                  backgroundColor:
                    character === "Alex"
                      ? "#3498db"
                      : character === "Raiado"
                        ? "#e74c3c"
                        : character === "Weet"
                          ? "#2ecc71"
                          : "#333",
                }}
              >
                {character}
              </div>
              <span style={styles.characterName}>{character}</span>
              {botCharacter === character && (
                <span style={styles.selectedBadge}>✓ Selecionado</span>
              )}
            </div>
          ))}
        </div>

        <hr style={styles.hr} />

        <h3>Jogadores na Sala ({playersInLobby.length}/5)</h3>
        <div style={styles.playerGrid}>
          {playersInLobby.map((player, index) => (
            <div key={player.id || index} style={styles.playerCard}>
              <div
                style={{
                  ...styles.playerCharacter,
                  backgroundColor:
                    player.character === "Alex"
                      ? "#3498db"
                      : player.character === "Raiado"
                        ? "#e74c3c"
                        : player.character === "Weet"
                          ? "#2ecc71"
                          : "#333",
                }}
              >
                {player.character}
              </div>
              <div style={styles.playerInfo}>
                <strong>{player.name || `Jogador ${index + 1}`}</strong>
                {hostId && player.id === hostId && <span style={styles.hostBadge}>Host</span>}
                {player.id === playerData?.id && (
                  <span
                    style={{ ...styles.hostBadge, backgroundColor: "#5cb85c" }}
                  >
                    Você
                  </span>
                )}
                {player.isReady && (
                  <span
                    style={{ ...styles.hostBadge, backgroundColor: "#4CAF50", color: "white" }}
                  >
                    ✓ Pronto
                  </span>
                )}
                {!player.isReady && (
                  <span
                    style={{ ...styles.hostBadge, backgroundColor: "#f39c12", color: "white" }}
                  >
                    ⏳ Aguardando
                  </span>
                )}
              </div>
              <div style={styles.playerPosition}>Posição {index + 1}</div>
            </div>
          ))}
        </div>

        {error && <p style={styles.errorMessage}>{error}</p>}

        <button
          onClick={handleLeaveRoom}
          style={{ ...styles.button, ...styles.leaveButton }}
        >
          Sair da Sala
        </button>
      </div>
    );
  }

  // Tela para criar ou entrar em uma sala
  return (
    <div style={styles.container}>
      <h2>Multiplayer</h2>
      <div style={styles.card}>
        <h3>Criar uma Sala</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nome da Sala:</label>
          <input
            type="text"
            placeholder="Digite o nome da sala"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Valor da Aposta:</label>
          <input
            type="text"
            placeholder="R$ 0,00"
            value={betValueFormatted}
            onChange={handleBetValueChange}
            style={styles.input}
          />
        </div>
        <button onClick={handleCreateRoom} style={styles.button}>
          Criar Sala
        </button>
        <button style={{ ...styles.button, marginTop: 8, background: '#8e44ad' }} onClick={() => alert('Função de criar contrato NFT/personagem em breve!')}>
          Criar Novo Contrato (NFT/Personagem)
        </button>
      </div>

      <div style={styles.card}>
        <h3>Entrar em uma Sala</h3>
        <input
          type="text"
          placeholder="Digite o ID da sala"
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value.trim())}
          style={styles.input}
        />
        <button onClick={handleJoinRoom} style={styles.button}>
          Entrar na Sala
        </button>
      </div>

      {error && <p style={styles.errorMessage}>{error}</p>}

      {/* Lista de salas disponíveis */}
      <div style={styles.card}>
        <h3>Salas Disponíveis</h3>
        {availableRooms.length === 0 ? (
          <p>Nenhuma sala disponível no momento.</p>
        ) : (
          <div style={styles.roomList}>
            {availableRooms.map((room) => (<div key={room.id} style={styles.roomItem}>
              <div style={styles.roomInfo}>
                <h4>{room.name}</h4>
                <span>Host: {room.host}</span>
                <span>
                  Jogadores: {room.currentPlayers}/{room.maxPlayers}
                </span>
                {room.bet > 0 && <span>Aposta: {room.bet.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>}
              </div>
              <div style={styles.roomButtons}>
                <button
                  style={styles.joinButton}
                  onClick={() => handleJoinRoom(room.id)}
                >
                  Entrar
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDeleteRoom(room.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Estilos simples para o componente
const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    color: "white",
    maxWidth: "800px",
    margin: "0 auto",
  },
  card: {
    background: "rgba(0,0,0,0.3)",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    background: "#f0ad4e",
    color: "white",
    border: "none",
    borderRadius: "5px",
    margin: "5px",
  },
  leaveButton: { background: "#d9534f" },
  input: {
    padding: "10px",
    width: "100%",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  lobbyContainer: {
    color: "white",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: "8px",
    boxSizing: "border-box",
  },
  errorMessage: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    textAlign: "center",
  },
  hr: {
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    margin: "20px 0",
  },
  roomIdText: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: "8px",
    borderRadius: "4px",
    margin: "15px 0",
  },
  roomList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  roomItem: {
    backgroundColor: "#1a1a1a",
    borderRadius: "5px",
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    "& h4": {
      margin: "0 0 5px 0",
    },
    "& span": {
      fontSize: "14px",
      marginBottom: "2px",
    },
  },
  joinButton: {
    padding: "8px 15px",
    backgroundColor: "#5cb85c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  playerGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "15px",
    marginTop: "20px",
    marginBottom: "20px",
  },
  playerCard: {
    width: "140px",
    backgroundColor: "#444",
    borderRadius: "8px",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
  },
  playerCharacter: {
    width: "80px",
    height: "80px",
    backgroundColor: "#333",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  playerInfo: {
    textAlign: "center",
    marginBottom: "5px",
    width: "100%",
  },
  hostBadge: {
    backgroundColor: "#f0ad4e",
    color: "#333",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "12px",
    marginLeft: "5px",
  },
  playerPosition: {
    color: "#aaa",
    fontSize: "12px",
  },
  waitingText: {
    backgroundColor: "rgba(52, 152, 219, 0.3)",
    padding: "12px 20px",
    borderRadius: "5px",
    marginTop: "10px",
    fontSize: "1.1rem",
    textAlign: "center",
  },
  hostInfo: {
    backgroundColor: "rgba(241, 196, 15, 0.3)",
    padding: "8px 16px",
    borderRadius: "5px",
    marginTop: "8px",
    fontSize: "0.9rem",
    textAlign: "center",
    color: "#f1c40f",
  },
  roomButtons: {
    display: "flex",
    gap: "8px",
  },
  deleteButton: {
    padding: "8px 15px",
    backgroundColor: "#d9534f",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  characterSelection: {
    margin: "20px 0",
    padding: "15px",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "8px",
  },
  characterGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "10px",
    flexWrap: "wrap",
  },
  characterOption: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    minWidth: "100px",
  },
  characterAvatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "white",
  },
  characterName: {
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  selectedBadge: {
    fontSize: "12px",
    color: "#4CAF50",
    fontWeight: "bold",
  },
};

export default MultiplayerLobby;
