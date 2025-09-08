export interface Player {
  id: string;
  name: string;
  character: string;
  characterData: any;
  position: { x: number; y: number };
  lives: number;
  bombs: number;
  bombRange: number;
  speed: number;
  powerUps: any[];
  currentDino: any;
  score: number;
  modelPath: string;
}

export interface GameState {
  gameState: string;
  currentMap: any;
  mapData: any;
  roomId: string | null;
  playersInLobby: any[];
  player: Player;
}

declare const useGameStore: (selector: (state: GameState) => any) => any;
export default useGameStore;
