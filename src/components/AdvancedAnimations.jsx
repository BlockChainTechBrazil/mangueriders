import React, { useEffect, useState, useRef, useCallback } from 'react';

// Hook personalizado para animações avançadas
export const useAdvancedAnimations = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState({});

  // Throttle para otimização de performance
  const throttle = useCallback((func, delay) => {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }, []);

  // Gerenciamento de scroll otimizado
  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrollY(window.scrollY);
    }, 16); // ~60fps

    const handleMouseMove = throttle((e) => {
      setMousePosition({ 
        x: e.clientX / window.innerWidth, 
        y: e.clientY / window.innerHeight 
      });
    }, 16);

    const handleResize = throttle(() => {
      setWindowSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Inicializar valores
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [throttle]);

  // Intersection Observer para animações de entrada
  const observeElement = useCallback((element, id) => {
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(prev => ({
          ...prev,
          [id]: entry.isIntersecting
        }));
      },
      { 
        threshold: 0.1, 
        rootMargin: '50px 0px -50px 0px' 
      }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  return {
    scrollY,
    mousePosition,
    windowSize,
    isVisible,
    observeElement
  };
};

// Componente de partículas interativas
export const InteractiveParticles = ({ count = 50, mousePosition, scrollY }) => {
  const particlesRef = useRef([]);

  useEffect(() => {
    // Inicializar partículas
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.3,
      color: ['#48bb78', '#4299e1', '#ed8936', '#9f7aea'][Math.floor(Math.random() * 4)]
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particlesRef.current.map((particle) => {
        const mouseInfluence = {
          x: (mousePosition.x - 0.5) * 20,
          y: (mousePosition.y - 0.5) * 20
        };
        
        const scrollInfluence = scrollY * 0.1;

        return (
          <div
            key={particle.id}
            className="absolute rounded-full transition-all duration-1000 ease-out"
            style={{
              left: `${particle.x + mouseInfluence.x}%`,
              top: `${particle.y + mouseInfluence.y - scrollInfluence}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: `translate(-50%, -50%) scale(${1 + mousePosition.x * 0.2})`,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              animation: `particleFloat ${4 + particle.speed * 4}s ease-in-out infinite`
            }}
          />
        );
      })}
    </div>
  );
};

// Componente de background com paralaxe avançado
export const ParallaxBackground = ({ scrollY, mousePosition, children }) => {
  const layersRef = useRef([]);

  const layers = [
    { speed: 0.1, opacity: 0.3, blur: 2 },
    { speed: 0.3, opacity: 0.5, blur: 1 },
    { speed: 0.5, opacity: 0.7, blur: 0 },
    { speed: 0.8, opacity: 0.9, blur: 0 }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Camadas de paralaxe */}
      {layers.map((layer, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{
            transform: `
              translateY(${scrollY * layer.speed}px) 
              translateX(${mousePosition.x * 10 * layer.speed}px)
            `,
            opacity: layer.opacity,
            filter: `blur(${layer.blur}px)`,
            zIndex: index
          }}
        >
          {/* Elementos de fundo específicos para cada camada */}
          {index === 0 && <CloudLayer />}
          {index === 1 && <MountainLayer />}
          {index === 2 && <ForestLayer />}
          {index === 3 && <GroundLayer />}
        </div>
      ))}
      
      {/* Conteúdo principal */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Componentes de camadas do background
const CloudLayer = () => (
  <div className="absolute inset-0">
    {Array.from({ length: 12 }, (_, i) => (
      <div
        key={i}
        className="absolute bg-white rounded-full opacity-60 animate-pulse"
        style={{
          left: `${5 + i * 8}%`,
          top: `${5 + (i % 4) * 8}%`,
          width: `${40 + Math.random() * 60}px`,
          height: `${20 + Math.random() * 30}px`,
          animationDelay: `${i * 0.3}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }}
      />
    ))}
  </div>
);

const MountainLayer = () => (
  <svg viewBox="0 0 1200 400" className="w-full h-full">
    <defs>
      <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#4a5568" />
        <stop offset="100%" stopColor="#2d3748" />
      </linearGradient>
    </defs>
    <path
      d="M0,200 L200,80 L400,120 L600,60 L800,100 L1000,70 L1200,90 L1200,400 L0,400 Z"
      fill="url(#mountainGrad)"
    />
  </svg>
);

const ForestLayer = () => (
  <svg viewBox="0 0 1200 300" className="w-full h-full">
    <defs>
      <linearGradient id="forestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#22543d" />
        <stop offset="100%" stopColor="#1a202c" />
      </linearGradient>
    </defs>
    <path
      d="M0,150 Q100,100 200,130 Q300,80 400,110 Q500,60 600,90 Q700,40 800,70 Q900,60 1000,90 Q1100,80 1200,110 L1200,300 L0,300 Z"
      fill="url(#forestGrad)"
    />
  </svg>
);

const GroundLayer = () => (
  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-800 to-transparent" />
);

// Componente de texto animado
export const AnimatedText = ({ 
  text, 
  className = '', 
  delay = 0, 
  isVisible = true,
  effect = 'slideUp' 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
      }
    }, delay + currentIndex * 50);

    return () => clearTimeout(timer);
  }, [text, currentIndex, isVisible, delay]);

  const getAnimationClass = () => {
    if (!isVisible) return 'opacity-0 translate-y-10';
    
    switch (effect) {
      case 'slideUp':
        return 'opacity-100 translate-y-0 transition-all duration-1000 ease-out';
      case 'slideLeft':
        return 'opacity-100 translate-x-0 transition-all duration-1000 ease-out';
      case 'fade':
        return 'opacity-100 transition-opacity duration-1000 ease-out';
      default:
        return 'opacity-100 transition-all duration-1000 ease-out';
    }
  };

  return (
    <span className={`${className} ${getAnimationClass()}`}>
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

// Componente de botão com efeitos avançados
export const AnimatedButton = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary',
  size = 'md',
  disabled = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-blue-800';
      case 'secondary':
        return 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 border-green-800';
      case 'accent':
        return 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 border-orange-800';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 border-gray-800';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      case 'xl':
        return 'px-10 py-5 text-xl';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <button
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
        text-white font-bold rounded-lg cartoon-border
        transition-all duration-300 ease-out
        transform-gpu
        ${isHovered ? 'scale-105 -translate-y-1' : 'scale-100 translate-y-0'}
        ${isPressed ? 'scale-95 translate-y-1' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        relative overflow-hidden
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={disabled}
    >
      {/* Efeito de brilho */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent
          opacity-0 transform -skew-x-12 -translate-x-full
          transition-all duration-700 ease-out
          ${isHovered ? 'opacity-20 translate-x-full' : ''}
        `}
      />
      
      {/* Conteúdo do botão */}
      <span className="relative z-10">
        {children}
      </span>
    </button>
  );
};

// Componente de card com animações
export const AnimatedCard = ({ 
  children, 
  className = '', 
  delay = 0, 
  isVisible = true,
  hoverEffect = true 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        ${className}
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
        ${hoverEffect && isHovered ? 'scale-105 -translate-y-2' : 'scale-100 translate-y-0'}
        cartoon-border rounded-xl
        relative overflow-hidden
      `}
      style={{ 
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Efeito de brilho no hover */}
      {hoverEffect && (
        <div 
          className={`
            absolute inset-0 bg-gradient-to-br from-white/10 to-transparent
            opacity-0 transition-opacity duration-300
            ${isHovered ? 'opacity-100' : ''}
          `}
        />
      )}
      
      {/* Conteúdo do card */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default {
  useAdvancedAnimations,
  InteractiveParticles,
  ParallaxBackground,
  AnimatedText,
  AnimatedButton,
  AnimatedCard
};

