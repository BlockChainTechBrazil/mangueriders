// Arquivo types.ts - Tipos centrais para o jogo
import { EnemyType } from './enemyTypes';
import type { PlayerData, CharacterType, PlayerControls } from './playerTypes';

// Re-exportamos para facilidade de uso
export type { PlayerData, CharacterType, PlayerControls };

export enum CellType {
  Empty = 0,
  Wall = 1,
  Block = 2,
  Breakable = 3,
  BOMB = 4,
  EXPLOSION = 5,
  ENEMY = 6,
  POWERUP_BOMB_RANGE = 7,    // Power-up para alcance da bomba
  POWERUP_MAX_BOMBS = 8      // Power-up para mais bombas
}

export interface BombData {
  id: string;
  col?: number;
  row?: number;
  position?: {
    x: number;
    y: number;
    z?: number;
  } | [number, number, number]; // Posição da bomba em formato de objeto ou array
  timerId?: number;
  placedAt: number; // Timestamp de quando a bomba foi colocada
  range: number; // Alcance da explosão desta bomba específica
  exploded?: boolean; // Se a bomba já explodiu
}

export interface EnemyData {
  id: string;
  row: number;
  col: number;
  type?: EnemyType;          // Tipo do inimigo (de enum EnemyType)
  direction?: [number, number, number]; // Direção do movimento [x, z, y]
  isMoving?: boolean; // Se o inimigo está se movendo
  lastMoveTime?: number; // Último momento em que o inimigo se moveu
  lastTriedDirection?: number; // Última direção tentada (0-3) para alternar tentativas
}

export interface ExplosionData {
  id: string;
  position: [number, number, number];
  // Poderia adicionar startTime para controlar a duração da animação da explosão
}

// Para o pathfinding
export type Grid = CellType[][];
export interface Node {
  r: number;
  c: number;
  g: number; // Custo do início até este nó
  h: number; // Heurística (custo estimado deste nó até o fim)
  f: number; // Custo total (g + h)
  parent: Node | null;
}
