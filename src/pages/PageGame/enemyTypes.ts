// Enemy types and configuration for MangueRiders
import { MapType } from './maps';

// Enum for enemy types
export enum EnemyType {
  NORMAL = 'normal',         // Basic enemy that moves toward the player
  FAST = 'fast',             // Faster enemy
  // CRAB = 'crab'              // Caranguejo do mangue (novo)
}

// Interface for enemy configuration
export interface EnemyConfig {
  type: EnemyType;
  speed: number;       // Movement speed (1 = normal, higher = faster)
  health: number;      // How many bomb hits required (1 = normal)
  model: string;       // Path to 3D model or identifier
  scoreValue: number;  // Points earned when defeating this enemy
  specialAbility?: {   // Optional special abilities
    name: string;
    description: string;
    cooldown: number;  // Cooldown in seconds
  };
}

// Enemy configurations
export const enemyConfigs: Record<EnemyType, EnemyConfig> = {
  [EnemyType.NORMAL]: {
    type: EnemyType.NORMAL,
    speed: 1.0,
    health: 1,
    model: '/models/enemys/Business_Professional.glb',
    scoreValue: 100,
  },
  [EnemyType.FAST]: {
    type: EnemyType.FAST,
    speed: 1.75,
    health: 1,
    model: '/models/enemys/Business_Professional.glb',
    scoreValue: 150,
    specialAbility: {
      name: 'Dash',
      description: 'Can dash to cover more ground quickly',
      cooldown: 5,
    },
  },
  // [EnemyType.CRAB]: {
  //   type: EnemyType.CRAB,
  //   speed: 0.9,
  //   health: 1,
  //   color: '#DAA520', // dourado para contraste
  //   // Se você quiser um modelo de caranguejo real, coloque o arquivo em public/models/enemys/crab.glb
  //   // por ora usamos um modelo de robô existente como fallback para evitar erro de carregamento
  //   model: '/models/enemys/Business_Professional.glb',
  //   scoreValue: 120,
  //   specialAbility: {
  //     name: 'Scuttle',
  //     description: 'Moves along the mangrove paths and can roam near trees.',
  //     cooldown: 0
  //   }
  // },
};

// Map-specific enemy distribution
export interface MapEnemies {
  mapType: MapType;
  mapName: string;
  enemies: {
    type: EnemyType;
    count: number; // How many of this type to spawn on this map
    // difficulty: number; // 1-5, affects enemy behavior
  }[];
  boss?: {
    name: string;
    description: string;
    type: EnemyType;
    health: number;
    specialAbilities: string[];
  };
}

// Enemy distribution for each map
export const mapEnemyDistribution: MapEnemies[] = [
  {
    mapType: MapType.FOREST,
    mapName: 'Floresta Encantada',
    enemies: [
      { type: EnemyType.NORMAL, count: 4 }, // Removed difficulty
      { type: EnemyType.FAST, count: 2 }, // Removed difficulty
    ]
  },
  {
    mapType: MapType.DESERT,
    mapName: 'Deserto Ardente',
    enemies: [
      { type: EnemyType.NORMAL, count: 4 }, // Removed difficulty
      { type: EnemyType.FAST, count: 3 }, // Removed difficulty
    ]
  },
  {
    mapType: MapType.VOLCANO,
    mapName: 'Vulcão Explosivo',
    enemies: [
      { type: EnemyType.NORMAL, count: 3 }, // Removed difficulty
    ]
  },
  {
    mapType: MapType.WINTER,
    mapName: 'Caverna de Gelo',
    enemies: [
      { type: EnemyType.NORMAL, count: 3 }, // Removed difficulty
      { type: EnemyType.FAST, count: 4 }, // Removed difficulty
    ]
  },
  {
    mapType: MapType.CAVE,
    mapName: 'Laboratório Secreto',
    enemies: [
      { type: EnemyType.NORMAL, count: 4 },
    ]
  }
];

// Helper function to get enemies for a specific map
export function getEnemiesForMap(mapType: MapType): MapEnemies | undefined {
  return mapEnemyDistribution.find(map => map.mapType === mapType);
}
