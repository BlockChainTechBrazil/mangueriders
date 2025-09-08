import React from 'react';

export function Loader({ size = 'default' }) {
  const sizeClasses = {
    small: 'w-10 h-10',
    default: 'w-20 h-20',
    large: 'w-32 h-32',
  };
  
  const containerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };
  
  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-black via-gaya-darkGray to-black z-50">
      <motion.div
        className={`${sizeClasses[size]} relative`}
        animate="animate"
        variants={containerVariants}
      >
        <div className="absolute inset-0 rounded-full border-t-4 border-gaya-primary border-opacity-80"></div>
        <div className="absolute inset-0 rounded-full border-r-4 border-gaya-secondary border-opacity-60" style={{ rotate: '45deg' }}></div>
        <div className="absolute inset-0 rounded-full border-b-4 border-gaya-accent border-opacity-40" style={{ rotate: '90deg' }}></div>
      </motion.div>
      
      <motion.p 
        className="mt-8 text-gaya-accent font-bold text-xl sm:text-2xl"
        variants={pulseVariants}
        animate="animate"
      >
        Carregando GAYA...
      </motion.p>
      
      <motion.div 
        className="mt-6 w-64 h-2 bg-gaya-darkGray rounded-full overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-gaya-primary via-gaya-pink to-gaya-secondary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </motion.div>
      
      <motion.p 
        className="mt-4 text-white/70 text-sm px-6 text-center max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Estamos construindo a experiência mais animada de Recife para você
      </motion.p>
    </div>
  );
}
