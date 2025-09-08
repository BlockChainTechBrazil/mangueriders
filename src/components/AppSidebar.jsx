import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/header.css';

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState(Math.floor(Math.random() * 500) + 1500);
  
  // Efeito para simular jogadores online entrando e saindo
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlinePlayers(prev => {
        const change = Math.floor(Math.random() * 10) - 4; // -4 a +5 jogadores
        return Math.max(1200, Math.min(2500, prev + change));
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Verificar se a rota atual está ativa
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Array de rotas para o sidebar
  const routes = [
    { path: '/', label: 'Início', icon: '🏠' },
    { path: '/game', label: 'Solo', icon: '▶️' },
    { path: '/multiplayer', label: 'Multiplayer', icon: '👥' },
    { path: '/nft', label: 'NFTs', icon: '💎' },
    { path: '/home', label: 'Home', icon: '🌐' },
    { path: '/chumbivalley', label: 'ChumbiValley', icon: '🌄' },
  ];

  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-50 transition-all duration-300 flex flex-col 
                      ${collapsed ? 'w-20' : 'w-64'} bg-black/90 backdrop-blur-md shadow-xl shadow-cyan-500/10`}>
      
      {/* Padrão tecnológico de fundo */}
      <div className="absolute inset-0 z-0 opacity-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full" style={{ 
          backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFCC00' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        }}></div>
      </div>
      
      {/* Borda vertical luminosa */}
      <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500/50 via-cyan-500/30 to-yellow-500/50"></div>
      
      {/* Efeito de scanline */}
      <div className="scanline absolute inset-0"></div>
      
      {/* Área do logo */}
      <div className={`py-6 ${collapsed ? 'px-4' : 'px-6'} relative z-10`}>
        <div 
          className="flex items-center group cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center relative group-hover:scale-110 transition-all duration-300">
            <span className="text-xl">💣</span>
            <div className="absolute -inset-1 rounded-full bg-yellow-400 opacity-30 blur-sm group-hover:opacity-60 transition-opacity duration-300"></div>
            <div className="absolute -inset-2 rounded-full border border-yellow-500 opacity-0 group-hover:opacity-100 animate-ping"></div>
          </div>
          
          {!collapsed && (
            <div className="ml-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300">
                BOMBRIDER
              </h1>
              <div className="text-xs text-gray-400 font-mono">/* VIRTUAL EXPERIENCE */</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Separador */}
      <div className={`px-4 ${collapsed ? 'mx-2' : 'mx-4'} mb-6`}>
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
      </div>
      
      {/* Menu de navegação */}
      <nav className="flex-1 px-2 overflow-y-auto">
        <ul className="space-y-1.5">
          {routes.map((route) => (
            <li key={route.path}>
              <button
                onClick={() => navigate(route.path)}
                className={`w-full text-left py-3 rounded-lg font-medium transition-all duration-300 flex items-center relative overflow-hidden group
                          ${isActive(route.path) 
                              ? 'bg-gradient-to-r from-yellow-500/20 to-transparent text-yellow-400' 
                              : 'text-gray-300 hover:bg-white/5'
                           }
                          ${collapsed ? 'justify-center' : 'px-4'}`}
              >
                {isActive(route.path) && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>
                )}
                
                <span className={`text-xl ${collapsed ? '' : 'mr-3'}`}>{route.icon}</span>
                
                {!collapsed && (
                  <>
                    <span>{route.label}</span>
                    {isActive(route.path) && (
                      <span className="ml-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </>
                )}
                
                {/* Tooltip para menu recolhido */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {route.label}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Info de jogadores e botão toggle */}
      <div className={`px-4 py-4 ${collapsed ? 'items-center' : ''} flex flex-col gap-4 border-t border-white/10 relative z-10`}>
        {/* Informação de jogadores online */}
        {!collapsed && (
          <div className="px-2 py-2 bg-black/40 rounded border border-cyan-500/20 flex items-center text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5 animate-pulse"></span>
            <span className="text-flicker text-cyan-500">{onlinePlayers}</span>
            <span className="ml-1 text-gray-400">PLAYERS ONLINE</span>
          </div>
        )}
        
        {/* Botão para recolher/expandir o sidebar */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full p-2 rounded-lg border border-cyan-500/20 bg-black/20 hover:bg-cyan-900/20 text-cyan-500 transition-colors duration-200 flex items-center justify-center"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M9.707 4.293a1 1 0 010 1.414L5.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">Recolher Menu</span>
            </div>
          )}
        </button>
      </div>
      
      {/* Circuito animado na base */}
      <div className="h-1 w-full overflow-hidden">
        <div className="h-full w-10 bg-yellow-400 animate-circuit"></div>
      </div>
    </aside>
  );
};

export default AppSidebar;
