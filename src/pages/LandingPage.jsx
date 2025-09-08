import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/header.css';

function LandingPage() {
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

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* Seção Hero com Animação 3D Interativa */}
      <section className="relative h-screen flex items-center justify-center">
        {/* Conteúdo sobreposto */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
          <div className="text-center mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-teal-500 bg-clip-text text-transparent animate-pulse">
              MANGUE RIDERS
            </h1>
            <div className="bg-green-400 text-black p-6 rounded-lg border-4 border-green-600 shadow-2xl max-w-4xl mx-4 transform hover:scale-105 transition-all duration-300">
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

      {/* Seção Mangue Poluído - Cena 1 */}
      <section
        ref={setRef('mangue-poluido')}
        id="mangue-poluido"
        className="py-20 px-4 relative bg-gradient-to-br from-gray-900 to-green-900/20"
      >
        <div className="max-w-6xl mx-auto">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${isVisible('mangue-poluido') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}>
            <div className="space-y-6">
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                MANGUE POLUÍDO
              </h2>

              <div className="bg-green-400 text-black p-6 rounded-3xl border-4 border-green-600 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <p className="text-lg font-bold">
                  "O MANGUEZAL DE RECIFE ESTÁ SENDO DESTRUÍDO PELA POLUIÇÃO. MAS AINDA HÁ ESPERANÇA."
                </p>
              </div>

              <p className="text-lg text-gray-300 leading-relaxed">
                Um ecossistema único ameaçado por lixo industrial e plástico. Árvores de mangue sufocadas, 
                água contaminada e vida marinha em perigo. De Recife Antigo às praias paradisíacas, 
                a luta pela preservação começa agora. Explore locais icônicos como o Porto de Recife, 
                as ilhas do manguezal e as comunidades ribeirinhas que dependem deste habitat.
              </p>
            </div>

            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible('mangue-poluido') ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
              }`}>
              <div className="w-full h-80 bg-gradient-to-br from-green-900 via-blue-900 to-teal-900 rounded-xl border-4 border-green-500/30 overflow-hidden relative">
                {/* Simulação da imagem do Mangue Poluído */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-green-900/50 to-blue-900/30"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute top-1/4 left-1/4 w-16 h-32 bg-gray-800 rounded-lg transform rotate-12 opacity-60"></div>
                <div className="absolute top-1/3 right-1/4 w-12 h-24 bg-gray-700 rounded-lg transform -rotate-6 opacity-70"></div>

                {/* Lixo flutuante */}
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-red-400 rounded-full animate-float opacity-60"
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

      {/* Seção O Encontro - Cena 4 */}
      <section
        ref={setRef('encontro')}
        id="encontro"
        className="py-20 px-4 bg-gradient-to-br from-blue-900/20 to-teal-900/20"
      >
        <div className="max-w-6xl mx-auto">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${isVisible('encontro') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
            }`}>
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible('encontro') ? 'scale-100 rotate-0' : 'scale-75 -rotate-12'
              }`}>
              <div className="w-full h-80 bg-gradient-to-br from-green-900 via-blue-900 to-teal-900 rounded-xl border-4 border-green-500/30 overflow-hidden relative">
                {/* Simulação do crab mágico */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-green-900/50 to-blue-900/30"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-24 h-32 bg-gradient-to-br from-green-400 to-blue-600 rounded-full animate-pulse border-4 border-white/30"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                </div>

                {/* Energia azulada */}
                {[...Array(15)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-green-400 rounded-full animate-ping"
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
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                O ENCONTRO
              </h2>

              <div className="bg-green-400 text-black p-6 rounded-3xl border-4 border-green-600 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <p className="text-lg font-bold">
                  "CRABS MÁGICOS, GUARDIÕES DO MANGUE… AGORA NOS AJUDAM NA LIMPEZA."
                </p>
              </div>

              <p className="text-lg text-gray-300 leading-relaxed">
                Manguito encontra crabs misteriosos escondidos no manguezal. Cada crab possui poderes únicos
                e recompensas especiais em CrabCoin, ajudando na missão de limpeza de Recife.
                Explore os segredos escondidos nas raízes antigas e nas águas cristalinas do mangue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Limpeza Ambiental */}
      <section
        ref={setRef('limpeza')}
        id="limpeza"
        className="py-20 px-4 bg-gradient-to-br from-gray-900 to-black"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible('limpeza') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}>
            <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              LIMPEZA AMBIENTAL
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: '�️', title: 'Coleta de Lixo', desc: 'Use aspirador ou rede para coletar latinhas, garrafas e lixo tóxico. Ganhe CrabCoin por cada item.', color: 'green', animation: 'animate-bounce' },
                { icon: '🦀', title: 'Encontro com Crabs', desc: 'Descubra crabs raros escondidos no mangue. Cada um dá recompensas especiais em moedas.', color: 'blue', animation: 'animate-pulse' },
                { icon: '🌿', title: 'Preservação', desc: 'Restaure o ecossistema de Recife. Cada área limpa desbloqueia novos desafios ambientais.', color: 'teal', animation: 'animate-spin' }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br from-${item.color}-500/20 to-${item.color === 'green' ? 'emerald' : item.color === 'blue' ? 'cyan' : 'blue'}-500/20 p-8 rounded-xl border border-${item.color}-500/30 transform hover:scale-105 transition-all duration-500 hover:rotate-1`}
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

      {/* Seção Crabs do Mangue */}
      <section
        ref={setRef('crabs')}
        id="crabs"
        className="py-20 px-4"
      >
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible('crabs') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`}>
            <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              CRABS DO MANGUE
            </h2>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="bg-green-400 text-black p-6 rounded-3xl border-4 border-green-600 shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <p className="text-lg font-bold">
                    "CRABS MÁGICOS, GUARDIÕES DO MANGUEZAL DE RECIFE."
                  </p>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed">
                  Criaturas especiais encontradas no mangue. Cada crab possui habilidades únicas e recompensas em CrabCoin,
                  ajudando Manguito na missão de limpeza e preservação ambiental. Descubra os guardiões míticos de Recife!
                </p>
              </div>

              <div className={`grid grid-cols-2 gap-4 transition-all duration-1000 delay-500 ${isVisible('crabs') ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}>
                {[
                  { type: 'Comum', emoji: '�', color: 'from-green-400 to-blue-500' },
                  { type: 'Dourado', emoji: '�', color: 'from-yellow-400 to-orange-500' },
                  { type: 'Rei', emoji: '👑', color: 'from-purple-400 to-pink-500' },
                  { type: 'Místico', emoji: '✨', color: 'from-blue-400 to-teal-500' },
                ].map((crab, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${crab.color} p-6 rounded-xl text-center transform hover:scale-110 transition-all duration-300 cursor-pointer hover:rotate-6 shadow-lg hover:shadow-2xl`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="text-4xl mb-2 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>{crab.emoji}</div>
                    <h3 className="text-lg font-bold text-white">{crab.type}</h3>
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
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;

