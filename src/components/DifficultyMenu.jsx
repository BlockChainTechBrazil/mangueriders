import React from 'react';

export default function DifficultyMenu({ onSelectDifficulty }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-blue-800 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-sm p-10 rounded-2xl shadow-2xl text-center border border-green-400/30">
        <h1 className="text-5xl font-extrabold text-white mb-8 drop-shadow-lg">Guardião do Mangue</h1>
        <p className="text-xl text-gray-200 mb-8">Selecione a Dificuldade:</p>
        <div className="space-y-4">
          <button
            onClick={() => onSelectDifficulty(4)}
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-2xl transition-all transform hover:scale-105 shadow-lg"
          >
            Fácil (4 Inimigos)
          </button>
          <button
            onClick={() => onSelectDifficulty(8)}
            className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-4 px-8 rounded-xl text-2xl transition-all transform hover:scale-105 shadow-lg"
          >
            Médio (8 Inimigos)
          </button>
          <button
            onClick={() => onSelectDifficulty(12)}
            className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl text-2xl transition-all transform hover:scale-105 shadow-lg"
          >
            Difícil (12 Inimigos)
          </button>
        </div>
      </div>
    </div>
  );
}