import React from 'react';
import { Button } from '@/components/ui/button.jsx';

const LevelCompleteScreen = ({ score, onNextLevel, onMainMenu }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-4xl font-bold mb-2 text-primary">Nível Concluído!</h2>
        
        <div className="my-8">
          <p className="text-xl mb-2">Sua pontuação:</p>
          <p className="text-4xl font-bold text-primary">{score}</p>
        </div>
        
        <div className="space-y-4">          <Button 
            variant="default" 
            size="lg" 
            className="w-full"
            onClick={() => {
              console.log("Botão Próximo Nível clicado");
              onNextLevel();
            }}
          >
            Próximo Nível
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={() => {
              console.log("Botão Voltar ao Menu clicado");
              onMainMenu();
            }}
          >
            Voltar ao Menu
          </Button>
        </div>
        
        {/* Dicas */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Dica:</h3>
          <p className="text-sm text-muted-foreground">
            Destrua blocos para encontrar power-ups escondidos que aumentam seu alcance de bombas e número de bombas disponíveis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LevelCompleteScreen;
