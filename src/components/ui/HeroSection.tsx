import React from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] bg-white/60 backdrop-blur-md rounded-xl shadow-lg mx-4 mt-8 p-8 pointer-events-auto">
      <motion.img
        src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029"
        alt="Bitcoin"
        className="w-24 h-24 mb-6"
        animate={{ rotateY: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        style={{ backfaceVisibility: 'hidden' }}
      />
      <motion.h1
        className="text-5xl font-extrabold text-yellow-600 drop-shadow-lg"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        GAYA: A Memecoin de Recife
      </motion.h1>
      <motion.p
        className="mt-6 text-xl text-gray-800 max-w-2xl text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        O meme mais recifense do Brasil agora é cripto! Entre na onda, ria, compartilhe e faça parte da comunidade mais gaiata do mercado.
      </motion.p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <a href="https://t.me/gayacoin" target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href="https://twitter.com/gayacoin" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </Button>
      </div>
    </section>
  )
} 