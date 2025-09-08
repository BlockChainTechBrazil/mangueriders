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
