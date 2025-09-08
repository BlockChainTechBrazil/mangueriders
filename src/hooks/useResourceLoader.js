// ...comentários removidos...
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NON_GAME_ROUTES = ['/gaya'];

const ROUTE_RESOURCES = {
  '/': ['wallet', 'nft', 'ui'],
  '/home': ['wallet', 'nft', 'ui'],
  '/multiplayer': ['wallet', 'game', 'models3d', 'ui'],
  '/nft': ['wallet', 'nft', 'ui'],
  '/game': ['wallet', 'game', 'models3d', 'ui'],
  '/gaya': ['ui'], // Gaya só precisa de UI, não de wallet, game, etc.
  '/landing': ['ui']
};

export const useResourceLoader = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getBaseRoute = (path) => {
    if (ROUTE_RESOURCES[path]) return path;

    return Object.keys(ROUTE_RESOURCES)
      .filter(route => path.startsWith(`${route}/`))
      .sort((a, b) => b.length - a.length)[0] || '/gaya'; // Padrão para /gaya se nada corresponder
  };

  useEffect(() => {
    const baseRoute = getBaseRoute(currentPath);
    const requiredResources = ROUTE_RESOURCES[baseRoute] || ['ui'];

    window.LOAD_WALLET = requiredResources.includes('wallet');
    window.LOAD_NFT = requiredResources.includes('nft');
    window.LOAD_GAME = requiredResources.includes('game');
    window.LOAD_3D_MODELS = requiredResources.includes('models3d');
    window.SKIP_GAME_ASSETS = !requiredResources.includes('game');


    if (!requiredResources.includes('game')) {
      if (window.THREE_ASSETS_CACHE) {
        window.THREE_ASSETS_CACHE = {};
      }

      // Libera memória de texturas, se houver
      if (window.THREE && window.THREE.Cache) {
        window.THREE.Cache.clear();
      }
    }

    return () => {
    };
  }, [currentPath]);
};

export const useShouldLoadGameAssets = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const shouldSkipGameAssets = NON_GAME_ROUTES.some(route =>
    currentPath === route || currentPath.startsWith(`${route}/`)
  );

  return !shouldSkipGameAssets;
};

export const useShouldLoadWallet = () => {
  return window.LOAD_WALLET !== false;
};

export const useShouldLoadNFT = () => {
  return window.LOAD_NFT !== false;
};

export const useShouldLoad3DModels = () => {
  return window.LOAD_3D_MODELS !== false;
};

export default useResourceLoader;
