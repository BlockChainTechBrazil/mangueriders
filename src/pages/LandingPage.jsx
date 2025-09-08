import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/header.css';

function LandingPage() {
  // NOTA: O menu do Header foi movido para um componente global Header.jsx
  // Esta página agora serve apenas como referência e não é mais a página principal
  const navigate = useNavigate();
  const location = useLocation();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState(Math.floor(Math.random() * 500) + 1500);

  // Função para verificar qual rota está ativa
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Efeito para detectar scroll e mudar a aparência do header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer para animações de scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (id) => (el) => {
    sectionRefs.current[id] = el;
  };

  const isVisible = (id) => visibleSections.has(id);

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

  // Array de rotas para o header
  const routes = [
    { path: '/', label: 'Início', icon: '🏠' },
    { path: '/game', label: 'Solo', icon: '▶️' },
    { path: '/multiplayer', label: 'Multiplayer', icon: '👥' },
    { path: '/nft', label: 'NFTs', icon: '💎' },
    { path: '/home', label: 'Home', icon: '🌐' },
    { path: '/chumbivalley', label: 'ChumbiValley', icon: '🌄' },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header Tecnológico Fixo */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-md shadow-lg shadow-cyan-500/10' 
            : 'bg-transparent'
        }`}
      >
        {/* Padrão tecnológico de fundo */}
        <div className="absolute inset-0 z-0 opacity-20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full" style={{ 
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFCC00' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center group cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center mr-3 relative group-hover:scale-110 transition-all duration-300">
                <span className="text-xl">💣</span>
                {/* Efeito de brilho em torno do logo */}
                <div className="absolute -inset-1 rounded-full bg-yellow-400 opacity-30 blur-sm group-hover:opacity-60 transition-opacity duration-300"></div>
                {/* Efeito de pulse */}
                <div className="absolute -inset-2 rounded-full border border-yellow-500 opacity-0 group-hover:opacity-100 animate-ping"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent group-hover:scale-105 transition-all duration-300">
                  BOMBRIDER
                </h1>
                <div className="text-xs text-gray-400 font-mono">/* VIRTUAL EXPERIENCE */</div>
              </div>
            </div>

            {/* Informações tecnológicas decorativas */}
            <div className="hidden lg:flex items-center text-xs text-cyan-500 font-mono mr-4">
              <div className="flex items-center mr-4">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                <span>SYS ONLINE</span>
              </div>
              <div>ID: {Math.floor(Math.random() * 9000 + 1000)}-X</div>
              <div className="ml-4 px-2 py-1 bg-black/40 rounded border border-cyan-500/20 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5 animate-pulse"></span>
                <span className="text-flicker">{onlinePlayers}</span>
                <span className="ml-1 text-gray-400">PLAYERS</span>
              </div>
            </div>

            {/* Menu de navegação para desktop */}
            <nav className="hidden md:block">
              <ul className="flex space-x-1.5 items-center">
                {routes.map((route) => (
                  <li key={route.path}>
                    <button 
                      onClick={() => navigate(route.path)}
                      className={`header-button relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 overflow-hidden ${
                        isActive(route.path)
                          ? 'text-black'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {isActive(route.path) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 -z-10"></div>
                      )}
                      <span className="flex items-center">
                        <span className="mr-1.5 text-base">{route.icon}</span>
                        {route.label}
                      </span>
                      {isActive(route.path) && (
                        <>
                          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-yellow-400"></span>
                          <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-yellow-400 notification-pulse"></span>
                        </>
                      )}
                    </button>
                  </li>
                ))}
                
                {/* Botão Login com efeito especial */}
                <li className="ml-2">
                  <button className="relative group px-5 py-2 bg-transparent overflow-hidden">
                    <span className="relative z-10 flex items-center text-sm text-cyan-400 font-semibold group-hover:text-white transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      LOGIN
                    </span>
                    <span className="absolute inset-0 border border-cyan-500/50 rounded"></span>
                    <span className="absolute inset-0 bg-cyan-500/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </button>
                </li>
              </ul>
            </nav>

            {/* Botão de menu para mobile */}
            <button 
              className="md:hidden text-white p-2 relative bg-black/50 rounded-md border border-yellow-500/20"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 flex flex-col items-end gap-1.5">
                <span className={`block h-0.5 bg-yellow-400 transition-all duration-300 ${mobileMenuOpen ? 'w-6 -rotate-45 translate-y-2' : 'w-6'}`}></span>
                <span className={`block h-0.5 bg-yellow-400 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'w-4'}`}></span>
                <span className={`block h-0.5 bg-yellow-400 transition-all duration-300 ${mobileMenuOpen ? 'w-6 rotate-45 -translate-y-2' : 'w-5'}`}></span>
              </div>
              <div className="absolute -inset-px bg-yellow-400/10 rounded-md blur-sm"></div>
            </button>
          </div>

          {/* Menu de navegação para mobile */}
          <div 
            className={`md:hidden transition-all duration-300 overflow-hidden ${
              mobileMenuOpen ? 'max-h-96 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-95'
            }`}
            style={{ transformOrigin: 'top' }}
          >
            <div className="py-4 space-y-2 relative">
              {/* Linhas decorativas */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500/20 to-transparent"></div>
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-500/10 to-transparent"></div>

              <ul className="space-y-2">
                {routes.map((route) => (
                  <li key={route.path}>
                    <button 
                      onClick={() => {
                        navigate(route.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left pl-10 pr-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center relative overflow-hidden ${
                        isActive(route.path)
                          ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-400'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      {isActive(route.path) && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>
                      )}
                      <span className="mr-3 text-xl">{route.icon}</span>
                      <span>{route.label}</span>
                      {isActive(route.path) && (
                        <span className="ml-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L10 14.586l5.293-5.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </button>
                  </li>
                ))}
                
                {/* Botão de login para mobile */}
                <li className="mt-4 px-6">
                  <button 
                    className="w-full py-3 bg-cyan-500/20 rounded-lg border border-cyan-500/40 text-cyan-400 font-semibold transition-all duration-300 hover:bg-cyan-500/30"
                  >
                    LOGIN / CADASTRO
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Efeito de borda de energia */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-70"></div>

        {/* Efeito de circuito */}
        <div className="h-1 w-full overflow-hidden">
          <div className="h-full w-10 bg-yellow-400 animate-circuit"></div>
        </div>
        
        {/* Efeito de scanline */}
        <div className="scanline hidden md:block"></div>
      </header>

      {/* Espaçador para compensar o header fixo */}
      <div className="h-24"></div>

      {/* Seção Hero com Animação 3D Interativa */}
      <section className="relative h-screen flex items-center justify-center">        
        {/* Conteúdo sobreposto */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="text-center mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
              BOMBRIDER
            </h1>
            <div className="bg-yellow-400 text-black p-6 rounded-lg border-4 border-yellow-600 shadow-2xl max-w-4xl mx-4 transform hover:scale-105 transition-all duration-300">
              <p className="text-lg md:text-xl font-bold leading-relaxed">
                NO FUTURO, O PLANETA TERRA ESTÁ À BEIRA DO COLAPSO. DÉCADAS APÓS A ÚLTIMA COLHEITA DE FOGO, 
                A TERRA ESTÁ QUEBRADA. MAS NÃO MORTA. OS BOMBRIDERS SURGEM COMO A ÚLTIMA ESPERANÇA DA HUMANIDADE.
              </p>
            </div>
          </div>
          
          {/* Botões de Ação */}
          <div className="flex flex-wrap gap-6 justify-center mb-8 pointer-events-auto">
            <button
              onClick={() => navigate('/multiplayer')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 hover:shadow-blue-500/25"
            >
              👥 Multiplayer
            </button>
            <button
              onClick={() => navigate('/game')}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 hover:shadow-green-500/25"
            >
              ▶️ Solo
            </button>
            <button
              onClick={() => navigate('/nft')}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 hover:shadow-purple-500/25"
            >
              💎 NFTs
            </button>
            <button
              onClick={() => navigate('/home')}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 hover:shadow-yellow-500/25"
            >
              🏠 Home
            </button>
            <button
              onClick={() => navigate('/chumbivalley')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 hover:shadow-emerald-500/25"
            >
              🌄 ChumbiValley
            </button>
          </div>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pointer-events-none">
            {[
              { value: '5', label: 'Max Jogadores', color: 'red', gradient: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30' },
              { value: '5', label: 'Personagens', color: 'blue', gradient: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
              { value: '4', label: 'Mapas', color: 'green', gradient: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30' },
              { value: '100+', label: 'NFTs', color: 'purple', gradient: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' }
            ].map((stat, index) => (
              <div key={index} className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-lg border ${stat.border} transform hover:scale-105 transition-all duration-300`}>
                <div className={`text-3xl font-bold text-${stat.color}-400`}>{stat.value}</div>
                <div className={`text-sm text-${stat.color}-300`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Indicador de Scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Seção Terra Ferida - Cena 1 */}
      <section 
        ref={setRef('terra-ferida')}
        id="terra-ferida"
        className="py-20 px-4 relative bg-gradient-to-br from-gray-900 to-red-900/20"
      >
        <div className="max-w-6xl mx-auto">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
            isVisible('terra-ferida') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}>
            <div className="space-y-6">
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                TERRA FERIDA
              </h2>
              
              <div className="bg-yellow-400 text-black p-6 rounded-3xl border-4 border-yellow-600 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <p className="text-lg font-bold">
                  "DÉCADAS APÓS A ÚLTIMA COLHEITA DE FOGO, A TERRA ESTÁ QUEBRADA. MAS NÃO MORTA."
                </p>
              </div>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                Um vale profundo coberto por fumaça esverdeada, árvores petrificadas e rios negros. 
                Uma fenda central pulsa com luz misteriosa, revelando que ainda há vida no planeta devastado.
              </p>
            </div>
            
            <div className={`relative transform transition-all duration-1000 delay-300 ${
              isVisible('terra-ferida') ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
            }`}>
              <div className="w-full h-80 bg-gradient-to-br from-green-900 via-red-900 to-black rounded-xl border-4 border-orange-500/30 overflow-hidden relative">
                {/* Simulação da imagem da Terra Ferida */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-red-900/50 to-green-900/30"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                <div className="absolute top-1/4 left-1/4 w-16 h-32 bg-gray-800 rounded-lg transform rotate-12 opacity-60"></div>
                <div className="absolute top-1/3 right-1/4 w-12 h-24 bg-gray-700 rounded-lg transform -rotate-6 opacity-70"></div>
                
                {/* Partículas flutuantes */}
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-green-400 rounded-full animate-float opacity-60"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      animationDuration: `${Math.random() * 2 + 3}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção BombRiders - Cena 2 */}
      <section 
        ref={setRef('bombriders')}
        id="bombriders"
        className="py-20 px-4 relative"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${
            isVisible('bombriders') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}>
            <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              OS BOMBRIDERS
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="relative bg-yellow-400 text-black p-6 rounded-3xl border-4 border-yellow-600 shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <p className="text-xl font-bold">
                    "SOMOS OS BOMBRIDERS. NOSSA MISSÃO É SALVAR A TERRA."
                  </p>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-400"></div>
                </div>
                
                <p className="text-lg text-gray-300 leading-relaxed">
                  Cinco guerreiros elementais unidos por um propósito: restaurar o equilíbrio do planeta. 
                  Cada BombRider domina um elemento único e possui habilidades especiais.
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-4 transition-all duration-1000 delay-500 ${
                isVisible('bombriders') ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}>
                {[
                  { name: 'Aria', element: 'Air', color: 'from-cyan-400 to-blue-500', emoji: '💨' },
                  { name: 'Bront', element: 'Earth', color: 'from-green-400 to-emerald-600', emoji: '🌍' },
                  { name: 'Kiro', element: 'Fire', color: 'from-red-400 to-orange-500', emoji: '🔥' },
                  { name: 'Lume', element: 'Ether', color: 'from-purple-400 to-pink-500', emoji: '✨' },
                ].map((rider, index) => (
                  <div 
                    key={index} 
                    className={`bg-gradient-to-br ${rider.color} p-6 rounded-xl text-center transform hover:scale-110 transition-all duration-300 cursor-pointer hover:rotate-3 shadow-lg hover:shadow-2xl`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-4xl mb-2 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>{rider.emoji}</div>
                    <h3 className="text-xl font-bold text-white">{rider.name}</h3>
                    <p className="text-sm text-white/80">{rider.element}</p>
                  </div>
                ))}
                <div className="col-span-2 bg-gradient-to-br from-indigo-400 to-blue-600 p-6 rounded-xl text-center transform hover:scale-105 transition-all duration-300 cursor-pointer hover:-rotate-1 shadow-lg hover:shadow-2xl">
                  <div className="text-4xl mb-2 animate-bounce" style={{ animationDelay: '0.8s' }}>🌊</div>
                  <h3 className="text-xl font-bold text-white">Zunn</h3>
                  <p className="text-sm text-white/80">Water</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção O Despertar - Cena 4 */}
      <section 
        ref={setRef('despertar')}
        id="despertar"
        className="py-20 px-4 bg-gradient-to-br from-blue-900/20 to-purple-900/20"
      >
        <div className="max-w-6xl mx-auto">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
            isVisible('despertar') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
          }`}>
            <div className={`relative transform transition-all duration-1000 delay-300 ${
              isVisible('despertar') ? 'scale-100 rotate-0' : 'scale-75 -rotate-12'
            }`}>
              <div className="w-full h-80 bg-gradient-to-br from-blue-900 via-purple-900 to-cyan-900 rounded-xl border-4 border-blue-500/30 overflow-hidden relative">
                {/* Simulação do ovo tecnorgânico */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-blue-900/50 to-purple-900/30"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-24 h-32 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full animate-pulse border-4 border-white/30"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                </div>
                
                {/* Energia azulada */}
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${Math.random() * 1 + 1}s`
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                O DESPERTAR
              </h2>
              
              <div className="bg-yellow-400 text-black p-6 rounded-3xl border-4 border-yellow-600 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <p className="text-lg font-bold">
                  "CRIATURAS ANTIGAS, ADORMECIDAS COM TECNOLOGIA PERDIDA… AGORA RENASCEM."
                </p>
              </div>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                Nara conecta uma Bomba-Semente ao ovo tecnorgânico. O ovo brilha, cresce e se abre 
                com vapor e energia azulada, revelando um filhote de dinossauro híbrido com olhos inteligentes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Gameplay Explosivo */}
      <section 
        ref={setRef('gameplay')}
        id="gameplay"
        className="py-20 px-4 bg-gradient-to-br from-gray-900 to-black"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${
            isVisible('gameplay') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}>
            <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              GAMEPLAY EXPLOSIVO
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: '💣', title: 'Bomba Clássica', desc: 'Explosão em cruz com timing perfeito. Destrua obstáculos e elimine inimigos com precisão estratégica.', color: 'red', animation: 'animate-bounce' },
                { icon: '⚡', title: 'Bomba Elemental', desc: 'Poderes únicos baseados nos elementos. Cada BombRider possui habilidades especiais devastadoras.', color: 'purple', animation: 'animate-pulse' },
                { icon: '🧠', title: 'Estratégia Tática', desc: 'Planejamento e antecipação de movimentos. Domine o campo de batalha com inteligência e timing.', color: 'green', animation: 'animate-spin' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`bg-gradient-to-br from-${item.color}-500/20 to-${item.color === 'red' ? 'orange' : item.color === 'purple' ? 'blue' : 'emerald'}-500/20 p-8 rounded-xl border border-${item.color}-500/30 transform hover:scale-105 transition-all duration-500 hover:rotate-1`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`text-6xl mb-4 ${item.animation}`}>{item.icon}</div>
                  <h3 className={`text-2xl font-bold mb-4 text-${item.color}-400`}>{item.title}</h3>
                  <p className="text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seção Dinossauros Tecnológicos */}
      <section 
        ref={setRef('dinossauros')}
        id="dinossauros"
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${
            isVisible('dinossauros') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}>
            <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              DINOSSAUROS TECNOLÓGICOS
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-yellow-400 text-black p-6 rounded-3xl border-4 border-yellow-600 shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <p className="text-lg font-bold">
                    "DINOSSAUROS TECNOLÓGICOS, ENCONTRADOS PELO MUNDO, SÃO NOSSOS ALIADOS."
                  </p>
                </div>
                
                <p className="text-lg text-gray-300 leading-relaxed">
                  Criaturas antigas ressuscitadas com tecnologia avançada. Cada dinossauro possui 
                  habilidades únicas e pode ser seu companheiro na jornada para salvar a Terra.
                </p>
              </div>
              
              <div className={`grid grid-cols-2 gap-4 transition-all duration-1000 delay-500 ${
                isVisible('dinossauros') ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}>
                {[
                  { type: 'Aquático', emoji: '🦕', color: 'from-blue-400 to-cyan-500' },
                  { type: 'Terrestre', emoji: '🦖', color: 'from-green-400 to-emerald-500' },
                  { type: 'Voador', emoji: '🦅', color: 'from-purple-400 to-pink-500' },
                  { type: 'Híbrido', emoji: '🤖', color: 'from-orange-400 to-red-500' },
                ].map((dino, index) => (
                  <div 
                    key={index} 
                    className={`bg-gradient-to-br ${dino.color} p-6 rounded-xl text-center transform hover:scale-110 transition-all duration-300 cursor-pointer hover:rotate-6 shadow-lg hover:shadow-2xl`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-4xl mb-2 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>{dino.emoji}</div>
                    <h3 className="text-lg font-bold text-white">{dino.type}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção NFTs */}
      <section 
        ref={setRef('nfts')}
        id="nfts"
        className="py-20 px-4 bg-gradient-to-br from-purple-900 to-black"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${
            isVisible('nfts') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}>
            <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              NFTs ÚNICOS
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: 'Ovos de Dino', emoji: '🥚', color: 'from-orange-400 to-red-500', rarity: 'Épico' },
                { name: 'Skins de Rider', emoji: '👤', color: 'from-blue-400 to-purple-500', rarity: 'Raro' },
                { name: 'Cristais de Poder', emoji: '💎', color: 'from-purple-400 to-pink-500', rarity: 'Lendário' },
                { name: 'Artefatos', emoji: '🏺', color: 'from-green-400 to-emerald-500', rarity: 'Mítico' },
              ].map((nft, index) => (
                <div 
                  key={index} 
                  className={`bg-gradient-to-br ${nft.color} p-6 rounded-xl text-center transform hover:scale-110 transition-all duration-500 cursor-pointer hover:rotate-3 shadow-lg hover:shadow-2xl`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-5xl mb-4 animate-pulse" style={{ animationDelay: `${index * 0.2}s` }}>{nft.emoji}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{nft.name}</h3>
                  <span className="inline-block bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                    {nft.rarity}
                  </span>
                </div>
              ))}
            </div>
            
            <p className="text-lg text-gray-300 mt-8 max-w-3xl mx-auto">
              Colecione NFTs únicos que oferecem vantagens no jogo. Cada item possui atributos especiais 
              e pode ser negociado no marketplace descentralizado.
            </p>
          </div>
        </div>
      </section>

      {/* Seção Final */}
      <section 
        ref={setRef('final')}
        id="final"
        className="py-20 px-4 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${
            isVisible('final') ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}>
            <h2 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              ERA DOS BOMBRIDERS
              <span className="text-6xl animate-pulse ml-4">💥</span>
            </h2>
            
            <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
              PREPARE-SE PARA AVENTURA GLOBAL CHEIA DE AÇÃO E ESTRATÉGIA!<br />
              <span className="text-yellow-400 font-bold">EM BREVE.</span>
            </p>
            
            <div className="flex flex-wrap gap-6 justify-center">
              <button
                onClick={() => navigate('/game')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 hover:shadow-green-500/25"
              >
                🚀 Começar Aventura
              </button>
              <button
                onClick={() => navigate('/nft')}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 hover:shadow-purple-500/25"
              >
                💎 Explorar NFTs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Estilos CSS customizados */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;

