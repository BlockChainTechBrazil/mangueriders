import React, { useState, useEffect } from 'react';

const BombLoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fuseProgress, setFuseProgress] = useState(0);
  const [bombPulse, setBombPulse] = useState(1);
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    // Simular carregamento
    // Novo: loading dura ~1s
    const loadingInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          // Iniciar explosão
          setExploded(true);
          setTimeout(() => {
            onLoadingComplete();
          }, 400); // explosão rápida
          return 100;
        }
        return prev + 20; // 5 steps de 200ms = 1s
      });
    }, 200);

    // Animação do pavio
    const fuseInterval = setInterval(() => {
      setFuseProgress(() => {
        const newProgress = (progress / 100) * 100;
        return newProgress;
      });
    }, 50);

    // Animação de pulsação da bomba
    const pulseInterval = setInterval(() => {
      setBombPulse(prev => prev === 1 ? 1.1 : 1);
    }, 500);

    return () => {
      clearInterval(loadingInterval);
      clearInterval(fuseInterval);
      clearInterval(pulseInterval);
    };
  }, [progress, onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      {/* Background com estrelas */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Explosão */}
      {exploded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-gradient-radial from-yellow-400 via-orange-500 to-red-600 rounded-full animate-ping opacity-75"></div>
          <div className="absolute w-64 h-64 bg-gradient-radial from-white via-yellow-300 to-orange-400 rounded-full animate-pulse"></div>
          <div className="absolute w-32 h-32 bg-white rounded-full animate-bounce"></div>
        </div>
      )}

      {/* Container principal */}
      {!exploded && (
        <div className="relative flex flex-col items-center">
          {/* Pavio - girado 90° à direita e centralizado */}
          <div className="relative mb-0 flex justify-center">
            <svg width="300" height="200" viewBox="0 0 300 200" className="overflow-visible" style={{ transform: 'rotate(90deg)', transformOrigin: 'center', marginLeft: '-80px' }}>
              {/* Linha do pavio */}
              <path
                d="M 50 80 Q 100 20 150 60 Q 200 100 250 40"
                stroke="#8B4513"
                strokeWidth="4"
                fill="none"
                className="opacity-80"
              />

              {/* Pavio aceso (progresso) */}
              <path
                d="M 50 80 Q 100 20 150 60 Q 200 100 250 40"
                stroke="#FF4500"
                strokeWidth="6"
                fill="none"
                strokeDasharray="200"
                strokeDashoffset={200 - (fuseProgress * 2)}
                className="drop-shadow-lg"
                style={{
                  filter: 'drop-shadow(0 0 10px #FF4500)',
                  transition: 'stroke-dashoffset 0.1s ease-out'
                }}
              />

              {/* Faíscas no final do pavio */}
              {fuseProgress > 0 && (
                <g>
                  {[...Array(5)].map((_, i) => (
                    <circle
                      key={i}
                      cx={50 + (fuseProgress * 2)}
                      cy={80 - Math.sin((50 + fuseProgress * 2) * 0.02) * 20}
                      r={Math.random() * 3 + 1}
                      fill="#FFD700"
                      className="animate-pulse"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        filter: 'drop-shadow(0 0 5px #FFD700)'
                      }}
                    />
                  ))}
                </g>
              )}
            </svg>
          </div>

          {/* Bomba */}
          <div
            className="relative transition-transform duration-300 ease-in-out"
            style={{
              transform: `scale(${bombPulse})`,
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))'
            }}
          >
            {/* Sombra da bomba */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black/30 rounded-full blur-md"></div>

            {/* Corpo da bomba */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-full border-4 border-gray-600 shadow-2xl">
                {/* Brilho da bomba */}
                <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-sm"></div>

                {/* Detalhes metálicos */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full"></div>
                  <div className="w-12 h-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full mt-2 mx-auto"></div>
                </div>
              </div>

              {/* Pavio da bomba */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-2 h-8 bg-gradient-to-t from-gray-700 to-gray-500 rounded-t-full"></div>
                {fuseProgress > 90 && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-4 h-4 bg-gradient-radial from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                        style={{
                          left: `${Math.cos(i * 45 * Math.PI / 180) * 10 + 8}px`,
                          top: `${Math.sin(i * 45 * Math.PI / 180) * 10 + 8}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Barra de progresso estilizada */}
          <div className="mt-12 w-80">
            <div className="relative">
              <div className="w-full h-2 bg-gray-800 rounded-full border border-gray-600 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${progress}%`,
                    boxShadow: '0 0 20px rgba(255, 165, 0, 0.6)'
                  }}
                ></div>
              </div>

              {/* Texto de carregamento */}
              <div className="text-center mt-4">
                <div className="text-lg text-orange-400 font-mono">
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          </div>

          {/* Partículas flutuantes */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-orange-400 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 2 + 3}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Estilos CSS customizados */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default BombLoadingScreen;

