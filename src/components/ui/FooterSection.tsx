import { motion } from 'framer-motion'

export default function FooterSection() {
  return (
    <footer className="flex flex-col items-center justify-center min-h-[10vh] bg-white/60 backdrop-blur-md rounded-xl shadow-lg mx-4 my-8 p-4 pointer-events-auto">
      <motion.p
        className="text-sm text-gray-600 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        © {new Date().getFullYear()} GAYA Memecoin. Feito com humor e alegria em Recife.
      </motion.p>
    </footer>
  )
} 