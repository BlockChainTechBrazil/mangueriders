import { motion } from 'framer-motion'

export default function RoadmapSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[50vh] bg-white/60 backdrop-blur-md rounded-xl shadow-lg mx-4 my-8 p-8 pointer-events-auto">
      <motion.h2
        className="text-3xl font-bold text-frevo mb-4"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        Roadmap
      </motion.h2>
      <motion.ol
        className="text-lg text-gray-700 max-w-2xl text-left space-y-2 list-decimal list-inside"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <li>Lançamento da GAYA</li>
        <li>Campanha de memes e engajamento</li>
        <li>Listagem em DEX</li>
        <li>Eventos e parcerias locais</li>
        <li>Expansão para o Brasil inteiro</li>
      </motion.ol>
    </section>
  )
} 