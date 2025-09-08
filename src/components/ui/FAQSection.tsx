import { motion } from 'framer-motion'

export default function FAQSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[40vh] bg-white/60 backdrop-blur-md rounded-xl shadow-lg mx-4 my-8 p-8 pointer-events-auto">
      <motion.h2
        className="text-3xl font-bold text-carnaval mb-4"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        FAQ
      </motion.h2>
      <motion.div
        className="text-lg text-gray-700 max-w-2xl text-left space-y-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <div>
          <strong>O que é a GAYA?</strong>
          <p>Uma memecoin inspirada no humor recifense e feita para viralizar!</p>
        </div>
        <div>
          <strong>Como posso comprar?</strong>
          <p>Em breve, listada nas principais DEXs. Fique ligado!</p>
        </div>
        <div>
          <strong>Tem taxa?</strong>
          <p>Nenhuma! Aqui a zoeira é livre.</p>
        </div>
      </motion.div>
    </section>
  )
} 