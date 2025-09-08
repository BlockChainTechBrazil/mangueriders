import React from 'react';
import { motion } from 'framer-motion';
import { useImages } from '../hooks/useImages';

const carnivalColors = [
  '#00BCD4', // azul
  '#4CAF50', // verde
  '#FF5722', // laranja
  '#9C27B0', // roxo
];

const sectionStyle = (i: number) => ({
  background: `linear-gradient(90deg, ${carnivalColors[i % carnivalColors.length]}22 0%, #fff 100%)`,
  borderRadius: '1.5rem',
  margin: '2rem 0',
  padding: '2.5rem 1.5rem',
  boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
});

export default function AvalancheGaya() {
  const images = useImages();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 flex flex-col items-center">
      {/* HERO */}
      <section className="w-full max-w-5xl flex flex-col items-center justify-center py-16" style={{ position: 'relative' }}>        <motion.img
        src={images.nft.gcoin}
        alt="Logo Gaya"
        className="w-64 h-64 mb-6 drop-shadow-xl"
        animate={{
          rotateY: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{
          rotateY: { repeat: Infinity, duration: 12, ease: 'linear' },
          scale: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
        }}
      />
        <motion.h1
          className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-blue-500 drop-shadow-lg text-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          GAYA
        </motion.h1>
        <motion.h1
          className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-blue-500 drop-shadow-lg text-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          A Memecoin de Pernambuco

        </motion.h1>
        <motion.p
          className="mt-6 text-2xl text-gray-800 max-w-2xl text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          A primeira criptomoeda inspirada na alegria, irreverência e diversidade do Carnaval de Recife. Junte-se à folia cripto!
        </motion.p>
        <div className="mt-8 flex gap-4">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-primary text-primary-foreground shadow-xs hover:bg-primary/90" onClick={() => window.open('https://t.me/gayacoin', '_blank')}>Telegram</button>
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" onClick={() => window.open('https://twitter.com/gayacoin', '_blank')}>Twitter</button>
        </div>
      </section>

      {/* POR QUE GAYA */}
      <section className="w-full max-w-4xl" style={sectionStyle(0)}>
        <h2 className="text-3xl font-bold mb-4 text-pink-600">Por que Gaya?</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <li className="flex flex-col items-center">
            <span className="text-5xl mb-2">🎉</span>
            <span className="font-semibold">Comunitária</span>
            <p className="text-center text-gray-700">Gaya é feita pela comunidade, para a comunidade. Participe, vote e decida os rumos do projeto!</p>
          </li>
          <li className="flex flex-col items-center">
            <span className="text-5xl mb-2">⚡</span>
            <span className="font-semibold">Rápida e Acessível</span>
            <p className="text-center text-gray-700">Transações instantâneas e taxas baixíssimas, para ninguém ficar de fora da festa.</p>
          </li>
          <li className="flex flex-col items-center">
            <span className="text-5xl mb-2">🎭</span>
            <span className="font-semibold">Carnaval o Ano Todo</span>
            <p className="text-center text-gray-700">Eventos, NFTs, recompensas e muita diversão para a comunidade mais animada do Brasil.</p>
          </li>
        </ul>
      </section>

      {/* TOKEN GAYA */}
      <section className="w-full max-w-4xl" style={sectionStyle(1)}>
        <h2 className="text-3xl font-bold mb-4 text-yellow-600">O Token GAYA</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1">
            <p className="text-lg text-gray-800 mb-2">O token GAYA é o coração da folia! Ele movimenta a economia do ecossistema, garante recompensas e dá acesso a experiências exclusivas.</p>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Governança descentralizada</li>
              <li>Recompensas para holders</li>
              <li>Utilidade em eventos e NFTs</li>
              <li>Distribuição justa e transparente</li>
            </ul>
          </div>          <div className="flex-1 flex flex-col items-center">            <motion.img
            src={images.nft.gaiaCoin}
            alt="Logo Gaya"
            className="w-88 h-76 mb-6 drop-shadow-xl"
            animate={{
              rotateY: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotateY: { repeat: Infinity, duration: 12, ease: 'linear' },
              scale: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
            }}
          />
            <button className="mt-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-primary text-primary-foreground shadow-xs hover:bg-primary/90">Comprar GAYA</button>
          </div>
        </div>
      </section>

      {/* ECOSSISTEMA */}
      <section className="w-full max-w-4xl" style={sectionStyle(2)}>
        <h2 className="text-3xl font-bold mb-4 text-blue-600">Ecossistema Gaya</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-2">🪅</span>
            <span className="font-semibold">NFTs Temáticos</span>
            <p className="text-center text-gray-700">Colecione, troque e use NFTs exclusivos inspirados no Carnaval e na cultura recifense.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-2">🕺</span>
            <span className="font-semibold">Eventos e Competições</span>
            <p className="text-center text-gray-700">Participe de desafios, festas virtuais e ganhe prêmios em GAYA.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-5xl mb-2">🤝</span>
            <span className="font-semibold">Parcerias Locais</span>
            <p className="text-center text-gray-700">Apoio a projetos culturais e sociais de Recife, promovendo impacto real.</p>
          </div>
        </div>
      </section>

      {/* COMUNIDADE */}
      <section className="w-full max-w-4xl" style={sectionStyle(3)}>
        <h2 className="text-3xl font-bold mb-4 text-green-600">Comunidade</h2>
        <p className="text-lg text-gray-800 mb-6 text-center">Entre para a comunidade mais animada do mercado cripto! Siga, compartilhe e participe:</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-primary text-primary-foreground shadow-xs hover:bg-primary/90" onClick={() => window.open('https://t.me/gayacoin', '_blank')}>Telegram</button>
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" onClick={() => window.open('https://twitter.com/gayacoin', '_blank')}>Twitter</button>
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" onClick={() => window.open('https://discord.gg/', '_blank')}>Discord</button>
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" onClick={() => window.open('#', '_blank')}>Instagram</button>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="w-full max-w-4xl" style={sectionStyle(4)}>
        <h2 className="text-3xl font-bold mb-4 text-orange-600">Roadmap</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">🚀</span>
            <span className="font-semibold">Lançamento</span>
            <p className="text-center text-gray-700">Token GAYA lançado e comunidade formada.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">🎨</span>
            <span className="font-semibold">NFTs & Arte</span>
            <p className="text-center text-gray-700">Coleções de NFTs carnavalescos e marketplace.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">🏆</span>
            <span className="font-semibold">Eventos</span>
            <p className="text-center text-gray-700">Competições, festas e premiações para holders.</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl mb-2">🌎</span>
            <span className="font-semibold">Expansão</span>
            <p className="text-center text-gray-700">Parcerias, integrações e impacto social em Recife.</p>
          </div>
        </div>
      </section>

      {/* DESENVOLVEDORES */}
      <section className="w-full max-w-4xl" style={sectionStyle(5)}>
        <h2 className="text-3xl font-bold mb-4 text-purple-600">Desenvolvedores</h2>
        <p className="text-lg text-gray-800 mb-4">Quer construir na Gaya? Junte-se ao nosso movimento open source, contribua com ideias, código e ajude a criar a folia cripto!</p>
        <div className="flex flex-wrap gap-4">
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" onClick={() => window.open('#', '_blank')}>Documentação</button>
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" onClick={() => window.open('#', '_blank')}>GitHub</button>
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground" onClick={() => window.open('#', '_blank')}>Hackathons</button>
        </div>
      </section>

      {/* NOTÍCIAS & EVENTOS */}
      <section className="w-full max-w-4xl mb-12" style={sectionStyle(0)}>
        <h2 className="text-3xl font-bold mb-4 text-pink-600">Notícias & Eventos</h2>
        <ul className="list-disc ml-6 text-gray-700">
          <li><b>[Jun/2024]</b> Lançamento oficial do token GAYA e início da comunidade.</li>
          <li><b>[Jul/2024]</b> Primeira coleção de NFTs carnavalescos.</li>
          <li><b>[Ago/2024]</b> Evento virtual "Carnaval Cripto" com prêmios em GAYA.</li>
          <li><b>[Set/2024]</b> Parcerias com projetos culturais de Recife.</li>
        </ul>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-8 flex flex-col items-center bg-gradient-to-r from-yellow-200 via-pink-200 to-blue-200 rounded-t-3xl shadow-inner">
        <span className="font-bold text-lg text-gray-700">GAYA © {new Date().getFullYear()} - Carnaval, Cripto e Comunidade</span>
        <div className="flex gap-4 mt-2">
          <a href="#" className="text-gray-600 hover:text-yellow-600">Termos</a>
          <a href="#" className="text-gray-600 hover:text-pink-600">Privacidade</a>
          <a href="#" className="text-gray-600 hover:text-blue-600">Contato</a>
        </div>
      </footer>
    </div>
  );
} 