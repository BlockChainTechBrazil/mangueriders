import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const sectionAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const SobrePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="pt-24 pb-20 bg-gradient-to-b from-black via-cyan-950/30 to-gray-900 text-cyan-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-yellow-400 text-center mb-10"
          variants={sectionAnim}
          initial="hidden"
          animate="visible"
        >
          Sobre o MangueRiders
        </motion.h1>

        <motion.section
          className="bg-black/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6 md:p-8 mb-8"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-cyan-300 mb-3">Nossa História</h2>
          <p className="text-cyan-100 leading-relaxed">
            Em Recife, o mangue está sendo poluído por empresários gananciosos. Manguito surge como herói para limpar o ambiente.
            despertar dinossauros biomecânicos e restaurar o equilíbrio da Terra. O projeto mistura
            aventura arcade com elementos modernos, criando uma experiência acessível e vibrante.
          </p>
        </motion.section>

        {/* Seção Mangue Poluído */}
        <motion.section
          className="bg-black/50 backdrop-blur-sm rounded-xl border border-red-500/20 p-6 md:p-8 mb-8"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            MANGUE POLUÍDO
          </h2>

          <div className="bg-green-400 text-black p-4 rounded-xl border-2 border-green-600 shadow-lg mb-4">
            <p className="text-lg font-bold">
              "O MANGUEZAL DE RECIFE ESTÁ SENDO DESTRUÍDO PELA POLUIÇÃO. MAS AINDA HÁ ESPERANÇA."
            </p>
          </div>

          <p className="text-cyan-100 leading-relaxed mb-4">
            Um ecossistema único ameaçado por lixo industrial e plástico. Árvores de mangue sufocadas,
            água contaminada e vida marinha em perigo. De Recife Antigo às praias paradisíacas,
            a luta pela preservação começa agora. Explore locais icônicos como o Porto de Recife,
            as ilhas do manguezal e as comunidades ribeirinhas que dependem deste habitat.
          </p>

          <div className="w-full h-48 bg-gradient-to-br from-green-900 via-blue-900 to-teal-900 rounded-xl border-2 border-green-500/30 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-green-900/50 to-blue-900/30"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
            <div className="absolute top-1/4 left-1/4 w-12 h-24 bg-gray-800 rounded-lg transform rotate-12 opacity-60"></div>
            <div className="absolute top-1/3 right-1/4 w-10 h-20 bg-gray-700 rounded-lg transform -rotate-6 opacity-70"></div>
          </div>
        </motion.section>

        {/* Seção O Encontro */}
        <motion.section
          className="bg-black/50 backdrop-blur-sm rounded-xl border border-blue-500/20 p-6 md:p-8 mb-8"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            O ENCONTRO
          </h2>

          <div className="bg-green-400 text-black p-4 rounded-xl border-2 border-green-600 shadow-lg mb-4">
            <p className="text-lg font-bold">
              "CRABS MÁGICOS, GUARDIÕES DO MANGUE… AGORA NOS AJUDAM NA LIMPEZA."
            </p>
          </div>

          <p className="text-cyan-100 leading-relaxed mb-4">
            Manguito encontra crabs misteriosos escondidos no manguezal. Cada crab possui poderes únicos
            e recompensas especiais em CrabCoin, ajudando na missão de limpeza de Recife.
            Explore os segredos escondidos nas raízes antigas e nas águas cristalinas do mangue.
          </p>

          <div className="w-full h-48 bg-gradient-to-br from-green-900 via-blue-900 to-teal-900 rounded-xl border-2 border-green-500/30 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-green-900/50 to-blue-900/30"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-20 h-24 bg-gradient-to-br from-green-400 to-blue-600 rounded-full animate-pulse border-2 border-white/30"></div>
            </div>
          </div>
        </motion.section>

        {/* Seção Crabs do Mangue */}
        <motion.section
          className="bg-black/50 backdrop-blur-sm rounded-xl border border-green-500/20 p-6 md:p-8 mb-8"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            CRABS DO MANGUE
          </h2>

          <div className="bg-green-400 text-black p-4 rounded-xl border-2 border-green-600 shadow-lg mb-4">
            <p className="text-lg font-bold">
              "CRABS MÁGICOS, GUARDIÕES DO MANGUEZAL DE RECIFE."
            </p>
          </div>

          <p className="text-cyan-100 leading-relaxed mb-6">
            Criaturas especiais encontradas no mangue. Cada crab possui habilidades únicas e recompensas em CrabCoin,
            ajudando Manguito na missão de limpeza e preservação ambiental. Descubra os guardiões míticos de Recife!
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { type: 'Comum', emoji: '🦀', color: 'from-green-400 to-blue-500' },
              { type: 'Dourado', emoji: '🦞', color: 'from-yellow-400 to-orange-500' },
              { type: 'Rei', emoji: '👑', color: 'from-purple-400 to-pink-500' },
              { type: 'Místico', emoji: '✨', color: 'from-blue-400 to-teal-500' },
            ].map((crab, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${crab.color} p-4 rounded-xl text-center transform hover:scale-105 transition-all duration-300 cursor-pointer hover:rotate-6 shadow-lg hover:shadow-2xl`}
              >
                <div className="text-3xl mb-2 animate-bounce">{crab.emoji}</div>
                <h3 className="text-lg font-bold text-white">{crab.type}</h3>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Seção NFTs Únicos */}
        <motion.section
          className="bg-black/50 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 md:p-8 mb-8"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            NFTs ÚNICOS
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { name: 'Crab Comum', emoji: '🦀', color: 'from-green-400 to-blue-500', rarity: 'Comum' },
              { name: 'Crab Dourado', emoji: '🦞', color: 'from-yellow-400 to-orange-500', rarity: 'Raro' },
              { name: 'Crab Rei', emoji: '👑', color: 'from-purple-400 to-pink-500', rarity: 'Épico' },
              { name: 'Artefatos', emoji: '🏺', color: 'from-teal-400 to-cyan-500', rarity: 'Lendário' },
            ].map((nft, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${nft.color} p-4 rounded-xl text-center transform hover:scale-105 transition-all duration-300 cursor-pointer hover:rotate-3 shadow-lg hover:shadow-2xl`}
              >
                <div className="text-4xl mb-2 animate-pulse">{nft.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-2">{nft.name}</h3>
                <span className="inline-block bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                  {nft.rarity}
                </span>
              </div>
            ))}
          </div>

          <p className="text-cyan-100 leading-relaxed">
            Colecione NFTs únicos que oferecem vantagens no jogo. Cada item possui atributos especiais
            e pode ser negociado no marketplace descentralizado. Apoie a preservação do mangue de Recife!
          </p>
        </motion.section>

        <motion.section
          className="bg-black/50 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-6 md:p-8 mb-8"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-yellow-300 mb-3">Missão e Visão</h2>
          <ul className="list-disc pl-6 space-y-2 text-cyan-100">
            <li>Trazer diversão rápida e intuitiva com forte identidade visual.</li>
            <li>Construir um universo expansível por capítulos e eventos.</li>
            <li>Oferecer integração opcional com blockchain e NFTs, sem obrigatoriedade.</li>
          </ul>
        </motion.section>

        <motion.section
          className="bg-black/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6 md:p-8 mb-8"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-cyan-300 mb-4">Tecnologias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-cyan-900/20 border border-cyan-500/20 p-4 rounded-lg">
              <h3 className="text-cyan-200 font-semibold">Frontend</h3>
              <p className="text-sm">React, Vite, TypeScript, Tailwind</p>
            </div>
            <div className="bg-purple-900/20 border border-purple-500/20 p-4 rounded-lg">
              <h3 className="text-purple-200 font-semibold">Gráficos</h3>
              <p className="text-sm">React Three Fiber (Three.js)</p>
            </div>
            <div className="bg-orange-900/20 border border-orange-500/20 p-4 rounded-lg">
              <h3 className="text-orange-200 font-semibold">Backend</h3>
              <p className="text-sm">Firebase, WebSockets</p>
            </div>
            <div className="bg-green-900/20 border border-green-500/20 p-4 rounded-lg">
              <h3 className="text-green-200 font-semibold">Blockchain</h3>
              <p className="text-sm">MetaMask, NFTs dinâmicos (opcional)</p>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="bg-black/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6 md:p-8 mb-10"
          variants={sectionAnim}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-cyan-300 mb-3">Equipe</h2>
          <p className="text-cyan-100 mb-4">
            Projeto indie em evolução. Se você curte jogos, arte 3D, música ou dev, bora construir
            esse mundo juntos.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/multiplayer')}
              className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg transition"
            >
              Entrar no Multiplayer
            </button>
            <button
              onClick={() => navigate('/nft')}
              className="px-5 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-semibold rounded-lg transition"
            >
              Ver NFTs (opcional)
            </button>
          </div>
        </motion.section>

        <div className="text-center">
          <button
            onClick={() => navigate('/game')}
            className="px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition"
          >
            Jogar Agora
          </button>
        </div>
      </div>
    </main>
  );
};

export default SobrePage;
