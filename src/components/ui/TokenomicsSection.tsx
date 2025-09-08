import { motion } from 'framer-motion'

export default function TokenomicsSection() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[50vh] bg-white/60 backdrop-blur-md rounded-xl shadow-lg mx-4 my-8 p-8 pointer-events-auto">
      <motion.h2
        className="text-3xl font-bold text-mar mb-4"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        Tokenomics
      </motion.h2>
      <motion.ul
        className="text-lg text-gray-700 max-w-2xl text-center space-y-2"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <li>Supply Total: 1.000.000.000 GAYA</li>
        <li>Taxa de Compra/Venda: 0%</li>
        <li>Liquidez Queimada</li>
        <li>100% para a comunidade</li>
      </motion.ul>
    </section>
  )
} 