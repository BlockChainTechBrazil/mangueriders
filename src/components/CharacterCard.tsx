import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import imageManager from '../utils/imageManager';

// Definição dos tipos para os personagens
export interface CharacterType {
  id: string;
  name: string;
  element: string;
  elementColor: string;
  description: string;
  stats: {
    [key: string]: number;
  };
}

// Mapeamento de elementos para classes CSS e cores
const elementClassMap: Record<string, { overlay: string, badge: string, glow: string }> = {
  'Fogo': { overlay: 'fire-element', badge: 'fire-badge', glow: 'from-red-500 to-orange-300' },
  'Raio': { overlay: 'lightning-element', badge: 'lightning-badge', glow: 'from-yellow-400 to-amber-300' },
  'Terra': { overlay: 'earth-element', badge: 'earth-badge', glow: 'from-green-500 to-lime-300' },
  'Água': { overlay: 'water-element', badge: 'water-badge', glow: 'from-blue-500 to-cyan-300' },
  'Ar': { overlay: 'air-element', badge: 'air-badge', glow: 'from-purple-500 to-indigo-300' },
};

const statColorMap: Record<string, string> = {
  'força': 'fire-stat',
  'velocidade': 'lightning-stat',
  'técnica': 'water-stat',
};

const CharacterCard: React.FC<{ character: CharacterType, imageSrc: string }> = ({ character, imageSrc }) => {
  // Refs e estados
  const cardRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string>(imageSrc);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  // Carregar imagem e lidar com fallbacks
  useEffect(() => {    // Configurar fallbacks para cada elemento usando imageManager
    const fallbacks: Record<string, string> = {
      'Fogo': imageManager.game.characters.charFire,
      'Raio': imageManager.game.characters.charRaio,
      'Terra': imageManager.game.characters.charEarth,
      'Água': imageManager.game.characters.charWater,
      'Ar': imageManager.game.characters.charAir
    };

    if (!imageSrc || imageSrc === 'undefined') {
      // Usar fallback se não houver imagem
      setImageUrl(fallbacks[character.element] || imageManager.game.characters.charFire);
    } else {
      setImageUrl(imageSrc);
    }

    // Pre-carregar a imagem
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setImageLoaded(true);
    };    img.onerror = () => {
      // Tentar o fallback se houver erro
      const fallbackImg = fallbacks[character.element] || imageManager.game.characters.charFire;
      setImageUrl(fallbackImg);
    };
  }, [character, imageSrc, imageUrl]);

  // Efeitos para movimento da carta em 3D
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    // Calcular a posição relativa do mouse dentro do card (valores de -0.5 a 0.5)
    const x = ((e.clientX - rect.left) / rect.width) - 0.5;
    const y = ((e.clientY - rect.top) / rect.height) - 0.5;

    // Aplicar rotação baseada na posição do mouse 
    setRotation({
      x: -y * 15, // Rotação inversa para parecer natural 
      y: x * 15   // Rotação no eixo Y proporcional à posição horizontal do mouse
    });
  };

  const handleMouseLeave = () => {
    // Resetar a rotação quando o mouse sair
    setRotation({ x: 0, y: 0 });
  };

  // Obter classe de brilho baseada no elemento
  const glowClass = elementClassMap[character.element]?.glow || 'from-cyan-500 to-blue-300';

  return (
    <motion.div
      ref={cardRef}
      className="relative w-72 h-96 rounded-xl overflow-hidden shadow-lg perspective transform-gpu"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        className="relative w-full h-full rounded-xl overflow-hidden border-2 border-cyan-500/30 bg-gradient-to-b from-gray-900 to-black"
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card content */}
        <div className="absolute inset-0 flex flex-col">
          {/* Indicador de carregamento ou plano de fundo */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center bg-gray-800 z-10 transition-opacity duration-300 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}
            style={{
              background: `radial-gradient(circle, rgba(8,51,68,1) 0%, rgba(0,0,0,1) 100%)`,
              backgroundSize: 'cover'
            }}
          >
            <div className="animate-pulse text-cyan-300 mb-2">Carregando...</div>
            <div className="w-16 h-16">
              <svg className="animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative h-3/5 overflow-hidden">
            {/* Character Image */}
            <img
              src={imageUrl}
              alt={character.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}
            />

            {/* Elemento Badge */}
            <div
              className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20 bg-gradient-to-r ${glowClass} transform-gpu`}
              style={{ transform: 'translateZ(40px)' }}
            >
              {character.element}
            </div>

            {/* Overlay de brilho do elemento */}
            <div
              className={`absolute inset-0 opacity-40 mix-blend-overlay bg-gradient-to-br ${glowClass}`}
            ></div>
          </div>

          {/* Info Section */}
          <div className="h-2/5 p-4 bg-gradient-to-b from-black/80 to-gray-900/90 flex flex-col justify-between" style={{ transform: 'translateZ(10px)' }}>
            <div>
              <h3 className="text-xl font-bold text-cyan-300 mb-1">{character.name}</h3>
              <p className="text-xs text-cyan-100 line-clamp-2">{character.description}</p>
            </div>

            {/* Stats */}
            <div className="flex justify-around gap-2 mt-2">
              {Object.entries(character.stats).map(([stat, value]) => (
                <div key={stat} className="flex flex-col items-center">
                  <div className="text-[10px] text-cyan-400 uppercase">{stat}</div>
                  <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full bg-gradient-to-r ${glowClass}`}
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-cyan-200 mt-1">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Glow effect around edges */}
        <div
          className={`absolute inset-0 -z-10 rounded-xl opacity-0 hover:opacity-60 transition-opacity duration-300 bg-gradient-to-r ${glowClass}`}
          style={{
            filter: 'blur(15px)',
            transform: 'translateZ(-20px) scale(0.9)',
            opacity: imageLoaded ? 0.3 : 0
          }}
        ></div>
      </motion.div>
    </motion.div>
  );
};

export default CharacterCard;
