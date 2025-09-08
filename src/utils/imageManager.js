// Image Manager - Centralized image path management
// Este arquivo centraliza todas as referências de imagens do projeto

/**
 * NFT Images - Imagens relacionadas aos NFTs
 */
export const nftImages = {
  // Moedas e Tokens
  gcoin: '/images/nft/gcoin.png',
  gaiaCoin: '/images/nft/GaiaCoin.png',

  // Story/História
  prehistoricMan: '/images/nft/prehistoric_man.jpg',

  // Ovos de Dinossauro (NFTs colecionáveis)
  dinoEggs: {
    fire: '/images/nft/dino_egg1.jpg',      // Fogo
    lightning: '/images/nft/dino_egg2.jpg', // Raio
    earth: '/images/nft/dino_egg3.jpg',     // Terra
    water: '/images/nft/dino_egg4.jpg',     // Água
    air: '/images/nft/dino_egg5.jpg',       // Ar
    extra1: '/images/nft/dino_egg6.jpg',    // Extra
    extra2: '/images/nft/dino_egg7.jpg',    // Extra
  },

  // NFTs de Personagens
  characters: {
    alex: '/images/nft/characters/alex.png',
    raiado: '/images/nft/characters/raiado.png',
    weet: '/images/nft/characters/weet.png',
  },

  // NFTs de Itens/Power-ups
  items: {
    bomb: '/images/nft/items/bomb.png',
    shield: '/images/nft/items/shield.png',
    speed: '/images/nft/items/speed.png',
  }
};

/**
 * Game Images - Imagens do jogo
 */
export const gameImages = {
  // UI Elements
  ui: {
    logo: '/images/game/logo.png',
    background: '/images/game/background.jpg',
    button: '/images/game/button.png',
  },

  // Characters (usados nos NFTs)
  characters: {
    alex: '/images/characters/Alex.png',
    raiado: '/images/characters/Raiado.png',
    weet: '/images/characters/Weet.png',
    charFire: '/images/characters/charFire.jpeg',
    charWater: '/images/characters/charWater.jpeg',
    charRaio: '/images/characters/charRaio.jpeg',
    charEarth: '/images/characters/charEarth.jpeg',
    charAir: '/images/characters/charAir.jpeg',
  },
  // Game Elements
  elements: {
    bomb: '/images/game/bomb.jpg',
    arcade: '/images/game/arcade.png',
    gameplay: '/images/game/gameplay.jpg',
    explosion: '/images/game/explosion.png',
    powerup: '/images/game/powerup.png',
  }
};

/**
 * UI Images - Imagens da interface
 */
export const uiImages = {
  // Icons
  icons: {
    wallet: '/images/ui/wallet-icon.png',
    menu: '/images/ui/menu-icon.png',
    close: '/images/ui/close-icon.png',
    loading: '/images/ui/loading-spinner.gif',
  },

  // Backgrounds
  backgrounds: {
    hero: '/images/ui/hero-bg.jpg',
    section: '/images/ui/section-bg.png',
  }
};

/**
 * Default/Fallback Images
 */
export const defaultImages = {
  nftPlaceholder: '/images/placeholder/nft-placeholder.png',
  avatarPlaceholder: '/images/placeholder/avatar-placeholder.png',
  loadingSpinner: '/images/ui/loading-spinner.gif',
};

/**
 * Helper function to get image with fallback
 * @param {string} imagePath - Caminho da imagem
 * @param {string} fallback - Imagem de fallback
 * @returns {string} - Caminho da imagem ou fallback
 */
export const getImageWithFallback = (imagePath, fallback = defaultImages.nftPlaceholder) => {
  return imagePath || fallback;
};

/**
 * Helper function to get dino egg image by index
 * @param {number} index - Índice do ovo (0-4 para os elementos principais)
 * @returns {string} - Caminho da imagem do ovo
 */
export const getDinoEggImage = (index) => {
  const eggKeys = ['fire', 'lightning', 'earth', 'water', 'air'];
  const eggKey = eggKeys[index] || 'fire';
  return nftImages.dinoEggs[eggKey];
};

/**
 * Helper function to preload images
 * @param {string[]} imagePaths - Array de caminhos de imagem
 * @returns {Promise<HTMLImageElement[]>} - Promise com as imagens carregadas
 */
export const preloadImages = (imagePaths) => {
  return Promise.all(
    imagePaths.map(path => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
        img.src = path;
      });
    })
  );
};

/**
 * Get all image paths for preloading
 * @returns {string[]} - Array com todos os caminhos de imagem
 */
export const getAllImagePaths = () => {
  const paths = [];

  // Collect all NFT images
  Object.values(nftImages).forEach(item => {
    if (typeof item === 'string') {
      paths.push(item);
    } else {
      Object.values(item).forEach(path => paths.push(path));
    }
  });

  // Collect all game images
  Object.values(gameImages).forEach(category => {
    Object.values(category).forEach(path => paths.push(path));
  });

  // Collect all UI images
  Object.values(uiImages).forEach(category => {
    Object.values(category).forEach(path => paths.push(path));
  });

  // Add default images
  Object.values(defaultImages).forEach(path => paths.push(path));

  return [...new Set(paths)]; // Remove duplicates
};

/**
 * Image categories for easier access
 */
export const imageCategories = {
  nft: nftImages,
  game: gameImages,
  ui: uiImages,
  default: defaultImages
};

// Export individual categories for convenience
export { nftImages as nft };
export { gameImages as game };
export { uiImages as ui };
export { defaultImages as defaults };

// Default export with all images
export default {
  nft: nftImages,
  game: gameImages,
  ui: uiImages,
  default: defaultImages,
  getImageWithFallback,
  getDinoEggImage,
  preloadImages,
  getAllImagePaths
};
