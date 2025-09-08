// @ts-nocheck
import React, { useState, useEffect } from "react";
import { MapType } from "../pages/PageGame/maps";
import { CharacterType } from "../pages/PageGame/playerTypes";
import useGameStore from "../game/store/gameStore";
import { realtimeDb } from "../services/firebase";
import { ref, set, onValue } from "firebase/database";
import {
  updateCharacter as updatePlayerCharacter,
  setPlayerReady,
  onPlayerListChange
} from "../services/multiplayerService";

// Função auxiliar para verificar se um personagem já está selecionado por outro jogador
// Como agora podemos permitir personagens repetidos, essa função sempre retorna false
const isCharacterSelected = () => {
  // Permitir repetição de personagens, sempre retornar false
  return false;
};

interface GameSetupProps {
  roomId: string;
  players: any[]; // Usar o tipo correto quando disponível
  onStartGame: () => void;
  onCancel: () => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ roomId, players, onStartGame, onCancel }) => {
  console.log("GameSetup - props:", { roomId, players });
  const playerData = useGameStore(state => state.player);

  // Lista de personagens disponíveis
  const characters = Object.values(CharacterType);

  const [character, setCharacter] = useState(playerData?.character || CharacterType.ALEX);
  const setPlayerCharacter = useGameStore(state => state.setPlayerCharacter);
  const [selectedMap, setSelectedMap] = useState(MapType.FOREST);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState("");

  // Vamos obter o ID do host da sala em vez de confiar apenas em joinedAt
  const [hostId, setHostId] = useState(null);

  // UseEffect para buscar o hostId da sala no Firebase
  useEffect(() => {
    if (roomId) {
      const roomRef = ref(realtimeDb, `rooms/${roomId}/host`);
      onValue(roomRef, (snapshot) => {
        const hostIdFromDb = snapshot.val();
        console.log("Host ID da sala:", hostIdFromDb);
        setHostId(hostIdFromDb);
      });
    }
  }, [roomId]);

  // Verifica se o jogador atual é o host baseado no ID salvo na sala
  const isHost = playerData?.id && hostId && playerData.id === hostId;

  // Atualiza os dados do jogador no Firebase quando o personagem é alterado
  useEffect(() => {
    if (roomId && playerData?.id) {
      // Usar o método exportado do serviço multiplayer
      updatePlayerCharacter(character).catch(error => {
        console.error("Erro ao atualizar personagem:", error);
        setError("Não foi possível selecionar este personagem. Tente novamente.");
      });
    }
  }, [character, roomId, playerData?.id]);

  // Efeito para escutar mudanças nos jogadores em tempo real (sem bloqueio de personagens)
  useEffect(() => {
    let unsubscribePlayers;

    if (roomId) {
      unsubscribePlayers = onPlayerListChange(roomId, (updatedPlayers) => {
        // Atualiza o estado de "pronto" do jogador atual baseado nos dados do servidor
        const currentPlayer = updatedPlayers.find(p => p.id === playerData?.id);
        if (currentPlayer && currentPlayer.isReady !== isReady) {
          setIsReady(currentPlayer.isReady);
        }
      });
    }

    return () => {
      if (unsubscribePlayers) unsubscribePlayers();
    };
  }, [roomId, playerData?.id, isReady]);

  // Lista de mapas disponíveis
  const maps = [
    { id: MapType.FOREST, name: "Floresta Encantada", description: "Um mapa florestal com grama verde e árvores." },
    { id: MapType.CAVE, name: "Caverna Sombria", description: "Um mapa em uma caverna com pouca iluminação." },
    { id: MapType.DESERT, name: "Deserto Escaldante", description: "Um mapa desértico com muitas dunas de areia." },
    { id: MapType.WINTER, name: "Tundra Congelada", description: "Um mapa gelado com neve e gelo por toda parte." },
    { id: MapType.VOLCANO, name: "Vulcão Ativo", description: "Um mapa perigoso próximo a um vulcão em erupção." },
  ];

  // Função para atualizar o mapa selecionado
  const updateMap = async (mapType) => {
    if (roomId) {
      const mapRef = ref(realtimeDb, `rooms/${roomId}/gameState/map`);
      try {
        await set(mapRef, mapType);
      } catch (error) {
        console.error("Erro ao atualizar mapa:", error);
      }
    }
  };

  // Função para marcar o jogador como pronto
  const toggleReady = async () => {
    if (roomId && playerData?.id) {
      try {
        await setPlayerReady(!isReady);
        setIsReady(!isReady);
      } catch (error) {
        console.error("Erro ao atualizar status de pronto:", error);
      }
    }
  };

  // Verifica se todos os jogadores estão prontos
  const allPlayersReady = Array.isArray(players) && players.length > 0 &&
    players.every(player => player.isReady === true);

  // Handler para iniciar o jogo
  const handleStartGame = () => {
    if (allPlayersReady || isHost) {
      // Atualiza o mapa final selecionado antes de iniciar
      updateMap(selectedMap).then(() => {
        onStartGame();
      });
    } else {
      setError("Nem todos os jogadores estão prontos!");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Configuração da Partida</h2>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.columns}>
        <div style={styles.column}>
          <h3 style={styles.subtitle}>Escolha seu Personagem</h3>
          <div style={styles.characterGrid}>
            {characters.map((char) => {
              const isSelected = character === char;
              const isDisabled = isCharacterSelected(char, players, playerData?.id);

              return (
                <div
                  key={char}
                  style={{
                    ...styles.characterCard,
                    ...(isSelected ? styles.selectedCharacter : {}),
                    ...(isDisabled ? styles.disabledCharacter : {})
                  }}
                  onClick={() => {
                    if (!isDisabled) {
                      setCharacter(char);
                      setPlayerCharacter(char);
                    }
                  }}
                >
                  <div style={{
                    ...styles.characterIcon,
                    backgroundColor:
                      char === CharacterType.ALEX ? '#3498db' :
                        char === CharacterType.RAIADO ? '#e74c3c' :
                          char === CharacterType.WEET ? '#2ecc71' : '#333'
                  }}>
                    {char.charAt(0)}
                  </div>
                  <div style={styles.characterName}>
                    {char}
                  </div>
                </div>
              );
            })}
          </div>

          <h3 style={styles.subtitle}>Jogadores</h3>          <div style={styles.playersList}>
            {Array.isArray(players) && players.map((player, index) => (
              <div key={player.id || index} style={styles.playerItem}>
                <div style={{
                  ...styles.playerStatus,
                  backgroundColor: player.isReady ? '#27ae60' : '#e74c3c'
                }}></div>
                <strong>{player.name || `Jogador ${index + 1}`}</strong> - {player.character || 'Não definido'}
                {hostId && player.id === hostId && <span style={styles.hostBadge}>Host</span>}
                {player.id === playerData?.id && <span style={styles.youBadge}>Você</span>}
              </div>
            ))}
          </div>

          <button
            style={{
              ...styles.button,
              backgroundColor: isReady ? '#27ae60' : '#3498db'
            }}
            onClick={toggleReady}
          >
            {isReady ? 'Pronto ✓' : 'Marcar como Pronto'}
          </button>
        </div>

        <div style={styles.column}>
          <h3 style={styles.subtitle}>Escolha o Mapa</h3>
          {playerData?.id && hostId === playerData.id ? (
            <div style={styles.mapSelection}>
              {maps.map(map => (
                <div
                  key={map.id}
                  style={{
                    ...styles.mapCard,
                    ...(selectedMap === map.id ? styles.selectedMap : {})
                  }}
                  onClick={() => setSelectedMap(map.id)}
                >
                  <h4 style={styles.mapName}>{map.name}</h4>
                  <p style={styles.mapDescription}>{map.description}</p>
                </div>
              ))}
            </div>) : (
            <p style={styles.hostMessage}>Apenas o host pode escolher o mapa.</p>
          )}

          <div style={styles.buttonGroup}>
            <button
              style={styles.cancelButton}
              onClick={onCancel}
            >
              Voltar ao Lobby
            </button>
            {playerData?.id && hostId === playerData.id && (
              <button
                style={{
                  ...styles.startButton,
                  opacity: allPlayersReady ? 1 : 0.5
                }}
                onClick={handleStartGame}
                disabled={!allPlayersReady}
              >
                Iniciar Partida
                {!allPlayersReady && " (Aguardando jogadores)"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: '10px',
    color: 'white',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '15px',
    borderBottom: '1px solid #555',
    paddingBottom: '5px',
  },
  error: {
    backgroundColor: 'rgba(231, 76, 60, 0.3)',
    color: '#fff',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  columns: {
    display: 'flex',
    flexDirection: 'row',
    gap: '20px',
  },
  column: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  characterGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginBottom: '20px',
  },
  characterCard: {
    backgroundColor: '#2c3e50',
    borderRadius: '8px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  selectedCharacter: {
    backgroundColor: '#34495e',
    boxShadow: '0 0 0 2px #3498db',
    transform: 'scale(1.05)',
  },
  disabledCharacter: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  characterIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  characterName: {
    fontSize: '14px',
    textAlign: 'center',
  },
  taken: {
    fontSize: '12px',
    color: '#e74c3c',
  },
  playersList: {
    marginBottom: '20px',
  },
  playerItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    marginBottom: '5px',
    backgroundColor: '#34495e',
    borderRadius: '5px',
  },
  playerStatus: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  hostBadge: {
    backgroundColor: '#f39c12',
    color: '#fff',
    fontSize: '12px',
    padding: '2px 6px',
    borderRadius: '4px',
    marginLeft: '8px',
  },
  youBadge: {
    backgroundColor: '#3498db',
    color: '#fff',
    fontSize: '12px',
    padding: '2px 6px',
    borderRadius: '4px',
    marginLeft: '8px',
  },
  mapSelection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  mapCard: {
    backgroundColor: '#2c3e50',
    borderRadius: '8px',
    padding: '15px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  selectedMap: {
    backgroundColor: '#34495e',
    boxShadow: '0 0 0 2px #3498db',
  },
  mapName: {
    margin: '0 0 5px 0',
    fontSize: '16px',
  },
  mapDescription: {
    margin: '0',
    fontSize: '14px',
    color: '#bbb',
  },
  hostMessage: {
    backgroundColor: 'rgba(52, 152, 219, 0.3)',
    padding: '15px',
    borderRadius: '5px',
    textAlign: 'center',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  button: {
    padding: '12px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: 'white',
    transition: 'all 0.3s ease',
  },
  cancelButton: {
    padding: '12px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    backgroundColor: '#95a5a6',
    color: 'white',
    transition: 'all 0.3s ease',
  },
  startButton: {
    padding: '12px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    backgroundColor: '#27ae60',
    color: 'white',
    transition: 'all 0.3s ease',
  },
} as const;

export default GameSetup;
