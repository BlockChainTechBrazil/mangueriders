import { motion } from 'framer-motion'

export default function CommunitySection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[40vh] bg-white/60 backdrop-blur-md rounded-xl shadow-lg mx-4 my-8 p-8 pointer-events-auto">
      <motion.h2
        className="text-3xl font-bold text-mangue mb-4"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        Comunidade
      </motion.h2>
      <motion.p
        className="text-lg text-gray-700 max-w-2xl text-center mb-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        Junte-se à comunidade mais gaiata do Brasil! Entre no Telegram, siga no Twitter e participe das zoeiras e novidades.
      </motion.p>
      <div className="flex gap-4">
        <a href="https://t.me/gayacoin" target="_blank" rel="noopener noreferrer" className="text-white bg-mar px-4 py-2 rounded-lg font-bold shadow hover:bg-blue-700 transition">Telegram</a>
        <a href="https://twitter.com/gayacoin" target="_blank" rel="noopener noreferrer" className="text-mar border-2 border-mar px-4 py-2 rounded-lg font-bold shadow hover:bg-mar hover:text-white transition">Twitter</a>
      </div>
    </section>
  )
} 