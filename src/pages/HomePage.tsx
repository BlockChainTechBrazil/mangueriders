import React, { useEffect, useRef } from 'react';
import { motion, animate, stagger } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ParallaxProvider } from 'react-scroll-parallax';
import HeroWave from '@/components/HeroWave';

const heroTitle = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
};

const sectionAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctaRef.current) return;
    animate(ctaRef.current.querySelectorAll('.explosion'), {
      scale: [0.8, 1.2, 1],
      opacity: [0.7, 1, 0.8],
      easing: 'easeInOutSine',
      duration: 1800,
      loop: true,
      delay: stagger(200),
    });
  }, []);

  const navigationButtons = [
    { path: '/game', label: 'Modo Solo', icon: '▶️', bg: 'from-green-500 to-blue-600' },
    { path: '/multiplayer', label: 'Multiplayer', icon: '👥', bg: 'from-blue-500 to-purple-600' },
    { path: '/nft', label: 'NFTs', icon: '💎', bg: 'from-purple-500 to-pink-600' },
  ];

  return (
    <ParallaxProvider>
      <div className="pt-16">
        {/* HERO */}
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center bg-gradient-to-b from-cyan-900 via-gray-900 to-black overflow-hidden">
          <HeroWave />
          <motion.div className="z-10 text-center relative" variants={heroTitle} initial="hidden" animate="visible">
            <motion.h1
              className="text-4xl md:text-7xl font-extrabold text-center mb-6"
              style={{ textShadow: '0 0 10px rgba(0,255,255,0.5), 0 0 20px rgba(0,255,255,0.3)' }}
            >
              <motion.div className="mb-2" animate={{
                textShadow: [
                  '0 0 10px rgba(0,255,255,0.5)',
                  '0 0 20px rgba(0,255,255,0.8)',
                  '0 0 10px rgba(0,255,255,0.5)'
                ]
              }} transition={{ duration: 2, repeat: Infinity }}>
                Entre na Era dos
              </motion.div>
              <motion.span
                className="bg-clip-text text-transparent bg-gradient-to-b from-yellow-300 to-yellow-600 inline-block"
                style={{ fontSize: '120%' }}
                animate={{ rotateX: [10, 5, 10] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                MangueRiders
              </motion.span>
            </motion.h1>
          </motion.div>

          <motion.p className="z-10 text-lg md:text-2xl text-cyan-100 text-center max-w-2xl mb-8" variants={sectionAnim} initial="hidden" animate="visible">
            Um arcade moderno com dinossauros tecnológicos, bombas e ação rápida.
          </motion.p>

          {/* Navegação */}
          <motion.div className="z-10 flex flex-wrap gap-4 md:gap-6 justify-center mb-8" variants={sectionAnim} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            {navigationButtons.map((b) => (
              <motion.button
                key={b.path}
                onClick={() => navigate(b.path)}
                className={`px-6 py-4 bg-gradient-to-r ${b.bg} text-white font-bold rounded-full shadow-lg flex items-center gap-2`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl">{b.icon}</span>
                <span>{b.label}</span>
              </motion.button>
            ))}
          </motion.div>

          <motion.button
            onClick={() => navigate('/game')}
            className="z-10 px-8 py-4 bg-yellow-400 text-gray-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition text-xl"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            Começar Missão
          </motion.button>

          {/* Decoração sutil */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute left-1/4 top-1/3 w-32 h-32 rounded-full bg-cyan-400 opacity-20 blur-2xl animate-pulse" />
            <div className="absolute right-1/4 bottom-1/4 w-40 h-40 rounded-full bg-yellow-400 opacity-10 blur-2xl animate-pulse" />
          </div>
        </section>

        {/* Link para Sobre */}
        <section className="py-12 bg-gradient-to-b from-gray-900 to-cyan-950 text-center">
          <h3 className="text-2xl font-bold text-yellow-400 mb-3">Quer saber mais?</h3>
          <p className="text-cyan-200 mb-6">História, personagens, mapas e tecnologia agora estão na página Sobre.</p>
          <button onClick={() => navigate('/sobre')} className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold rounded-lg transition">Ir para Sobre</button>
        </section>

        {/* CTA FINAL */}
        <section ref={ctaRef} className="relative py-24 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-400/20 via-cyan-900 to-black overflow-hidden">
          <svg className="absolute explosion left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" width="400" height="400" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="120" fill="#facc15" />
            <circle cx="200" cy="200" r="80" fill="#22d3ee" />
            <circle cx="200" cy="200" r="40" fill="#fff" />
          </svg>
          <motion.h2 className="z-10 text-3xl md:text-5xl font-extrabold text-yellow-400 mb-6 text-center drop-shadow-lg" variants={sectionAnim} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Você está pronto para a missão?
          </motion.h2>
          <motion.button className="z-10 px-10 py-4 bg-cyan-400 text-gray-900 font-bold rounded-full shadow-lg hover:bg-cyan-300 transition text-2xl mb-4" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
            Inscreva-se
          </motion.button>
        </section>

        {/* Footer */}
        <footer className="py-8 bg-gradient-to-t from-black to-cyan-950 text-cyan-200 flex flex-col items-center">
          <div className="flex gap-6 mb-2">
            <a href="#" className="hover:text-yellow-400 transition">Discord</a>
            <a href="#" className="hover:text-yellow-400 transition">Twitter</a>
            <a href="#" className="hover:text-yellow-400 transition">Twitch</a>
          </div>
          <p className="text-sm">© 2025 BlockChain Tech Brazil. Todos os direitos reservados.</p>
        </footer>
      </div>
    </ParallaxProvider>
  );
};

export default HomePage;
