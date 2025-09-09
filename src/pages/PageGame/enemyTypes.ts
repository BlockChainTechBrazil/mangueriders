// Enemy types and configuration for MangueRiders
import { MapType } from './maps';

// Enum for enemy types
export enum EnemyType {
  NORMAL = 'normal',         // Basic enemy that moves toward the player
  FAST = 'fast',             // Faster enemy
  AGGRESSIVE = 'aggressive', // Enemy that actively targets the player
  TANK = 'tank',             // Slower but requires multiple hits to defeat
  GHOST = 'ghost',           // Can pass through destructible blocks
  BOMBER = 'bomber',         // Places bombs on the map
  CRAB = 'crab'              // Caranguejo do mangue (novo)
}

// Interface for enemy configuration
export interface EnemyConfig {
  type: EnemyType;
  speed: number;       // Movement speed (1 = normal, higher = faster)
  health: number;      // How many bomb hits required (1 = normal)
  color: string;       // Color for rendering
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
    color: '#FFA500', // Orange
    model: '/models/enemys/robotYellow.glb',
    scoreValue: 100,
  },
  [EnemyType.FAST]: {
    type: EnemyType.FAST,
    speed: 1.75,
    health: 1,
    color: '#00BFFF', // Blue
    model: '/models/enemys/robotYellow.glb', // Replace with fast robot model when available
    scoreValue: 150,
    specialAbility: {
      name: 'Dash',
      description: 'Can dash to cover more ground quickly',
      cooldown: 5,
    },
  },
  [EnemyType.AGGRESSIVE]: {
    type: EnemyType.AGGRESSIVE,
    speed: 1.3,
    health: 1,
    color: '#FF4500', // Red Orange
    model: '/models/enemys/robotYellow.glb', // Replace with aggressive robot model
    scoreValue: 200,
    specialAbility: {
      name: 'Hunt',
      description: 'Actively hunts the player with better pathfinding',
      cooldown: 0,
    },
  },
  [EnemyType.TANK]: {
    type: EnemyType.TANK,
    speed: 0.7,
    health: 3,
    color: '#A52A2A', // Brown
    model: '/models/enemys/robotYellow.glb', // Replace with tank robot model
    scoreValue: 300,
  },
  [EnemyType.GHOST]: {
    type: EnemyType.GHOST,
    speed: 1.1,
    health: 1,
    color: '#E6E6FA', // Lavender
    model: '/models/enemys/robotYellow.glb', // Replace with ghost robot model
    scoreValue: 250,
    specialAbility: {
      name: 'Phase',
      description: 'Can phase through destructible blocks',
      cooldown: 3,
    },
  },
  [EnemyType.BOMBER]: {
    type: EnemyType.BOMBER,
    speed: 0.9,
    health: 1,
    color: '#32CD32', // Lime Green
    model: '/models/enemys/robotYellow.glb', // Replace with bomber robot model
    scoreValue: 350,
    specialAbility: {
      name: 'Plant Bomb',
      description: 'Occasionally drops bombs',
      cooldown: 8,
    },
  },
  [EnemyType.CRAB]: {
    type: EnemyType.CRAB,
    speed: 0.9,
    health: 1,
    color: '#DAA520', // dourado para contraste
    // Se você quiser um modelo de caranguejo real, coloque o arquivo em public/models/enemys/crab.glb
    // por ora usamos um modelo de robô existente como fallback para evitar erro de carregamento
    model: '/models/enemys/robotYellow.glb',
    scoreValue: 120,
    specialAbility: {
      name: 'Scuttle',
      description: 'Moves along the mangrove paths and can roam near trees.',
      cooldown: 0
    }
  },
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
      { type: EnemyType.CRAB, count: 3 } // Removed difficulty
    ]
  },
  {
    mapType: MapType.DESERT,
    mapName: 'Deserto Ardente',
    enemies: [
      { type: EnemyType.NORMAL, count: 4 }, // Removed difficulty
      { type: EnemyType.FAST, count: 3 }, // Removed difficulty
      { type: EnemyType.TANK, count: 1 } // Removed difficulty
    ]
  },
  {
    mapType: MapType.VOLCANO,
    mapName: 'Vulcão Explosivo',
    enemies: [
      { type: EnemyType.NORMAL, count: 3 }, // Removed difficulty
      { type: EnemyType.AGGRESSIVE, count: 3 }, // Removed difficulty
      { type: EnemyType.BOMBER, count: 2 } // Removed difficulty
    ],
    boss: {
      name: 'Magmus',
      description: 'Um robô gigante feito de magma que lança ondas de calor',
      type: EnemyType.BOMBER,
      health: 10,
      specialAbilities: ['LavaWave', 'FireBombs']
    }
  },
  {
    mapType: MapType.WINTER,
    mapName: 'Caverna de Gelo',
    enemies: [
      { type: EnemyType.NORMAL, count: 3 }, // Removed difficulty
      { type: EnemyType.FAST, count: 4 }, // Removed difficulty
      { type: EnemyType.GHOST, count: 2 } // Removed difficulty
    ]
  },
  {
    mapType: MapType.CAVE,
    mapName: 'Laboratório Secreto',
    enemies: [
      { type: EnemyType.AGGRESSIVE, count: 4 }, // Removed difficulty
      { type: EnemyType.TANK, count: 2 }, // Removed difficulty
      { type: EnemyType.GHOST, count: 2 }, // Removed difficulty
      { type: EnemyType.BOMBER, count: 2 } // Removed difficulty
    ],
    boss: {
      name: 'Dr. Destruidor',
      description: 'Um cientista robótico que controla um exército de mini-robôs',
      type: EnemyType.BOMBER,
      health: 15,
      specialAbilities: ['MinionSpawn', 'ShieldGenerator', 'MultiTargetLaser']
    }
  }
];

// Helper function to get enemies for a specific map
export function getEnemiesForMap(mapType: MapType): MapEnemies | undefined {
  return mapEnemyDistribution.find(map => map.mapType === mapType);
}
