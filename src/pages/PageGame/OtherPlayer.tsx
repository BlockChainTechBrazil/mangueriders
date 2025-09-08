// @ts-nocheck
import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { updatePlayerPosition, placeBomb } from '../../services/multiplayerService';

interface OtherPlayerProps {
  position: [number, number, number];
  characterType: string;
  playerId: string;
  isBot?: boolean;
  aiLevel?: 'easy' | 'medium' | 'hard';
  grid?: any;
}

const OtherPlayer: React.FC<OtherPlayerProps> = ({ position, characterType, playerId, isBot, aiLevel = 'medium', grid }) => {
  const group = useRef<THREE.Group>(null);
  const [model, setModel] = useState<any>(null);
  const [botTarget, setBotTarget] = useState<[number, number, number]>(position);
  const [botCooldown, setBotCooldown] = useState(0);

  // Mapeamento de tipos de personagens para modelos 3D
  const characterModels = {
    'Alex': '/models/characters/Alex.glb',
    'Raiado': '/models/characters/Raiado.glb',
    'Weet': '/models/characters/Weet.glb',
    'default': '/models/characters/Alex.glb'
  };

  // Carrega o modelo 3D adequado com base no tipo de personagem
  useEffect(() => {
    const modelPath = characterModels[characterType] || characterModels.default;

    // Usar dynamic import para carregar o modelo
    const loadModel = async () => {
      try {
        const { scene } = await useGLTF(modelPath);
        setModel(scene.clone());
      } catch (error) {
        console.error(`Erro ao carregar modelo para ${characterType}:`, error);
        // Tentar carregar o modelo padrão em caso de falha
        try {
          const { scene } = await useGLTF(characterModels.default);
          setModel(scene.clone());
        } catch (err) {
          console.error('Erro ao carregar modelo padrão:', err);
        }
      }
    };

    loadModel();

    // Limpar o modelo ao desmontar
    return () => {
      setModel(null);
    };
  }, [characterType]);

  // Função auxiliar para encontrar o player real
  const findRealPlayer = () => {
    // Busca o player real no grid (simplificado, pode ser melhorado)
    // Aqui você pode acessar o estado global ou receber via props
    // Exemplo: buscar o player mais próximo
    // Supondo que grid contém todos os jogadores
    if (!grid) return null;
    const players = Object.values(grid.players || {}).filter(p => !p.isBot && p.isAlive);
    if (players.length === 0) return null;
    // Retorna o mais próximo (pode ser melhorado)
    return players[0].position;
  };

  // Função auxiliar para detectar explosões próximas
  const isExplosionNearby = (pos) => {
    if (!grid || !grid.explosions) return false;
    return grid.explosions.some(exp => {
      const dx = Math.abs(exp.position[0] - pos[0]);
      const dz = Math.abs(exp.position[2] - pos[2]);
      return dx <= 1 && dz <= 1;
    });
  };

  // Função auxiliar para detectar inimigos próximos
  const isEnemyNearby = (pos) => {
    if (!grid || !grid.enemies) return false;
    return grid.enemies.some(enemy => {
      const dx = Math.abs(enemy.position[0] - pos[0]);
      const dz = Math.abs(enemy.position[2] - pos[2]);
      return dx <= 1 && dz <= 1;
    });
  };

  // Ajustar decideBotMove para IA difícil priorizar rotas seguras
  const decideBotMove = () => {
    if (!grid) return position;
    // IA fácil: movimento aleatório
    if (aiLevel === 'easy') {
      const moves = [
        [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]
      ];
      const move = moves[Math.floor(Math.random() * moves.length)];
      return [position[0] + move[0], position[1], position[2] + move[2]];
    }
    // IA média: persegue player real
    if (aiLevel === 'medium') {
      const realPlayer = findRealPlayer();
      if (realPlayer) {
        const dx = Math.sign(realPlayer[0] - position[0]);
        const dz = Math.sign(realPlayer[2] - position[2]);
        return [position[0] + dx, position[1], position[2] + dz];
      }
      return position;
    }
    // IA difícil: prioriza rotas seguras
    if (aiLevel === 'hard') {
      const moves = [
        [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]
      ];
      // Avalia cada movimento possível
      let bestMove = position;
      let bestScore = -Infinity;
      moves.forEach(move => {
        const newPos = [position[0] + move[0], position[1], position[2] + move[2]];
        let score = 0;
        if (isExplosionNearby(newPos)) score -= 100;
        if (isEnemyNearby(newPos)) score -= 50;
        // Preferir se aproximar do player real
        const realPlayer = findRealPlayer();
        if (realPlayer) {
          const dist = Math.abs(realPlayer[0] - newPos[0]) + Math.abs(realPlayer[2] - newPos[2]);
          score += 10 - dist;
        }
        if (score > bestScore) {
          bestScore = score;
          bestMove = newPos;
        }
      });
      return bestMove;
    }
    return position;
  };

  // Função auxiliar para decidir se solta bomba
  const shouldDropBomb = () => {
    // IA fácil: aleatório
    if (aiLevel === 'easy') return Math.random() < 0.1;
    // IA média: se próximo do player real
    if (aiLevel === 'medium') {
      const realPlayer = findRealPlayer();
      if (realPlayer) {
        const dist = Math.abs(realPlayer[0] - position[0]) + Math.abs(realPlayer[2] - position[2]);
        return dist <= 1 && Math.random() < 0.5;
      }
      return false;
    }
    // IA difícil: lógica estratégica (placeholder)
    if (aiLevel === 'hard') {
      // Exemplo: solta bomba se pode encurralar o player
      const realPlayer = findRealPlayer();
      if (realPlayer) {
        const dist = Math.abs(realPlayer[0] - position[0]) + Math.abs(realPlayer[2] - position[2]);
        return dist <= 1;
      }
      return false;
    }
    return false;
  };

  // Função auxiliar para atualizar status de vida do bot
  const updateBotLife = (isAlive) => {
    if (!isBot) return;
    // Atualiza status de vida do bot no backend
    // Supondo que multiplayerService tem método para isso
    // Exemplo:
    // updateBotStatus({ isAlive });
  };

  // Função auxiliar para atualizar score do bot
  const updateBotScore = (score) => {
    if (!isBot) return;
    // Atualiza score do bot no backend
    // Exemplo:
    // updateBotStatus({ score });
  };

  // Efeito de IA do bot
  useEffect(() => {
    if (!isBot) return;
    if (botCooldown > 0) {
      setBotCooldown(botCooldown - 1);
      return;
    }
    // Decide próximo movimento
    const nextPos = decideBotMove();
    setBotTarget(nextPos);
    // Atualiza posição do bot no backend
    updatePlayerPosition({ x: nextPos[0], y: nextPos[1], z: nextPos[2] });
    // Decide se solta bomba
    if (shouldDropBomb()) {
      placeBomb({ x: nextPos[0], y: nextPos[1], z: nextPos[2] });
    }
    setBotCooldown(10 + Math.floor(Math.random() * 10)); // Cooldown variável
  }, [isBot, aiLevel, grid, position, botCooldown]);

  // Efeito para detectar derrota/vitória do bot
  useEffect(() => {
    if (!isBot) return;
    // Supondo que grid.players contém todos os jogadores
    if (grid && grid.players) {
      const bot = grid.players[playerId];
      if (bot && !bot.isAlive) {
        // Bot morreu, pode acionar animação ou evento
        // Exemplo: trigger de animação de morte
      }
      // Verifica se só resta o bot vivo
      const alivePlayers = Object.values(grid.players).filter(p => p.isAlive);
      if (alivePlayers.length === 1 && alivePlayers[0].id === playerId) {
        // Bot venceu
        // Exemplo: trigger de animação de vitória
      }
    }
  }, [grid, isBot, playerId]);

  // Renderiza o jogador com o modelo carregado
  return (
    <group
      ref={group}
      position={position}
      scale={[0.4, 0.4, 0.4]}
      userData={{ playerId }}
    >
      {model && <primitive object={model} />}

      {/* Nome do jogador flutuando sobre o personagem */}
      <Html position={[0, 3, 0]}>
        <div style={{
          background: 'rgba(0,0,0,0.6)',
          color: 'white',
          padding: '2px 5px',
          borderRadius: '3px',
          fontSize: '10px',
          whiteSpace: 'nowrap',
          transform: 'translateX(-50%)'
        }}>
          {characterType}
        </div>
      </Html>
    </group>
  );
};

// Importa o componente HTML para texto flutuante
interface HtmlProps {
  position: [number, number, number];
  children: React.ReactNode;
}

const Html: React.FC<HtmlProps> = ({ position, children }) => {
  const domRef = useRef<HTMLDivElement>(null);
  const ref = useRef<THREE.Group>(null);

  useFrame(({ camera }) => {
    if (ref.current && domRef.current) {
      ref.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <group position={position} ref={ref}>
      <div
        ref={domRef}
        style={{
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
      >
        {children}
      </div>
    </group>
  );
};

export default OtherPlayer;
