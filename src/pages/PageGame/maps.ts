// maps.ts
// Define os diferentes mapas do jogo

import * as THREE from 'three';

export enum MapType {
  FOREST = 'forest',
  CAVE = 'cave',
  DESERT = 'desert',
  WINTER = 'winter',
  VOLCANO = 'volcano'
}

export interface GameMap {
  id: MapType;
  name: string; // Nome do mapa
  description: string; // Descrição do mapa
  thumbnail: string; // Caminho para a imagem de miniatura do mapa
  // Dados do grid do mapa
  grid?: number[][]; // Grid representando a disposição dos blocos no mapa

  // Propriedades visuais
  groundColor: string; // Cor do chão/plano de fundo
  skyColor: string; // Cor do céu
  ambientLightColor: string; // Cor da luz ambiente
  ambientLightIntensity: number; // Intensidade da luz ambiente

  // Propriedades dos blocos
  solidBlockColor: string; // Cor dos blocos fixos
  solidBlockEmissive?: THREE.Color; // Cor emissiva dos blocos fixos (opcional)
  solidBlockRoughness: number; // Rugosidade dos blocos fixos
  solidBlockMetalness: number; // Metalicidade dos blocos fixos

  destructibleBlockColor: string; // Cor dos blocos quebráveis
  destructibleBlockEmissive?: THREE.Color; // Cor emissiva dos blocos quebráveis (opcional)
  destructibleBlockRoughness: number; // Rugosidade dos blocos quebráveis
  destructibleBlockMetalness: number; // Metalicidade dos blocos quebráveis

  // Configuração do mapa
  destructibleBlockDensity: number; // Densidade de blocos quebráveis (0-1)

  // Informações de jogo
  difficulty: 'easy' | 'medium' | 'hard'; // Dificuldade do mapa
}

// Definição dos mapas disponíveis
export const GAME_MAPS: Record<MapType, GameMap> = {
  [MapType.FOREST]: {
    id: MapType.FOREST,
    name: "Floresta Encantada",
    description: "Um mapa florestal com grama verde e árvores. Dificuldade equilibrada para todos os jogadores.",
    thumbnail: "/assets/images/maps/forest-thumb.jpg",

    groundColor: "#669966", // Verde gramado
    skyColor: "#87CEEB", // Azul céu
    ambientLightColor: "#ffffff",
    ambientLightIntensity: 1.0, solidBlockColor: "#3A3A3A", // Cinza muito escuro para blocos fixos
    solidBlockRoughness: 0.7,
    solidBlockMetalness: 0.3,
    solidBlockEmissive: new THREE.Color(0x000000), // Sem emissão de luz

    destructibleBlockColor: "#CD6839", // Marrom alaranjado para blocos quebráveis
    destructibleBlockRoughness: 0.8,
    destructibleBlockMetalness: 0.1,
    destructibleBlockEmissive: new THREE.Color(0x210800), // Leve brilho vermelho-alaranjado

    destructibleBlockDensity: 0.6, // 60% de chance de bloco destrutível

    difficulty: "easy"
  },

  [MapType.CAVE]: {
    id: MapType.CAVE,
    name: "Caverna Misteriosa",
    description: "Um mapa dentro de uma caverna escura com cristais luminosos. Atenção aos passos!",
    thumbnail: "/assets/images/maps/cave-thumb.jpg",

    groundColor: "#333333", // Cinza escuro para o chão de pedra
    skyColor: "#111122", // Quase preto com tom azulado
    ambientLightColor: "#5555ff", // Luz azulada
    ambientLightIntensity: 0.7,

    solidBlockColor: "#444444", // Cinza para paredes de pedra
    solidBlockEmissive: new THREE.Color(0x222222),
    solidBlockRoughness: 0.9,
    solidBlockMetalness: 0.4,

    destructibleBlockColor: "#5555aa", // Azul escuro para cristais
    destructibleBlockEmissive: new THREE.Color(0x0000ff),
    destructibleBlockRoughness: 0.3,
    destructibleBlockMetalness: 0.8,

    destructibleBlockDensity: 0.5, // 50% de chance de bloco destrutível

    difficulty: "medium"
  },

  [MapType.DESERT]: {
    id: MapType.DESERT,
    name: "Deserto Calcinante",
    description: "Um vasto deserto com dunas de areia e rochas. Cuidado com o calor intenso!",
    thumbnail: "/assets/images/maps/desert-thumb.jpg",

    groundColor: "#E6BE8A", // Cor de areia
    skyColor: "#FFD580", // Céu amarelado
    ambientLightColor: "#ffaa33",
    ambientLightIntensity: 1.2,

    solidBlockColor: "#AA8866", // Marrom para rochas grandes
    solidBlockRoughness: 0.8,
    solidBlockMetalness: 0.2,

    destructibleBlockColor: "#DDAA77", // Bege para pilhas de areia
    destructibleBlockRoughness: 0.9,
    destructibleBlockMetalness: 0.1,

    destructibleBlockDensity: 0.5, // 50% de chance de bloco destrutível

    difficulty: "medium"
  },

  [MapType.WINTER]: {
    id: MapType.WINTER,
    name: "Terra Congelada",
    description: "Um paisagem gélida com neve e gelo. Os blocos são escorregadios!",
    thumbnail: "/assets/images/maps/winter-thumb.jpg",

    groundColor: "#DDEEFF", // Branco azulado para neve
    skyColor: "#AACCEE", // Azul claro
    ambientLightColor: "#ccddff",
    ambientLightIntensity: 0.9,

    solidBlockColor: "#99AACC", // Azul claro para blocos de gelo permanente
    solidBlockEmissive: new THREE.Color(0x113366),
    solidBlockRoughness: 0.1,
    solidBlockMetalness: 0.9,

    destructibleBlockColor: "#FFFFFF", // Branco para neve
    destructibleBlockRoughness: 0.7,
    destructibleBlockMetalness: 0.3,

    destructibleBlockDensity: 0.7, // 70% de chance de bloco destrutível

    difficulty: "hard"
  },

  [MapType.VOLCANO]: {
    id: MapType.VOLCANO,
    name: "Vulcão Ativo",
    description: "Um mapa infernal com lava e rochas vulcânicas. Cuidado para não se queimar!",
    thumbnail: "/assets/images/maps/volcano-thumb.jpg",

    groundColor: "#551111", // Vermelho escuro para rocha vulcânica
    skyColor: "#FF6633", // Laranja para céu vulcânico
    ambientLightColor: "#ff3300",
    ambientLightIntensity: 1.0,

    solidBlockColor: "#333333", // Cinza escuro para rocha vulcânica
    solidBlockEmissive: new THREE.Color(0x220000),
    solidBlockRoughness: 0.8,
    solidBlockMetalness: 0.5,

    destructibleBlockColor: "#AA3300", // Vermelho para blocos de magma
    destructibleBlockEmissive: new THREE.Color(0xff2200),
    destructibleBlockRoughness: 0.6,
    destructibleBlockMetalness: 0.7,

    destructibleBlockDensity: 0.55, // 55% de chance de bloco destrutível

    difficulty: "hard"
  }
};

// Mapa padrão
export const DEFAULT_MAP = MapType.FOREST;

// Função para obter um mapa por ID
export function getMapById(id: MapType): GameMap {
  return GAME_MAPS[id] || GAME_MAPS[DEFAULT_MAP];
}
