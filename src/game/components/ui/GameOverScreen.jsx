import React from 'react';
import { Button } from '@/components/ui/button.jsx';

const GameOverScreen = ({ score, onRestart }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-4xl font-bold mb-2 text-destructive">Game Over</h2>
        
        <div className="my-8">
          <p className="text-xl mb-2">Sua pontuação:</p>
          <p className="text-4xl font-bold text-primary">{score}</p>
        </div>
        
        <div className="space-y-4">
          <Button 
            variant="default" 
            size="lg" 
            className="w-full"
            onClick={() => {
              console.log("Botão Jogar Novamente clicado");
              onRestart();
            }}
          >
            Jogar Novamente
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={() => {
              console.log("Botão Voltar ao Menu clicado");
              onRestart();
            }}
          >
            Voltar ao Menu
          </Button>
        </div>
        
        {/* Dicas */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Dica:</h3>
          <p className="text-sm text-muted-foreground">
            Procure por ovos de dinossauro escondidos nos blocos destrutíveis. 
            Eles podem te dar habilidades especiais e vidas extras!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;

