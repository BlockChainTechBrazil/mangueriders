import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useResourceLoader } from '@/hooks/useResourceLoader';

// Componente que gerencia o carregamento inteligente de recursos baseado na rota atual
const ResourceManager = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Usa o hook personalizado para gerenciamento de recursos
  useResourceLoader();
  
  // Configuração adicional específica por rota
  useEffect(() => {
    // Configuração especial para a rota GAYA - desativar todos os carregamentos desnecessários
    if (currentPath === '/gaya' || currentPath.startsWith('/gaya/')) {
      console.log('[ResourceManager] Configuração especial para rota GAYA');
      
      // Flags globais para bloqueio de recursos
      window.SKIP_GAME_ASSETS = true;
      window.LOAD_WALLET = false;
      window.LOAD_NFT = false;
      window.LOAD_GAME = false;
      window.LOAD_3D_MODELS = false;
      
      // Limpeza de recursos que podem ter sido carregados antes
      if (window.THREE_ASSETS_CACHE) {
        console.log('[ResourceManager] Limpando cache de modelos 3D para GAYA');
        window.THREE_ASSETS_CACHE = {};
      }
      
      // Detém quaisquer workers ou serviços secundários relacionados ao jogo
      if (window.gameWorkers) {
        Object.values(window.gameWorkers).forEach(worker => {
          console.log('[ResourceManager] Terminando game worker');
          worker.terminate();
        });
        window.gameWorkers = {};
      }
    }
    
    return () => {
      // Cleanup ao mudar de rota
    };
  }, [currentPath]);
  
  // Apenas renderiza os children, os hooks fazem todo o trabalho
  return <>{children}</>;
};

export default ResourceManager;
