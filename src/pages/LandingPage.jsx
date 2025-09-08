import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Footer from '../components/Footer.jsx';

function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState(Math.floor(Math.random() * 500) + 1500);

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

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* Seção Hero com Vídeo de Fundo */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Vídeo de Fundo */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/MangueRecife.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos.
        </video>

        {/* Overlay escuro para melhor legibilidade */}
        <div className="absolute inset-0 bg-black/50 z-5"></div>

        {/* GIF do CrabToken girando */}
        <div className="absolute top-8 z-10">
          <img
            src="/crabtoken.gif"
            alt="CrabCoin Token"
            className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-2xl hover:scale-110 transition-transform duration-300 coin-spin"
            style={{ backfaceVisibility: 'visible' }}
            onError={(e) => {
              console.log('Erro ao carregar crabToken.gif');
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
        </div>

        {/* Conteúdo sobreposto */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="text-center mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-teal-500 bg-clip-text text-transparent animate-pulse drop-shadow-lg">
              MANGUE RIDERS
            </h1>

            <div className="bg-green-400/90 backdrop-blur-sm text-black p-6 rounded-lg border-4 border-green-600 shadow-2xl max-w-4xl mx-4 transform hover:scale-105 transition-all duration-300">
              <p className="text-lg md:text-xl font-bold leading-relaxed">
                EM RECIFE, O MANGUE ESTÁ SENDO POLUÍDO POR EMPRESÁRIOS GANANCIOSOS. MAS NÃO ESTÁ PERDIDO.
                OS MANGUE RIDERS SURGEM COMO A ÚLTIMA ESPERANÇA DA NATUREZA. JUNTE-SE A MANGUITO NA LUTA PARA SALVAR O MANGUEZAL!
                <br /><br />
                <span className="text-sm">🏖️ De Recife Antigo às praias paradisíacas, a preservação começa agora!</span>
              </p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pointer-events-none">
            {[
              { value: '5', label: 'Max Jogadores', color: 'red', gradient: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30' },
              { value: '5', label: 'Personagens', color: 'blue', gradient: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
              { value: '4', label: 'Mapas', color: 'green', gradient: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30' },
              { value: '100+', label: 'NFTs', color: 'purple', gradient: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' }
            ].map((stat, index) => (
              <div key={index} className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-sm p-4 rounded-lg border ${stat.border} transform hover:scale-105 transition-all duration-300`}>
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

      {/* Seção MangueRiders - Cena 2 */}
      <section
        ref={setRef('mangueriders')}
        id="mangueriders"
        className="py-20 px-4 relative"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible('mangueriders') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}>
            <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              OS MANGUE RIDERS
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="relative bg-green-400 text-black p-6 rounded-3xl border-4 border-green-600 shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <p className="text-xl font-bold">
                    "SOMOS OS MANGUE RIDERS. NOSSA MISSÃO É SALVAR O MANGUE DE RECIFE."
                  </p>
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-green-400"></div>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed">
                  Heróis ambientais unidos por um propósito: limpar o manguezal de Recife.
                  Manguito, com seu aspirador high-tech, lidera a luta contra a poluição.
                  Junte-se a ele nas ruas históricas de Recife Antigo, nas praias de Boa Viagem
                  e nos canais do manguezal para restaurar a beleza natural da cidade.
                </p>
              </div>

              <div className={`grid grid-cols-2 gap-4 transition-all duration-1000 delay-500 ${isVisible('mangueriders') ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}>
                {[
                  { name: 'Manguito', element: 'Limpador', color: 'from-green-400 to-blue-500', emoji: '🦀' },
                  { name: 'Crab Rei', element: 'Guardião', color: 'from-blue-400 to-teal-600', emoji: '👑' },
                  { name: 'Aspirador', element: 'Ferramenta', color: 'from-purple-400 to-pink-500', emoji: '�' },
                  { name: 'Recife', element: 'Lar', color: 'from-yellow-400 to-orange-500', emoji: '🏖️' },
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
          <div className={`transition-all duration-1000 ${isVisible('nfts') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}>
            <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              NFTs ÚNICOS
            </h2>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: 'Crab Comum', emoji: '�', color: 'from-green-400 to-blue-500', rarity: 'Comum' },
                { name: 'Crab Dourado', emoji: '🦞', color: 'from-yellow-400 to-orange-500', rarity: 'Raro' },
                { name: 'Crab Rei', emoji: '�', color: 'from-purple-400 to-pink-500', rarity: 'Épico' },
                { name: 'Artefatos', emoji: '🏺', color: 'from-teal-400 to-cyan-500', rarity: 'Lendário' },
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
              e pode ser negociado no marketplace descentralizado. Apoie a preservação do mangue de Recife!
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
          <div className={`transition-all duration-1000 ${isVisible('final') ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
            <h2 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              ERA DOS MANGUE RIDERS
              <span className="text-6xl animate-pulse ml-4">💥</span>
            </h2>

            <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
              PREPARE-SE PARA AVENTURA GLOBAL CHEIA DE AÇÃO E ESTRATÉGIA!<br />
              <span className="text-yellow-400 font-bold">SALVE RECIFE, SALVE O MANGUE!</span>
            </p>

            <div className="flex flex-wrap gap-6 justify-center">
              <button
                onClick={() => navigate('/game')}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 hover:shadow-green-500/25"
              >
                🚀 Começar Aventura em Recife
              </button>
              <button
                onClick={() => navigate('/nft')}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 hover:shadow-purple-500/25"
              >
                💎 Explorar NFTs de Recife
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

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>

    </div>
  );
}

export default LandingPage;

