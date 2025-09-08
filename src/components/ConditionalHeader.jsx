import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';

// Lista de rotas onde o header original deve aparecer
const ORIGINAL_HEADER_ROUTES = [
  '/',
  '/home',
  '/multiplayer',
  '/nft',
  '/game',
  '/landing',
  '/sobre'
];

// Header condicional que decide qual versão do header mostrar com base na rota
const ConditionalHeader = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Verifica se é uma rota que deve usar o header original
  // Rotas que usam o Header padrão estão na lista ORIGINAL_HEADER_ROUTES

  // Se for a rota GAYA, exibimos um header simplificado sem conexão de wallet
  if (currentPath === '/gaya' || currentPath.startsWith('/gaya/')) {
    return (<header className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-black/30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 mb-1 opacity-80">Parceria</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#FF5A00] via-[#FF00AA] to-[#A200FF] bg-clip-text text-transparent">GAYA</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="/"
            className="text-white/80 hover:text-white transition-colors"
            onClick={(e) => {
              e.preventDefault();
              if (confirm('Voltar para a home do jogo?')) {
                window.location.href = '/';
              }
            }}
          >
            Voltar ao jogo
          </a>
        </div>
      </div>
    </header>
    );
  }

  // Em todas as outras rotas, usamos o header original
  return <Header />;
};

export default ConditionalHeader;
