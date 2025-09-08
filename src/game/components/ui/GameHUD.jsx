import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { POWER_UPS } from '../../utils/constants';

const GameHUD = ({ player, onPause }) => {
  // Estado para controlar a animação de pontuação
  const [showScoreAnimation, setShowScoreAnimation] = useState(false);
  const [prevScore, setPrevScore] = useState(player.score);
  
  // Verificar se o score mudou para mostrar a animação
  useEffect(() => {
    if (player.score > prevScore) {
      // Mostrar animação
      setShowScoreAnimation(true);
      
      // Esconder após 2 segundos
      const timer = setTimeout(() => {
        setShowScoreAnimation(false);
      }, 2000);
      
      // Atualizar o score anterior
      setPrevScore(player.score);
      
      return () => clearTimeout(timer);
    }
  }, [player.score, prevScore]);
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Barra superior com informações do jogador - Nova UI temática */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-gray-900/80 via-black/90 to-gray-900/80 backdrop-blur-sm p-3 border-b border-yellow-500/30 shadow-lg shadow-yellow-500/10 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Personagem com Score - Design futurista */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold relative border-2 border-yellow-400/40 shadow-lg shadow-orange-500/20">
              <span className="text-xl">{player.character.charAt(0)}</span>
              {/* Efeito de brilho */}
              <div className="absolute inset-0 rounded-full bg-orange-400 opacity-30 blur-sm"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-yellow-100 to-yellow-300">
                  {player.character}
                </span>
                <span className="text-yellow-400 font-bold text-sm bg-black/40 px-2 py-0.5 rounded-md border border-yellow-500/30 relative">
                  <span className="text-xs text-orange-300 mr-1 opacity-70">●</span>
                  {player.score} pontos
                  {/* Animação quando o score aumenta */}
                  {showScoreAnimation && (
                    <span className="absolute -top-5 -right-2 text-green-400 font-bold animate-bounce px-2 py-0.5 bg-black/60 rounded-md">
                      +100!
                    </span>
                  )}
                </span>
              </div>
              <div className="text-xs text-gray-300 font-mono italic">
                <span className="text-cyan-400">STATUS:</span> {player.currentDino ? `${player.currentDino}` : 'Piloto Solo'}
              </div>
            </div>
          </div>
          
          {/* Separador visual */}
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-yellow-500/30 to-transparent mx-1"></div>
          
          {/* Vidas - Design aprimorado */}
          <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-lg border border-red-500/30">
            <div className="text-red-500 text-xs font-mono mr-1">VIDA:</div>
            {Array.from({ length: player.lives }).map((_, i) => (
              <div key={i} className="text-red-500 text-xl relative">
                <span className="animate-pulse">❤️</span>
                <div className="absolute inset-0 rounded-full bg-red-400 opacity-10 blur-sm"></div>
              </div>
            ))}
            {/* Posições vazias para vidas perdidas */}
            {Array.from({ length: Math.max(0, 3 - player.lives) }).map((_, i) => (
              <div key={i} className="text-gray-600 text-xl opacity-40">❤️</div>
            ))}
          </div>
          
          {/* Power-ups - Alcance de bombas com design futurista */}
          <div className="flex items-center gap-2 ml-4 bg-gradient-to-r from-orange-900/40 to-orange-700/20 px-3 py-1 rounded-lg border border-orange-500/30">
            <div className="text-orange-400 text-lg relative">
              🔥
              <div className="absolute inset-0 rounded-full bg-orange-400 opacity-20 blur-sm"></div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs text-orange-300 font-mono">ALCANCE</div>
              <div className="text-white font-bold">{player.bombRange || 2}</div>
            </div>
          </div>
          
          {/* Power-ups - Máximo de bombas com design futurista */}
          <div className="flex items-center gap-2 ml-2 bg-gradient-to-r from-blue-900/40 to-blue-700/20 px-3 py-1 rounded-lg border border-blue-500/30">
            <div className="text-blue-400 text-lg relative">
              💣
              <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 blur-sm"></div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs text-blue-300 font-mono">BOMBAS</div>
              <div className="text-white font-bold">{player.bombs || 1}</div>
            </div>
          </div>
          
          {/* Status de invencibilidade com design futurista */}
          {player.isInvincible && (
            <div className="ml-2 bg-gradient-to-r from-yellow-900/50 to-yellow-700/30 px-3 py-1 rounded-lg border border-yellow-400/50 flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-ping mr-2"></div>
              <div className="text-yellow-300 animate-pulse font-bold">
                INVENCÍVEL
              </div>
            </div>
          )}
          
          {/* Power-ups ativos - Adicionado na barra superior */}
          <div className="flex items-center gap-2 ml-4">
            <div className="text-white text-sm">Power-ups:</div>
            <div className="flex gap-1">
              {player.powerUps.map((powerUp, i) => {
                const powerUpInfo = POWER_UPS[powerUp] || {};
                return (
                  <div 
                    key={i} 
                    className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-lg"
                    title={powerUpInfo.name}
                  >
                    {powerUpInfo.icon}
                  </div>
                );
              })}
              {player.powerUps.length === 0 && (
                <div className="text-gray-400 text-sm">Nenhum</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Botão de pausa (com pointer-events-auto para permitir cliques) */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white pointer-events-auto"
          onClick={onPause}
        >
          ⏸️ Pausar
        </Button>
      </div>
      
      {/* Barra inferior removida conforme solicitado */}
      
      {/* Controles para dispositivos móveis */}
      <div className="absolute bottom-20 left-4 right-4 flex justify-between pointer-events-auto md:hidden">
        {/* Direcionais */}
        <div className="grid grid-cols-3 gap-2">
          <div className="w-12 h-12"></div>
          <button className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center text-white text-2xl">
            ↑
          </button>
          <div className="w-12 h-12"></div>
          
          <button className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center text-white text-2xl">
            ←
          </button>
          <div className="w-12 h-12"></div>
          <button className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center text-white text-2xl">
            →
          </button>
          
          <div className="w-12 h-12"></div>
          <button className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center text-white text-2xl">
            ↓
          </button>
          <div className="w-12 h-12"></div>
        </div>
        
        {/* Botão de bomba */}
        <button className="w-16 h-16 bg-red-600 bg-opacity-70 rounded-full flex items-center justify-center text-white text-2xl">
          💣
        </button>
      </div>
    </div>
  );
};

export default GameHUD;

