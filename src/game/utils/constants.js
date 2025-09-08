// Constantes do jogo

// Personagens jogáveis
export const CHARACTERS = {
  ALEX: {
    id: 'alex',
    name: 'Álex',
    element: 'Fogo',
    passiveAbility: 'Velocidade equilibrada',
    personality: 'Determinado e corajoso',
    initialSpeed: 1.0,
    initialBombs: 1,
    initialBombRange: 2,
    modelPath: '/models/characters/Alex.glb',
    thumbnail: '/assets/images/characters/alex.jpg',
    description: 'Equilibrado para todos os tipos de jogadores',
    specialAbility: 'Aumenta velocidade após coletar power-ups',
    color: '#FF5500',
  },
  AERY: {
    id: 'aery',
    name: 'Aery',
    element: 'Ar',
    passiveAbility: 'Velocidade +',
    personality: 'Rebelde e veloz',
    initialSpeed: 1.2,
    initialBombs: 1,
    initialBombRange: 2,
    modelPath: '/models/characters/Alex.glb', // Temporariamente usando mesmo modelo
    thumbnail: '/assets/images/characters/Aery.jpg',
    description: 'Rápida, ideal para jogadores ágeis',
    specialAbility: 'Pode saltar sobre bombas',
    color: '#88CCFF',
  },
  TERENZO: {
    id: 'terenzo',
    name: 'Terenzo',
    element: 'Terra',
    passiveAbility: 'Reduz knockback',
    personality: 'Paciente e forte',
    initialSpeed: 0.9,
    initialBombs: 1,
    initialBombRange: 2, // Maior alcance inicial
    modelPath: '/models/characters/Alex.glb', // Temporariamente usando mesmo modelo
    thumbnail: '/assets/images/characters/Terenzo.jpg',
    description: 'Forte e resistente, ideal para jogadores estratégicos',
    specialAbility: 'Pode empurrar bombas',
    color: '#8B4513',
  },
  WEET: {
    id: 'weet',
    name: 'Weet',
    element: 'Água',
    passiveAbility: 'Atravessa água',
    personality: 'Serena e precisa',
    initialSpeed: 1.1,
    initialBombs: 1,
    initialBombRange: 2,
    modelPath: '/models/characters/Weet.glb',
    thumbnail: '/assets/images/characters/weet.jpg',
    description: 'Ágil e versátil, ideal para mapas com água',
    specialAbility: 'Bombas podem atravessar água',
    color: '#0088AA',
  },
  RAIADO: {
    id: 'raiado',
    name: 'Raiado',
    element: 'Raio',
    passiveAbility: 'Aumenta alcance',
    personality: 'Intenso e explosivo',
    initialSpeed: 1.0,
    initialBombs: 1,
    initialBombRange: 2,
    modelPath: '/models/characters/Raiado.glb',
    thumbnail: '/assets/images/characters/raiado.jpg',
    description: 'Especialista em explosões, ideal para jogadores ofensivos',
    specialAbility: 'Bombas geram explosões em cruz',
    color: '#F3D500',
  },
};

// Dinossauros
export const DINOS = {
  RAPTORIX: {
    name: 'Raptorix',
    type: 'Velocidade',
    initialAbility: 'Aumenta velocidade do Rider',
    evolution: 'Pode atravessar blocos',
    evolutionLevel: 3,
  },
  TRICERABOOM: {
    name: 'TriceraBoom',
    type: 'Defesa',
    initialAbility: 'Protege contra 1 explosão extra',
    evolution: 'Reflete explosões',
    evolutionLevel: 3,
  },
  FLAMEODON: {
    name: 'Flameodon',
    type: 'Ataque',
    initialAbility: 'Fogo extra nas bombas',
    evolution: 'Cria explosões em cruz',
    evolutionLevel: 3,
  },
  AQUALUX: {
    name: 'Aqualux',
    type: 'Suporte',
    initialAbility: 'Pode atravessar água sem perder bomba',
    evolution: 'Escudo aquático temporário',
    evolutionLevel: 3,
  },
  AEROZARD: {
    name: 'Aerozard',
    type: 'Mobilidade',
    initialAbility: 'Pulo curto por cima de bombas',
    evolution: 'Dash aéreo curto',
    evolutionLevel: 3,
  },
  TREXON: {
    name: 'T-Rexon',
    type: 'Força',
    initialAbility: 'Empurra blocos/bombas',
    evolution: 'Destrói blocos frágeis ao contato',
    evolutionLevel: 3,
  },
};

// Power-Ups
export const POWER_UPS = {
  BOMB_UP: {
    name: 'Bomb Up',
    icon: '💣',
    effect: 'Adiciona +1 bomba simultânea',
  },
  FIRE_UP: {
    name: 'Fire Up',
    icon: '🔥',
    effect: 'Aumenta +1 de alcance de explosão',
  },
  SPEED_UP: {
    name: 'Speed Up',
    icon: '🏃‍♂️',
    effect: 'Aumenta velocidade do jogador',
  },
  FULL_ARMOR: {
    name: 'Full Armor',
    icon: '🛡️',
    effect: 'Invulnerabilidade curta após dano',
  },
  REMOTE_BOMB: {
    name: 'Remote Bomb',
    icon: '💫',
    effect: 'Detona bomba manualmente',
  },
  KICK: {
    name: 'Kick',
    icon: '💨',
    effect: 'Chuta bomba pela linha',
  },
  PASS: {
    name: 'Pass',
    icon: '🌀',
    effect: 'Atravesse bombas sem colisão',
  },
  RANDOMIZER: {
    name: 'Randomizer',
    icon: '🎲',
    effect: 'Pode ser efeito positivo ou negativo',
  },
};

// Mapas - Adicionando propriedades visuais e de jogo para cada mapa
export const MAPS = {
  FOREST: {
    id: 'forest',
    name: 'Floresta Pré-Histórica',
    characteristics: 'Grama oculta bombas, ovos escondidos',
    size: { width: 15, height: 15 },
    // Propriedades visuais
    groundColor: "#669966", // Verde gramado
    skyColor: "#87CEEB", // Azul céu
    ambientLightColor: "#ffffff",
    ambientLightIntensity: 1.0,
    // Propriedades dos blocos
    solidBlockColor: "#505050", // Cinza escuro para troncos de árvore
    solidBlockRoughness: 0.7,
    solidBlockMetalness: 0.3,
    destructibleBlockColor: "#CD6839", // Marrom alaranjado para arbustos
    destructibleBlockRoughness: 0.8,
    destructibleBlockMetalness: 0.1,
    // Densidade de blocos destrutiveis (0-1)
    destructibleBlockDensity: 0.6,
    // Dificuldade do mapa
    difficulty: "easy",
    // Caminho para imagem de miniatura
    thumbnail: "/assets/images/game/maps/forest.jpg",
  },
  CAVE: {
    id: 'cave',
    name: 'Caverna do Eco',
    characteristics: 'Som reverbera bombas (detona em delay)',
    size: { width: 13, height: 13 },
    // Propriedades visuais
    groundColor: "#333333", // Cinza escuro para o chão de pedra
    skyColor: "#111122", // Quase preto com tom azulado
    ambientLightColor: "#5555ff", // Luz azulada
    ambientLightIntensity: 0.7,
    // Propriedades dos blocos
    solidBlockColor: "#444444", // Cinza para paredes de pedra
    solidBlockEmissive: "#222222",
    solidBlockRoughness: 0.9,
    solidBlockMetalness: 0.4,
    destructibleBlockColor: "#5555aa", // Azul escuro para cristais
    destructibleBlockEmissive: "#0000ff",
    destructibleBlockRoughness: 0.3,
    destructibleBlockMetalness: 0.8,
    // Densidade de blocos destrutiveis
    destructibleBlockDensity: 0.5,
    // Dificuldade do mapa
    difficulty: "medium",
    // Caminho para imagem de miniatura
    thumbnail: "/assets/images/game/maps/cave.jpg",
  },
  DESERT: {
    id: 'desert',
    name: 'Deserto Atômico',
    characteristics: 'Tempestades de areia reduzem visão temporariamente',
    size: { width: 17, height: 17 },
    // Propriedades visuais
    groundColor: "#E6BE8A", // Cor de areia
    skyColor: "#FFD580", // Céu amarelado
    ambientLightColor: "#ffaa33",
    ambientLightIntensity: 1.2,
    // Propriedades dos blocos
    solidBlockColor: "#AA8866", // Marrom para rochas grandes
    solidBlockRoughness: 0.8,
    solidBlockMetalness: 0.2,
    destructibleBlockColor: "#DDAA77", // Bege para pilhas de areia
    destructibleBlockRoughness: 0.9,
    destructibleBlockMetalness: 0.1,
    // Densidade de blocos destrutiveis
    destructibleBlockDensity: 0.5,
    // Dificuldade do mapa
    difficulty: "medium",
    // Caminho para imagem de miniatura
    thumbnail: "/assets/images/game/maps/desert.jpg",
  },
  WINTER: {
    id: 'winter',
    name: 'Terra Congelada',
    characteristics: 'Paisagem gélida com neve e gelo. Os blocos são escorregadios!',
    size: { width: 15, height: 15 },
    // Propriedades visuais
    groundColor: "#DDEEFF", // Branco azulado para neve
    skyColor: "#AACCEE", // Azul claro
    ambientLightColor: "#ccddff",
    ambientLightIntensity: 0.9,
    // Propriedades dos blocos
    solidBlockColor: "#99AACC", // Azul claro para blocos de gelo permanente
    solidBlockEmissive: "#113366",
    solidBlockRoughness: 0.1,
    solidBlockMetalness: 0.9,
    destructibleBlockColor: "#FFFFFF", // Branco para neve
    destructibleBlockRoughness: 0.7,
    destructibleBlockMetalness: 0.3,
    // Densidade de blocos destrutiveis
    destructibleBlockDensity: 0.7,
    // Dificuldade do mapa
    difficulty: "hard",
    // Caminho para imagem de miniatura
    thumbnail: "/assets/images/game/maps/winter.jpg",
  },
  VOLCANO: {
    id: 'volcano',
    name: 'Vulcão Ativo',
    characteristics: 'Um mapa infernal com lava e rochas vulcânicas',
    size: { width: 13, height: 13 },
    // Propriedades visuais
    groundColor: "#551111", // Vermelho escuro para rocha vulcânica
    skyColor: "#FF6633", // Laranja para céu vulcânico
    ambientLightColor: "#ff3300",
    ambientLightIntensity: 1.0,
    // Propriedades dos blocos
    solidBlockColor: "#333333", // Cinza escuro para rocha vulcânica
    solidBlockEmissive: "#220000",
    solidBlockRoughness: 0.8,
    solidBlockMetalness: 0.5,
    destructibleBlockColor: "#AA3300", // Vermelho para blocos de magma
    destructibleBlockEmissive: "#ff2200",
    destructibleBlockRoughness: 0.6,
    destructibleBlockMetalness: 0.7,
    // Densidade de blocos destrutiveis
    destructibleBlockDensity: 0.55,
    // Dificuldade do mapa
    difficulty: "hard",
    // Caminho para imagem de miniatura
    thumbnail: "/assets/images/game/maps/volcano.jpg",
  },
};

// Inimigos
export const ENEMIES = {
  DARK_DINO: {
    name: 'Dino Sombrio',
    behavior: 'Imita seus movimentos',
    notes: 'Mini-chefe',
  },
  NEXX_DRONE: {
    name: 'Drone do Nexx',
    behavior: 'Persegue por radar',
    notes: 'Rápido, mas frágil',
  },
  LIVING_BOMB: {
    name: 'Bomba-Viva',
    behavior: 'Anda aleatoriamente e explode',
    notes: 'Solta loot raro às vezes',
  },
  TOXIC_SLIME: {
    name: 'Slime Tóxico',
    behavior: 'Libera nuvem que desativa power-ups',
    notes: 'Apenas em pântano',
  },
};

// Tipos de blocos
export const BLOCK_TYPES = {
  EMPTY: 0,
  WALL: 1,
  DESTRUCTIBLE: 2,
  BOMB: 3,
  EXPLOSION: 4,
  POWER_UP: 5,
  DINO_EGG: 6,
  WATER: 7,
  PORTAL: 8,
};

