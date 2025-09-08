import { motion } from 'framer-motion'

export default function AboutSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] bg-white/60 backdrop-blur-md rounded-xl shadow-lg mx-4 my-8 p-8 pointer-events-auto">
      <motion.h2
        className="text-3xl font-bold text-carnaval mb-4"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        Sobre a GAYA
      </motion.h2>
      <motion.p
        className="text-lg text-gray-700 max-w-2xl text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        GAYA é a memecoin que nasceu do bom humor recifense e do famoso ditado: "Em Recife só tem corno, todo mundo tem gaia". Aqui, a zoeira é levada a sério e a comunidade é feita para rir, compartilhar e surfar na onda do meme mais autêntico do Brasil!
      </motion.p>
    </section>
  )
} 