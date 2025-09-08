// playerTypes.ts
// Define interfaces relacionadas aos jogadores

export interface PlayerData {
  id: string;
  name: string;
  character: string;
  position: {
    x: number;
    y: number;
    z?: number; // Opcional para compatibilidade com versões antigas
  };
  health: number;
  bombCount: number;
  bombRange: number;
  speed: number;
  score: number;
  isAlive: boolean;
  isReady?: boolean; // Usado no lobby
  joinedAt?: number; // Timestamp de quando o jogador entrou na sala
}

export enum CharacterType {
  ALEX = 'Alex',
  RAIADO = 'Raiado',
  WEET = 'Weet'
}

export interface PlayerControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  placeBomb: boolean;
}
