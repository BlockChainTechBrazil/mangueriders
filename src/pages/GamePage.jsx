import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Box, Sphere, Plane } from '@react-three/drei'
import * as THREE from 'three'

// Componente do Personagem Principal
function Player({ position, onPositionChange, onShoot, onRotationChange, rotation }) {
  const meshRef = useRef()
  const { camera } = useThree()
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation
      // Atualizar posição da câmera para seguir o jogador
      camera.position.x = position[0]
      camera.position.y = position[1] + 10 // Elevar a câmera
      camera.position.z = position[2] + 15 // Afastar a câmera
      camera.lookAt(position[0], position[1], position[2])
    }
  })

  return (
    <group position={position}>
      {/* Corpo do personagem */}
      <Box ref={meshRef} args={[0.8, 1.2, 0.4]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#4a9eff" />
      </Box>
      {/* Cabeça */}
      <Sphere args={[0.3]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#ffdbac" />
      </Sphere>
      {/* Braços */}
      <Box args={[0.2, 0.8, 0.2]} position={[-0.6, 0.8, 0]}>
        <meshStandardMaterial color="#ffdbac" />
      </Box>
      <Box args={[0.2, 0.8, 0.2]} position={[0.6, 0.8, 0]}>
        <meshStandardMaterial color="#ffdbac" />
      </Box>
      {/* Pernas */}
      <Box args={[0.25, 0.8, 0.25]} position={[-0.25, -0.4, 0]}>
        <meshStandardMaterial color="#2c5aa0" />
      </Box>
      <Box args={[0.25, 0.8, 0.25]} position={[0.25, -0.4, 0]}>
        <meshStandardMaterial color="#2c5aa0" />
      </Box>
    </group>
  )
}

// Componente do Caranguejo (Projétil)
function Crab({ position, direction, onHit, enemies, onEnemyHit }) {
  const meshRef = useRef()
  const [currentPosition, setCurrentPosition] = useState(position)
  
  useFrame(() => {
    if (meshRef.current) {
      // Movimento do caranguejo
      const newPos = [
        currentPosition[0] + direction[0] * 0.3,
        currentPosition[1],
        currentPosition[2] + direction[2] * 0.3
      ]
      setCurrentPosition(newPos)
      meshRef.current.position.set(...newPos)
      
      // Rotação para parecer que está "caminhando"
      meshRef.current.rotation.y += 0.2
      
      // Verificar colisão com inimigos
      // Usar uma cópia para evitar modificação durante iteração
      const currentEnemies = [...enemies]
      currentEnemies.forEach(enemy => {
        if (enemy.isAlive) { // Apenas verificar inimigos vivos
          const distance = Math.sqrt(
            (newPos[0] - enemy.position[0]) ** 2 + 
            (newPos[2] - enemy.position[2]) ** 2
          )
          if (distance < 2) {
            onEnemyHit(enemy.id)
            onHit()
          }
        }
      })
      
      // Remover se sair muito longe
      if (Math.abs(newPos[0]) > 50 || Math.abs(newPos[2]) > 50) {
        onHit()
      }
    }
  })

  return (
    <group ref={meshRef} position={currentPosition}>
      {/* Corpo do caranguejo */}
      <Box args={[0.6, 0.3, 0.8]}>
        <meshStandardMaterial color="#ff6b35" />
      </Box>
      {/* Garras */}
      <Box args={[0.2, 0.2, 0.3]} position={[-0.4, 0.1, 0.3]}>
        <meshStandardMaterial color="#ff4500" />
      </Box>
      <Box args={[0.2, 0.2, 0.3]} position={[0.4, 0.1, 0.3]}>
        <meshStandardMaterial color="#ff4500" />
      </Box>
      {/* Pernas */}
      {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
        <Box key={i} args={[0.1, 0.1, 0.2]} position={[x, -0.2, 0]}>
          <meshStandardMaterial color="#cc5500" />
        </Box>
      ))}
    </group>
  )
}

// Componente do Inimigo (Empresário)
function Enemy({ position, playerPosition, onPlayerHit, isAlive }) {
  const meshRef = useRef()
  const [currentPosition, setCurrentPosition] = useState(position)
  
  useFrame(() => {
    if (meshRef.current && isAlive && playerPosition) {
      // Movimento em direção ao jogador
      const direction = [
        playerPosition[0] - currentPosition[0],
        0,
        playerPosition[2] - currentPosition[2]
      ]
      const distance = Math.sqrt(direction[0] ** 2 + direction[2] ** 2)
      
      if (distance > 1) {
        const normalizedDirection = [
          direction[0] / distance * 0.02,
          0,
          direction[2] / distance * 0.02
        ]
        
        const newPos = [
          currentPosition[0] + normalizedDirection[0],
          currentPosition[1],
          currentPosition[2] + normalizedDirection[2]
        ]
        setCurrentPosition(newPos)
        meshRef.current.position.set(...newPos)
        
        // Rotacionar para olhar para o jogador
        meshRef.current.lookAt(playerPosition[0], playerPosition[1], playerPosition[2])
      } else {
        // Se muito próximo, causar dano ao jogador
        onPlayerHit()
      }
    }
  })

  if (!isAlive) return null

  return (
    <group ref={meshRef} position={currentPosition}>
      {/* Corpo do empresário */}
      <Box args={[0.8, 1.4, 0.4]} position={[0, 0.7, 0]}>
        <meshStandardMaterial color="#2c2c2c" />
      </Box>
      {/* Cabeça */}
      <Sphere args={[0.3]} position={[0, 1.6, 0]}>
        <meshStandardMaterial color="#ffdbac" />
      </Sphere>
      {/* Gravata */}
      <Box args={[0.15, 0.6, 0.05]} position={[0, 0.9, 0.21]}>
        <meshStandardMaterial color="#cc0000" />
      </Box>
      {/* Braços */}
      <Box args={[0.2, 0.8, 0.2]} position={[-0.6, 0.9, 0]}>
        <meshStandardMaterial color="#ffdbac" />
      </Box>
      <Box args={[0.2, 0.8, 0.2]} position={[0.6, 0.9, 0]}>
        <meshStandardMaterial color="#ffdbac" />
      </Box>
      {/* Pernas */}
      <Box args={[0.25, 0.8, 0.25]} position={[-0.25, -0.1, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
      <Box args={[0.25, 0.8, 0.25]} position={[0.25, -0.1, 0]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Box>
    </group>
  )
}

// Componente do Lixo
function Trash({ position, type, onCollect, playerPosition }) {
  const meshRef = useRef()
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.003) * 0.1
      
      // Verificar proximidade com o jogador para coleta automática
      if (playerPosition) {
        const distance = Math.sqrt(
          (playerPosition[0] - position[0]) ** 2 + 
          (playerPosition[2] - position[2]) ** 2
        )
        if (distance < 1.5) {
          onCollect()
        }
      }
    }
  })

  const getTrashColor = () => {
    switch (type) {
      case 1: return '#8B4513' // Marrom - lixo orgânico
      case 2: return '#FFD700' // Dourado - lixo reciclável  
      case 3: return '#FF0000' // Vermelho - lixo tóxico
      default: return '#666666'
    }
  }

  const getTrashSize = () => {
    switch (type) {
      case 1: return [0.4, 0.4, 0.4]
      case 2: return [0.5, 0.6, 0.5]
      case 3: return [0.6, 0.3, 0.6]
      default: return [0.4, 0.4, 0.4]
    }
  }

  return (
    <group>
      <Box 
        ref={meshRef} 
        args={getTrashSize()} 
        position={position}
      >
        <meshStandardMaterial color={getTrashColor()} />
      </Box>
      {/* Indicador visual de lixo */}
      <Text
        position={[position[0], position[1] + 1, position[2]]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Lixo Nv.{type}
      </Text>
    </group>
  )
}

// Componente principal do jogo
export default function GamePage({ numEnemies }) {
  const [playerPosition, setPlayerPosition] = useState([0, 0, 0])
  const [playerRotation, setPlayerRotation] = useState(0) // 0 = para frente (eixo Z negativo)
  const [playerLives, setPlayerLives] = useState(3)
  const [score, setScore] = useState(0)
  const [crabs, setCrabs] = useState([])
  const [enemies, setEnemies] = useState(() => {
    const initialEnemies = []
    for (let i = 0; i < numEnemies; i++) {
      initialEnemies.push({
        id: i,
        position: [(Math.random() - 0.5) * 70, 0, (Math.random() - 0.5) * 70],
        isAlive: true // Adicionar estado de vida para o inimigo
      })
    }
    return initialEnemies
  })
  const [trash, setTrash] = useState(() => {
    const initialTrash = []
    for (let i = 0; i < 15; i++) { // Aumentar a quantidade de lixo
      initialTrash.push({
        id: i,
        position: [(Math.random() - 0.5) * 70, 0.5, (Math.random() - 0.5) * 70],
        type: Math.floor(Math.random() * 3) + 1
      })
    }
    return initialTrash
  })

  // Usar useMemo para garantir que as posições das árvores e plantas sejam fixas
  const mangroveTrees = useMemo(() => {
    const trees = []
    for (let i = 0; i < 25; i++) {
      const x = (Math.random() - 0.5) * 90
      const z = (Math.random() - 0.5) * 90
      const height = 3 + Math.random() * 2
      const roots = []
      for (let j = 0; j < 4 + Math.floor(Math.random() * 3); j++) {
        const angle = (j / 6) * Math.PI * 2
        const rootX = Math.cos(angle) * (1 + Math.random() * 0.5)
        const rootZ = Math.sin(angle) * (1 + Math.random() * 0.5)
        const rootHeight = 1 + Math.random() * 1.5
        roots.push({ x: rootX, z: rootZ, height: rootHeight, angle: angle, rotation: Math.random() * 0.3 - 0.15 })
      }
      trees.push({
        x, z, height, roots,
        canopySize: 1.5 + Math.random() * 0.8,
        foliage1Size: 1.2,
        foliage2Size: 1
      })
    }
    return trees
  }, [])

  const aquaticPlants = useMemo(() => {
    const plants = []
    for (let i = 0; i < 30; i++) {
      const x = (Math.random() - 0.5) * 85
      const z = (Math.random() - 0.5) * 85
      plants.push({ x, z })
    }
    return plants
  }, [])

  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)

  // Função para atirar caranguejo
  const shootCrab = useCallback(() => {
    const crabId = Date.now()
    
    // Calcular a direção do caranguejo com base na rotação do jogador
    const angle = playerRotation // A rotação do jogador é o ângulo em radianos
    const direction = [-Math.sin(angle), 0, -Math.cos(angle)] // Inverter Z para frente
    
    setCrabs(prev => [...prev, {
      id: crabId,
      position: [...playerPosition],
      direction: direction
    }])

    // Remover caranguejo após 5 segundos
    setTimeout(() => {
      setCrabs(prev => prev.filter(crab => crab.id !== crabId))
    }, 5000)
  }, [playerPosition, playerRotation])

  // Controles do teclado
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameOver || gameWon) return

      const moveSpeed = 1
      let newPosition = [...playerPosition]
      let newRotation = playerRotation

      switch (event.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          newPosition[2] -= moveSpeed
          newRotation = 0 // Virar para frente
          break
        case 'arrowdown':
        case 's':
          newPosition[2] += moveSpeed
          newRotation = Math.PI // Virar para trás
          break
        case 'arrowleft':
        case 'a':
          newPosition[0] -= moveSpeed
          newRotation = Math.PI / 2 // Virar para a esquerda
          break
        case 'arrowright':
        case 'd':
          newPosition[0] += moveSpeed
          newRotation = -Math.PI / 2 // Virar para a direita
          break
        case ' ': 
          event.preventDefault()
          shootCrab()
          break
      }

      setPlayerPosition(newPosition)
      setPlayerRotation(newRotation)

    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [playerPosition, playerRotation, gameOver, gameWon, shootCrab])

  // Função para acertar inimigo
  const hitEnemy = useCallback((enemyId) => {
    setEnemies(prev => prev.map(enemy => {
      if (enemy.id === enemyId) {
        setScore(prevScore => prevScore + 50) // Bonus por derrotar inimigo
        return { ...enemy, isAlive: false } // Marcar inimigo como não vivo
      }
      return enemy
    }))
  }, [])

  // Função para coletar lixo
  const collectTrash = useCallback((trashId, trashType) => {
    setTrash(prev => prev.filter(t => t.id !== trashId))
    
    // Pontuação baseada no tipo de lixo
    const points = trashType * 10
    setScore(prev => prev + points)

    // Verificar vitória
    if (trash.length <= 1) {
      setGameWon(true)
    }
  }, [trash.length])

  // Função para receber dano
  const takeDamage = useCallback(() => {
    setPlayerLives(prev => {
      const newLives = prev - 1
      if (newLives <= 0) {
        setGameOver(true)
      }
      return newLives
    })
  }, [])

  // Remover caranguejo quando sai de cena
  const removeCrab = useCallback((crabId) => {
    setCrabs(prev => prev.filter(crab => crab.id !== crabId))
  }, [])

  return (
    <div className="w-full h-screen bg-gradient-to-b from-sky-200 to-green-200 relative">
      {/* HUD */}
      <div className="absolute top-4 left-4 z-10 bg-gradient-to-br from-green-900/90 to-blue-900/90 text-white p-6 rounded-xl border-2 border-green-400/50 backdrop-blur-sm">
        <div className="text-xl font-bold text-green-300 mb-2 flex items-center gap-2">
          🌿 Guardião do Mangue
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-red-400">❤️</span>
            <span>Vidas: {playerLives}/3</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">⭐</span>
            <span>Pontuação: {score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-400">🗑️</span>
            <span>Lixo restante: {trash.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">👔</span>
            <span>Inimigos: {enemies.filter(e => e.isAlive).length}</span>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="absolute bottom-4 right-4 z-10 bg-gradient-to-br from-gray-900/90 to-gray-800/90 text-white p-4 rounded-xl border-2 border-gray-600/50 backdrop-blur-sm">
        <div className="text-lg font-bold text-gray-300 mb-2">🎮 Controles</div>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <span className="bg-gray-700 px-2 py-1 rounded text-xs font-mono">WASD</span>
            <span>ou</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-xs font-mono">↑↓←→</span>
            <span>Mover</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-gray-700 px-2 py-1 rounded text-xs font-mono">ESPAÇO</span>
            <span>Atirar caranguejo 🦀</span>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            💡 Colete lixo se aproximando!
          </div>
        </div>
      </div>

      {/* Tela de Game Over */}
      {gameOver && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 to-black/90 flex items-center justify-center z-20 backdrop-blur-sm">
          <div className="text-white text-center bg-red-900/50 p-8 rounded-2xl border-2 border-red-500/50">
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-5xl font-bold mb-4 text-red-300">Game Over!</h2>
            <p className="text-xl mb-2">O mangue foi destruído pelos empresários...</p>
            <p className="text-2xl mb-6 text-yellow-400">Pontuação Final: {score}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              🔄 Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Tela de Vitória */}
      {gameWon && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 to-blue-600/90 flex items-center justify-center z-20 backdrop-blur-sm">
          <div className="text-white text-center bg-green-800/50 p-8 rounded-2xl border-2 border-green-400/50">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-5xl font-bold mb-4 text-green-300">Parabéns!</h2>
            <p className="text-xl mb-2">🌿 Você salvou o mangue! 🌿</p>
            <p className="text-lg mb-2">Todos os resíduos foram coletados!</p>
            <p className="text-2xl mb-6 text-yellow-400">⭐ Pontuação Final: {score} ⭐</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-4 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              🎮 Jogar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Cena 3D */}
      <Canvas camera={{ position: [0, 10, 20], fov: 75, near: 0.1, far: 200 }}>
        {/* Iluminação atmosférica do mangue */}
        <ambientLight intensity={0.4} color="#87ceeb" />
        <directionalLight 
          position={[15, 20, 10]} 
          intensity={0.8} 
          color="#ffd700"
          castShadow
        />
        <pointLight position={[0, 15, 0]} intensity={0.3} color="#90ee90" />
        
        {/* Luz de neblina */}
        <fog attach="fog" args={['#87ceeb', 30, 100]} />

        {/* Chão do mangue - terra lodosa */}
        <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <meshStandardMaterial color="#3a2f1a" roughness={0.9} />
        </Plane>

        {/* Água do mangue - cor mais realista */}
        <Plane args={[80, 80]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
          <meshStandardMaterial color="#4a5d23" transparent opacity={0.8} roughness={0.1} />
        </Plane>

        {/* Ilhas de lama */}
        {useMemo(() => Array.from({ length: 15 }, (_, i) => {
          const x = (Math.random() - 0.5) * 60
          const z = (Math.random() - 0.5) * 60
          return (
            <Box key={`mud-${i}`} args={[2, 0.2, 2]} position={[x, -0.8, z]}>
              <meshStandardMaterial color="#2d1810" />
            </Box>
          )
        }), [])}

        {/* Pedras e troncos caídos */}
        {useMemo(() => Array.from({ length: 10 }, (_, i) => {
          const x = (Math.random() - 0.5) * 70
          const z = (Math.random() - 0.5) * 70
          const isRock = Math.random() > 0.5
          return (
            <group key={`obstacle-${i}`} position={[x, -0.5, z]}>
              {isRock ? (
                <Sphere args={[0.8]} position={[0, 0.3, 0]}>
                  <meshStandardMaterial color="#555555" roughness={0.8} />
                </Sphere>
              ) : (
                <Box args={[3, 0.4, 0.4]} rotation={[0, Math.random() * Math.PI, 0]}>
                  <meshStandardMaterial color="#8B4513" />
                </Box>
              )}
            </group>
          )
        }), [])}

        {/* Jogador */}
        <Player 
          position={playerPosition} 
          onPositionChange={setPlayerPosition}
          onShoot={shootCrab}
          onRotationChange={setPlayerRotation}
          rotation={playerRotation}
        />

        {/* Caranguejos (projéteis) */}
        {crabs.map(crab => (
          <Crab
            key={crab.id}
            position={crab.position}
            direction={crab.direction}
            onHit={() => removeCrab(crab.id)}
            enemies={enemies}
            onEnemyHit={hitEnemy}
          />
        ))}

        {/* Inimigos */}
        {enemies.map(enemy => (
          <Enemy
            key={enemy.id}
            position={enemy.position}
            playerPosition={playerPosition}
            onPlayerHit={takeDamage}
            isAlive={enemy.isAlive} // Passar o estado de vida
          />
        ))}

        {/* Lixo */}
        {trash.map(trashItem => (
          <Trash
            key={trashItem.id}
            position={trashItem.position}
            type={trashItem.type}
            onCollect={() => collectTrash(trashItem.id, trashItem.type)}
            playerPosition={playerPosition}
          />
        ))}

        {/* Árvores do mangue com raízes aéreas */}
        {mangroveTrees.map((tree, i) => (
          <group key={`mangrove-${i}`} position={[tree.x, 0, tree.z]}>
            {/* Tronco principal */}
            <Box args={[0.6, tree.height, 0.6]} position={[0, tree.height/2, 0]}>
              <meshStandardMaterial color="#654321" roughness={0.8} />
            </Box>
            
            {/* Raízes aéreas características do mangue */}
            {tree.roots.map((root, j) => (
              <Box 
                key={`root-${j}`} 
                args={[0.15, root.height, 0.15]} 
                position={[root.x, root.height/2 - 0.5, root.z]}
                rotation={[0, root.angle, root.rotation]}
              >
                <meshStandardMaterial color="#5d4037" />
              </Box>
            ))}
            
            {/* Copa da árvore */}
            <Sphere args={[tree.canopySize]} position={[0, tree.height + 1, 0]}>
              <meshStandardMaterial color="#2e7d32" roughness={0.7} />
            </Sphere>
            
            {/* Folhagem adicional */}
            <Sphere args={[tree.foliage1Size]} position={[0.8, tree.height + 0.5, 0.3]}>
              <meshStandardMaterial color="#388e3c" transparent opacity={0.8} />
            </Sphere>
            <Sphere args={[tree.foliage2Size]} position={[-0.6, tree.height + 0.8, -0.4]}>
              <meshStandardMaterial color="#43a047" transparent opacity={0.7} />
            </Sphere>
          </group>
        ))}

        {/* Plantas aquáticas e vegetação rasteira */}
        {aquaticPlants.map((plant, i) => (
          <group key={`plant-${i}`} position={[plant.x, -0.7, plant.z]}>
            <Box args={[0.1, 0.8, 0.1]} position={[0, 0.4, 0]}>
              <meshStandardMaterial color="#4caf50" />
            </Box>
            <Box args={[0.3, 0.1, 0.3]} position={[0, 0.8, 0]}>
              <meshStandardMaterial color="#66bb6a" />
            </Box>
          </group>
        ))}

        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  )
}
