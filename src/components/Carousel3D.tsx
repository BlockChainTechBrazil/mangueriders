import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import '@/styles/carousel-3d.css';

interface Carousel3DProps {
  children: React.ReactNode[];
  autoRotate?: boolean;
  rotationInterval?: number;
}

const Carousel3D: React.FC<Carousel3DProps> = ({
  children,
  autoRotate = true,
  rotationInterval = 3000
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalItems = children.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Obter índice com loop seguro (0 a totalItems-1)
  const getItemIndex = (index: number): number => {
    return ((index % totalItems) + totalItems) % totalItems;
  };

  // Rotação automática
  useEffect(() => {
    if (autoRotate) {
      timerRef.current = setInterval(() => {
        setActiveIndex((prev) => getItemIndex(prev + 1));
      }, rotationInterval);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoRotate, rotationInterval, totalItems]);

  // Pausar a rotação quando o mouse estiver sobre o carrossel
  const handleMouseEnter = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleMouseLeave = () => {
    if (autoRotate) {
      timerRef.current = setInterval(() => {
        setActiveIndex((prev) => getItemIndex(prev + 1));
      }, rotationInterval);
    }
  };

  // Navegar para card anterior
  const goToPrev = () => {
    setActiveIndex((prev) => getItemIndex(prev - 1));
  };

  // Navegar para próximo card
  const goToNext = () => {
    setActiveIndex((prev) => getItemIndex(prev + 1));
  };

  // Ir para um card específico
  const goToItem = (index: number) => {
    setActiveIndex(index);
  };

  // Renderizar os itens com as classes apropriadas para o efeito 3D
  const renderItems = () => {
    return children.map((child, index) => {
      let className = 'carousel-3d-item';

      // Calculando a posição relativa ao item ativo
      const position = getItemIndex(index - activeIndex);

      if (position === 0) {
        className += ' active'; // Item ativo (central)
      } else if (position === 1 || position === -totalItems + 1) {
        className += ' next'; // Próximo item
      } else if (position === -1 || position === totalItems - 1) {
        className += ' prev'; // Item anterior
      } else if (position === 2 || position === -totalItems + 2) {
        className += ' next-2'; // Próximo do próximo
      } else if (position === -2 || position === totalItems - 2) {
        className += ' prev-2'; // Anterior do anterior
      } else {
        className += ' hidden'; // Ocultar os demais itens
      }

      // Centralizar os itens horizontalmente baseado no número total
      const leftPosition = `calc(50% - 140px)`; // 140px é metade da largura do item

      return (
        <div
          key={index}
          className={className}
          style={{ left: leftPosition }}
        >
          {child}
        </div>
      );
    });
  };

  return (
    <div
      className="carousel-3d-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="carousel-3d-content"
        style={{ height: '420px' }} // Ajuste conforme necessário
      >
        {renderItems()}
      </div>

      {/* Controles de navegação */}
      <motion.div
        className="carousel-3d-nav carousel-3d-prev"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={goToPrev}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </motion.div>

      <motion.div
        className="carousel-3d-nav carousel-3d-next"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={goToNext}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </motion.div>

      {/* Indicadores de posição */}
      <div className="carousel-3d-controls">
        {children.map((_, index) => (
          <div
            key={index}
            className={`carousel-3d-dot ${index === activeIndex ? 'active' : ''}`}
            onClick={() => goToItem(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel3D;
