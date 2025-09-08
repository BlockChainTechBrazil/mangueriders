import React from 'react';
import { Button } from '@/components/ui/button.jsx';

const PauseMenu = ({ onResume, onRestart }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-6">Jogo Pausado</h2>
        
        <div className="space-y-4">
          <Button 
            variant="default" 
            size="lg" 
            className="w-full"
            onClick={onResume}
          >
            Continuar Jogo
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={onRestart}
          >
            Reiniciar
          </Button>
          
          <div className="pt-4 border-t border-border mt-4">
            <h3 className="text-xl font-semibold mb-4">Controles</h3>
            
            <div className="grid grid-cols-2 gap-2 text-left">
              <div className="text-muted-foreground">Movimento:</div>
              <div>Setas ou WASD</div>
              
              <div className="text-muted-foreground">Colocar Bomba:</div>
              <div>Espaço</div>
              
              <div className="text-muted-foreground">Pausar:</div>
              <div>ESC ou P</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;

