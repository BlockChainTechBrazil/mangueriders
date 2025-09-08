import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import useGameStore from '../../store/gameStore';
import { useNavigate } from 'react-router-dom';

const MainMenu = ({ characters, maps, onStartGame }) => {
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedCharacterObj, setSelectedCharacterObj] = useState(null);
  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedMapObj, setSelectedMapObj] = useState(null);
  const { setPlayerCharacter, setCurrentMap, setMapData } = useGameStore();
  
  // Inicialização dos valores padrão
  useEffect(() => {
    if (characters && Object.values(characters).length > 0) {
      // Começamos com Álex como personagem padrão, se existir (personagem atualizado)
      const defaultCharacter = Object.values(characters).find(char => char.name === 'Álex') || Object.values(characters)[0];
      setSelectedCharacter(defaultCharacter.name);
      setSelectedCharacterObj(defaultCharacter);
    }
    
    if (maps && Object.values(maps).length > 0) {
      const defaultMap = Object.values(maps).find(map => map.name === 'Floresta Encantada') || Object.values(maps)[0];
      setSelectedMap(defaultMap.name);
      setSelectedMapObj(defaultMap);
    }
  }, [characters, maps]);
  
  // Atualiza o objeto do personagem quando a seleção muda
  useEffect(() => {
    if (selectedCharacter && characters) {
      const charObj = Object.values(characters).find(char => char.name === selectedCharacter);
      if (charObj) {
        setSelectedCharacterObj(charObj);
        // Log para debug (remover após confirmação)
        console.log("Personagem selecionado:", charObj.name, "ModelPath:", charObj.modelPath);
      }
    }
  }, [selectedCharacter, characters]);
  
  // Atualiza o objeto do mapa quando a seleção muda
  useEffect(() => {
    if (selectedMap && maps) {
      const mapObj = Object.values(maps).find(map => map.name === selectedMap);
      if (mapObj) setSelectedMapObj(mapObj);
    }
  }, [selectedMap, maps]);
  
  // Inicia o jogo com o personagem e mapa selecionados
  const handleStartGame = () => {
    if (!selectedCharacterObj || !selectedMapObj) return;
    
    // Encontra a chave do mapa com base no nome selecionado
    const mapKey = Object.keys(maps).find(
      key => maps[key].name === selectedMap
    ) || 'FOREST';
    
    // Encontra a chave do personagem com base no nome selecionado
    const characterKey = Object.keys(characters).find(
      key => characters[key].name === selectedCharacter
    ) || 'RIDER';
    
    // Verificação especial para nomes específicos (caso direto)
    if (selectedCharacter === "Weet") {
      console.log("Personagem Weet selecionado, usando chave WEET diretamente");
      setPlayerCharacter("WEET");
    } else if (selectedCharacter === "Raiado") {
      console.log("Personagem Raiado selecionado, usando chave RAIADO diretamente");
      setPlayerCharacter("RAIADO");
    } else if (characterKey && characters[characterKey]) {
      // Para outros personagens, usa a chave encontrada
      setPlayerCharacter(characterKey);
      console.log("Personagem selecionado:", characters[characterKey].name, "| chave:", characterKey);
    } else {
      // Fallback para o primeiro personagem se a chave não existir
      const firstKey = Object.keys(characters)[0];
      console.warn("Chave de personagem inválida, usando:", firstKey);
      setPlayerCharacter(firstKey);
    }
    
    setCurrentMap(mapKey);
    setMapData(selectedMapObj); // Define os dados do mapa diretamente
    
    // Chama o callback
    onStartGame && onStartGame(characterKey, mapKey);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-card p-8 rounded-lg shadow-lg max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-6 text-primary">BombRider</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Seção de seleção de personagem */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Escolha seu Rider</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.values(characters).map((character) => (
                <Button
                  key={character.id}
                  variant={selectedCharacter === character.name ? "default" : "outline"}
                  className="justify-start"
                  style={{
                    borderRight: selectedCharacter === character.name ? `8px solid ${character.color || '#888'}` : '',
                    borderLeft: selectedCharacter === character.name ? `8px solid ${character.color || '#888'}` : '',
                  }}
                  onClick={() => {
                    setSelectedCharacter(character.name);
                    console.log("Selecionado:", character.name, "| ID:", character.id, "| ModelPath:", character.modelPath);
                  }}
                >
                  <div className="flex flex-col items-start">
                    <span>{character.name} - {character.element}</span>
                  </div>
                </Button>
              ))}
            </div>
            
            {/* Exibe detalhes do personagem selecionado */}
            {selectedCharacterObj && (
              <div className="bg-gray-200 bg-opacity-20 p-3 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold" style={{ color: selectedCharacterObj.color || 'white' }}>
                    {selectedCharacterObj.name}
                  </h3>
                  <span className=" x-2 py-1 rounded text-x" style={{ color: selectedCharacterObj.color || 'black' }}>{selectedCharacterObj.element}</span>
                </div>
                <p className="text-sm mb-2">{selectedCharacterObj.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="font-semibold">Bombas: {selectedCharacterObj.initialBombs}</div>
                    <div className="font-semibold">Alcance: {selectedCharacterObj.initialBombRange}</div>
                    <div className="font-semibold">Velocidade: {selectedCharacterObj.initialSpeed}</div>
                  </div>
                  <div>
                    <div className="font-semibold mt-1">
                      <span className="text-primary">Habilidade:</span> {selectedCharacterObj.specialAbility}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Seção de seleção de mapa */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Escolha o Mapa</h2>
            <div className="grid grid-cols-1 gap-2 mb-4">
              {Object.values(maps).map((map) => (
                <Button
                  key={map.id}
                  variant={selectedMap === map.name ? "default" : "outline"}
                  className="justify-start"
                  style={{
                    borderRight: selectedMap === map.name ? `8px solid ${map.groundColor || '#888'}` : '',
                    borderLeft: selectedMap === map.name ? `8px solid ${map.groundColor || '#888'}` : '',
                  }}
                  onClick={() => setSelectedMap(map.name)}
                >
                  <div className="flex flex-col items-start">
                    <span>{map.name}</span>
                    <span className="text-xs text-muted-foreground">{map.difficulty}</span>
                  </div>
                </Button>
              ))}
            </div>
            
            {/* Exibe detalhes do mapa selecionado */}
            {selectedMapObj && (
              <div 
                className="p-3 rounded-md relative" 
                style={{ 
                  backgroundColor: selectedMapObj.groundColor || '#444',
                  color: '#fff',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                }}
              >
                <h3 className="text-lg font-semibold mb-1">{selectedMapObj.name}</h3>
                <p className="text-sm mb-2">{selectedMapObj.description}</p>
                <div className="flex justify-between text-xs">
                  <div>Dificuldade: <span className="font-bold">{selectedMapObj.difficulty}</span></div>
                  <div>Densidade de Blocos: {selectedMapObj.destructibleBlockDensity * 100}%</div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Exibição dos powerups do personagem com o mapa selecionado */}
        {selectedCharacterObj && selectedMapObj && (
          <div className="mt-6 mb-4 bg-gray-200 p-3 rounded-md border border-primary border-opacity-30">
            <h3 className="text-sm font-semibold mb-2">Power-ups no Mapa {selectedMapObj.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Alcance de Bomba (+1)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Bombas Extras (+1)</span>
              </div>
            </div>
            <p className="text-xs mt-2 text-muted-foreground">Colete power-ups destruindo blocos com bombas</p>
          </div>
        )}
        
        <div className="mt-8 flex flex-col gap-2">
          <Button size="lg" style={{ cursor: 'pointer' }} onClick={handleStartGame}>
            Iniciar Jogo
          </Button>
          
          <Button variant="outline" size="lg" onClick={() => navigate('/')}  style={{ cursor: 'pointer' }}>
            Voltar
          </Button>
          
          <div className="text-center mt-4 text-sm text-muted-foreground">
            <p>Versão 2.0 — Planejando integração com Web3</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;

