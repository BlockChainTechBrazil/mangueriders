import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Lista de rotas que precisam do contexto da wallet
const WALLET_REQUIRED_ROUTES = [
  '/',
  '/home',
  '/multiplayer',
  '/nft',
  '/game',
  '/sobre'
];

// Provedor condicional que só carrega o contexto da wallet nas rotas que precisam
export const ConditionalWalletProvider = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [WalletProviderComponent, setWalletProviderComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Verifica se a rota atual precisa do contexto de wallet
  const isWalletRequired = WALLET_REQUIRED_ROUTES.some(route => 
    currentPath === route || currentPath.startsWith(`${route}/`)
  );

  useEffect(() => {
    // Apenas importa o WalletProvider se for necessário
    if (isWalletRequired && !WalletProviderComponent) {
      setIsLoading(true);
      // Importação dinâmica do componente apenas quando for necessário
      import('./WalletContext').then(({ WalletProvider }) => {
        setWalletProviderComponent(() => WalletProvider);
        setIsLoading(false);
      });
    }
  }, [isWalletRequired, WalletProviderComponent]);

  // Se não precisar de wallet, simplesmente renderiza os children
  if (!isWalletRequired) {
    return <>{children}</>;
  }

  // Se precisar, mas o componente ainda não foi carregado, mostra um estado de carregamento ou os children
  if (isWalletRequired && !WalletProviderComponent) {
    return isLoading ? <div className="loading-wallet">Carregando recursos necessários...</div> : <>{children}</>;
  }

  // Se precisar e o componente já foi carregado, envolve com o WalletProvider
  return (
    <WalletProviderComponent>
      {children}
    </WalletProviderComponent>
  );
};

export default ConditionalWalletProvider;
