import React, { useRef, useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useGLTF, Plane, Box, Sphere, Text, AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'

// Preload 3D models to avoid Suspense stalls at mount time
useGLTF.preload('/models/structures/mangrove-three3.glb')
useGLTF.preload('/models/characters/Alex.glb')
useGLTF.preload('/models/enemys/Business_Professional.glb')
useGLTF.preload('/models/enemys/Business_Professional_Walking.glb')
useGLTF.preload('/models/trash/trash.glb')
useGLTF.preload('/models/trash/trash1.glb')
useGLTF.preload('/models/trash/trash2.glb')

// Limites e regras do mapa
const MAP_LIMIT = 39 // Metade da água (80) menos margem
const MIN_ENEMY_SPAWN_DIST = 12 // Distância mínima do jogador ao spawn do inimigo
const SAFE_MARGIN = 2 // margem para spawn dentro do limite

// Componente MangroveTree
function MangroveTree({ position }) {
  const meshRef = useRef()
  
  // Carregar o modelo 3D do mangue
  const { scene: mangroveModel } = useGLTF('/models/structures/mangrove-three3.glb', true) || { scene: null }
  const mangroveClone = useMemo(() => mangroveModel ? mangroveModel.clone() : null, [mangroveModel])
  
  useFrame(() => {
    if (meshRef.current) {
      // Leve movimento de balanço no vento
      meshRef.current.rotation.z = Math.sin(Date.now() * 0.001) * 0.02
    }
  })

  return (
    <group ref={meshRef} position={position}>
      {mangroveModel ? (
        <primitive 
          object={mangroveClone} 
          scale={[1.5, 1.5, 1.5]}
        />
      ) : (
        // Fallback para formas básicas caso o modelo não carregue
        <group>
          {/* Tronco principal */}
          <Box args={[0.3, 4, 0.3]} position={[0, 2, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
          {/* Raízes aéreas */}
          {Array.from({ length: 5 }, (_, i) => {
            const angle = (i / 5) * Math.PI * 2
            const x = Math.cos(angle) * 1.2
            const z = Math.sin(angle) * 1.2
            return (
              <Box key={i} args={[0.1, 2, 0.1]} position={[x, 1, z]}>
                <meshStandardMaterial color="#654321" />
              </Box>
            )
          })}
          {/* Folhagem */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const x = Math.cos(angle) * (0.8 + Math.random() * 0.4)
            const z = Math.sin(angle) * (0.8 + Math.random() * 0.4)
            const y = 3.5 + Math.random() * 1
            return (
              <Sphere key={i} args={[0.4 + Math.random() * 0.2]} position={[x, y, z]}>
                <meshStandardMaterial color="#228B22" />
              </Sphere>
            )
          })}
        </group>
      )}
    </group>
  )
}

// Componente do Personagem Principal
function Player({ positionRef, keysRef, rotationRef, onShoot, isInvulnerable }) {
  const meshRef = useRef()
  const { camera } = useThree()

  // Carregar o modelo 3D do Alex
  const { scene: alexModel } = useGLTF('/models/characters/Alex.glb', true) || { scene: null }
  const alexClone = useMemo(() => alexModel ? alexModel.clone() : null, [alexModel])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Movimento baseado em teclas pressionadas
    const speed = 8 // unidades por segundo
    let vx = 0
    let vz = 0
    const keys = keysRef?.current || {}
    if (keys.w || keys.ArrowUp) vz -= 1
    if (keys.s || keys.ArrowDown) vz += 1
    if (keys.a || keys.ArrowLeft) vx -= 1
    if (keys.d || keys.ArrowRight) vx += 1

    // Normalizar para diagonais
    if (vx !== 0 || vz !== 0) {
      const len = Math.hypot(vx, vz)
      vx /= len
      vz /= len
      // Atualizar rotação para direção de movimento
      rotationRef.current = Math.atan2(vx, -vz) // frente = -Z
    }

    // Atualizar posição do jogador
    positionRef.current[0] += vx * speed * delta
    positionRef.current[2] += vz * speed * delta

    // Limites do mapa
    positionRef.current[0] = Math.max(-MAP_LIMIT, Math.min(MAP_LIMIT, positionRef.current[0]))
    positionRef.current[2] = Math.max(-MAP_LIMIT, Math.min(MAP_LIMIT, positionRef.current[2]))

    // Aplicar no mesh e câmera
    meshRef.current.position.set(positionRef.current[0], positionRef.current[1], positionRef.current[2])
    meshRef.current.rotation.y = rotationRef.current
    camera.position.x += (positionRef.current[0] - camera.position.x) * 0.12
    camera.position.y += ((positionRef.current[1] + 8) - camera.position.y) * 0.12
    camera.position.z += ((positionRef.current[2] + 10) - camera.position.z) * 0.12
    camera.lookAt(positionRef.current[0], positionRef.current[1], positionRef.current[2])
  })

  // Efeito visual de invulnerabilidade
  const opacity = isInvulnerable ? 0.7 : 1

  return (
    <group position={positionRef.current} ref={meshRef}>
      {alexModel ? (
        <primitive 
          object={alexClone} 
          scale={[0.8, 0.8, 0.8]} 
          rotation={[0, rotationRef.current, 0]}
          opacity={opacity}
        />
      ) : (
        // Fallback para formas básicas caso o modelo não carregue
        <group>
          {/* Corpo do personagem */}
          <Box args={[0.8, 1.2, 0.4]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color={isInvulnerable ? "#ff9e9e" : "#4a9eff"} transparent opacity={opacity} />
          </Box>
          {/* Cabeça */}
          <Sphere args={[0.3]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color="#ffdbac" transparent opacity={opacity} />
          </Sphere>
          {/* Braços */}
          <Box args={[0.2, 0.8, 0.2]} position={[-0.6, 0.8, 0]}>
            <meshStandardMaterial color="#ffdbac" transparent opacity={opacity} />
          </Box>
          <Box args={[0.2, 0.8, 0.2]} position={[0.6, 0.8, 0]}>
            <meshStandardMaterial color="#ffdbac" transparent opacity={opacity} />
          </Box>
          {/* Pernas */}
          <Box args={[0.25, 0.8, 0.25]} position={[-0.25, -0.4, 0]}>
            <meshStandardMaterial color="#2c5aa0" transparent opacity={opacity} />
          </Box>
          <Box args={[0.25, 0.8, 0.25]} position={[0.25, -0.4, 0]}>
            <meshStandardMaterial color="#2c5aa0" transparent opacity={opacity} />
          </Box>
        </group>
      )}
    </group>
  )
}

// Componente do Caranguejo (Projétil)
function Crab({ position, direction, onHit, enemies, onEnemyHit }) {
  const meshRef = useRef()
  const posRef = useRef([...position])
  const dirRef = useRef([...direction])
  const accumulator = useRef(0)

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Atualizar ~30x/seg para performance
    accumulator.current += delta
    if (accumulator.current < 1/30) return
    const step = accumulator.current
    accumulator.current = 0

    // Movimento do caranguejo
    posRef.current[0] += dirRef.current[0] * 6 * step
    posRef.current[2] += dirRef.current[2] * 6 * step
    meshRef.current.position.set(posRef.current[0], posRef.current[1], posRef.current[2])

    // Rotação para parecer que está "caminhando"
    meshRef.current.rotation.y += 0.2

    // Verificar colisão com inimigos apenas se há inimigos vivos
    const aliveEnemies = enemies.filter(enemy => enemy.isAlive)
    if (aliveEnemies.length > 0) {
      for (const enemy of aliveEnemies) {
        const dx = posRef.current[0] - enemy.position[0]
        const dz = posRef.current[2] - enemy.position[2]
        const distance = Math.sqrt(dx*dx + dz*dz)
        if (distance < 1.5) {
          onEnemyHit(enemy.id)
          onHit()
          return // Sair imediatamente após acertar
        }
      }
    }

    // Remover se sair muito longe
    if (Math.abs(posRef.current[0]) > 50 || Math.abs(posRef.current[2]) > 50) {
      onHit()
    }
  })

  return (
    <group ref={meshRef} position={posRef.current}>
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
function Enemy({ position, playerPosition, playerPosRef, onPlayerHit, isAlive }) {
  const meshRef = useRef()
  const posRef = useRef([position[0], position[1], position[2]])
  const isWalkingRef = useRef(false)
  const accumulator = useRef(0)
  const attackCooldownRef = useRef(0)
  
  // Carregar modelos 3D via Suspense (sem try/catch) e memoizar clones
  const { scene: businessModelScene } = useGLTF('/models/enemys/Business_Professional.glb', true) || { scene: null }
  const { scene: businessWalkingModelScene } = useGLTF('/models/enemys/Business_Professional_Walking.glb', true) || { scene: null }
  const businessModel = useMemo(() => businessModelScene ? businessModelScene.clone() : null, [businessModelScene])
  const businessWalkingModel = useMemo(() => businessWalkingModelScene ? businessWalkingModelScene.clone() : null, [businessWalkingModelScene])
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...posRef.current)
    }
  }, [])

  useFrame((state, delta) => {
    const ppos = playerPosRef?.current || playerPosition
    if (!meshRef.current || !isAlive || !ppos) return
    // Atualizar no máximo ~30 vezes por segundo por inimigo
    accumulator.current += delta
    if (accumulator.current < 1 / 30) return
    const step = accumulator.current
    accumulator.current = 0

    // Vetor direção até o jogador
    const dx = ppos[0] - posRef.current[0]
    const dz = ppos[2] - posRef.current[2]
    const distance = Math.sqrt(dx * dx + dz * dz)

    if (distance > 1.5) {
      isWalkingRef.current = true
      const speed = 0.9 // unidades/segundo
      const nx = dx / distance
      const nz = dz / distance
      posRef.current[0] += nx * speed * step
      posRef.current[2] += nz * speed * step
      // Clamp aos limites do mapa
      posRef.current[0] = Math.max(-MAP_LIMIT, Math.min(MAP_LIMIT, posRef.current[0]))
      posRef.current[2] = Math.max(-MAP_LIMIT, Math.min(MAP_LIMIT, posRef.current[2]))
      meshRef.current.position.set(posRef.current[0], posRef.current[1], posRef.current[2])
      // Rotacionar para olhar para o jogador
      const angle = Math.atan2(dx, dz)
      meshRef.current.rotation.y = angle
    } else {
      isWalkingRef.current = false
      // Dano com cooldown para evitar múltiplos acertos por segundo
      attackCooldownRef.current -= step
      if (attackCooldownRef.current <= 0) {
        onPlayerHit()
        attackCooldownRef.current = 1 // 1s entre ataques
      }
    }
  })

  if (!isAlive) return null

  return (
    <group ref={meshRef} position={posRef.current}>
      {/* Indicador de debug removido para performance */}
      
      {/* Usar modelo 3D se disponível, senão usar fallback SEMPRE */}
      {(isWalkingRef.current && businessWalkingModel) ? (
        <primitive 
          object={businessWalkingModel} 
          scale={[1.2, 1.2, 1.2]}
        />
      ) : businessModel ? (
        <primitive 
          object={businessModel} 
          scale={[1.2, 1.2, 1.2]}
        />
      ) : (
        // Fallback SEMPRE visível - formas básicas mais destacadas
        <group>
          {/* Corpo do empresário - mais alto e visível */}
          <Box args={[1, 1.8, 0.5]} position={[0, 0.9, 0]}>
            <meshStandardMaterial color="#1a1a1a" />
          </Box>
          {/* Cabeça */}
          <Sphere args={[0.4]} position={[0, 2, 0]}>
            <meshStandardMaterial color="#ffdbac" />
          </Sphere>
          {/* Braços */}
          <Box args={[0.3, 1, 0.3]} position={[-0.7, 1, 0]}>
            <meshStandardMaterial color="#ffdbac" />
          </Box>
          <Box args={[0.3, 1, 0.3]} position={[0.7, 1, 0]}>
            <meshStandardMaterial color="#ffdbac" />
          </Box>
          {/* Pernas */}
          <Box args={[0.3, 1, 0.3]} position={[-0.3, 0.2, 0]}>
            <meshStandardMaterial color="#1a1a1a" />
          </Box>
          <Box args={[0.3, 1, 0.3]} position={[0.3, 0.2, 0]}>
            <meshStandardMaterial color="#1a1a1a" />
          </Box>
          {/* Indicador visual adicional - chapéu */}
          <Box args={[0.6, 0.1, 0.6]} position={[0, 2.4, 0]}>
            <meshStandardMaterial color="#000000" />
          </Box>
        </group>
      )}
    </group>
  )
}

// Componente do Lixo
function Trash({ position, type, onCollect, playerPosition, playerPosRef }) {
  const meshRef = useRef()
  const frameCount = useRef(0)
  
  // Carregar os modelos 3D de lixo
  const { scene: trashModel } = useGLTF('/models/trash/trash.glb', true) || { scene: null }
  const { scene: trash1Model } = useGLTF('/models/trash/trash1.glb', true) || { scene: null }
  const { scene: trash2Model } = useGLTF('/models/trash/trash2.glb', true) || { scene: null }
  const trashClone = useMemo(() => trashModel ? trashModel.clone() : null, [trashModel])
  const trash1Clone = useMemo(() => trash1Model ? trash1Model.clone() : null, [trash1Model])
  const trash2Clone = useMemo(() => trash2Model ? trash2Model.clone() : null, [trash2Model])
  
  useFrame(() => {
    if (!meshRef.current) return
    
    // Reduzir frequência de cálculos para melhor performance
    frameCount.current++
    if (frameCount.current % 3 !== 0) return // Executar a cada 3 frames
    
    // Verificar proximidade com o jogador para coleta automática
    const ppos = playerPosRef?.current || playerPosition
    if (ppos) {
      const distance = Math.sqrt(
        (ppos[0] - position[0]) ** 2 + 
        (ppos[2] - position[2]) ** 2
      )
      if (distance < 1.5) {
        onCollect()
      }
    }
  })

  // Selecionar o modelo 3D com base no tipo de lixo
  const getTrashModel = () => {
    switch (type) {
      case 1: return trashClone // Primeiro estágio
      case 2: return trash1Clone // Segundo estágio
      case 3: return trash2Clone // Terceiro estágio (mais lixo)
      default: return null
    }
  }

  const selectedModel = getTrashModel()

  return (
    <group ref={meshRef} position={position}>
      {/* Indicador visual do nível do lixo */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Nível {type}
      </Text>
      
      {selectedModel ? (
        <primitive 
          object={selectedModel} 
          scale={[0.8, 0.8, 0.8]}
        />
      ) : (
        // Fallback para formas básicas caso os modelos não carreguem
        <Box args={getTrashSize(type)}>
          <meshStandardMaterial color={getTrashColor(type)} />
        </Box>
      )}
      {/* Indicador visual de lixo */}
      <Text
        position={[0, 1.5, 0]}
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

// Funções auxiliares para o fallback
const getTrashSize = (type) => {
  switch (type) {
    case 1: return [0.4, 0.2, 0.4] // Menor para o primeiro estágio
    case 2: return [0.5, 0.25, 0.5] // Médio para o segundo estágio
    case 3: return [0.6, 0.3, 0.6] // Maior para o terceiro estágio
    default: return [0.5, 0.25, 0.5]
  }
}

const getTrashColor = (type) => {
  switch (type) {
    case 1: return '#8B4513' // Marrom para o primeiro estágio
    case 2: return '#FFD700' // Dourado para o segundo estágio
    case 3: return '#FF0000' // Vermelho para o terceiro estágio
    default: return '#FFFFFF'
  }
}

// Componente principal do jogo
export default function GamePage({ numEnemies }) {
  // Refs para posição/rotação do jogador (evitar re-render por frame)
  const playerPosRef = useRef([0, 0, 0])
  const rotationRef = useRef(0)
  const [playerPosition, setPlayerPosition] = useState([0, 0, 0])
  const [playerRotation, setPlayerRotation] = useState(0) // mantido apenas para HUD/compatibilidade se necessário
  const [playerLives, setPlayerLives] = useState(3)
  const [isInvulnerable, setIsInvulnerable] = useState(false) // Estado de invulnerabilidade
  const [score, setScore] = useState(0)
  const [crabs, setCrabs] = useState([])
  const [enemies, setEnemies] = useState(() => {
    const initialEnemies = []
    const rand = () => -MAP_LIMIT + SAFE_MARGIN + Math.random() * ((MAP_LIMIT - SAFE_MARGIN) * 2)
    const px = playerPosRef.current[0]
    const pz = playerPosRef.current[2]
    for (let i = 0; i < numEnemies; i++) {
      let x = rand(), z = rand(), attempts = 0
      // Garantir spawn longe do jogador
      while (Math.hypot(x - px, z - pz) < MIN_ENEMY_SPAWN_DIST && attempts < 15) {
        x = rand(); z = rand(); attempts++
      }
      initialEnemies.push({
        id: i,
        position: [x, 0, z],
        isAlive: true
      })
    }
    return initialEnemies
  })
  const [trash, setTrash] = useState(() => {
    const initialTrash = []
    const rand = () => -MAP_LIMIT + SAFE_MARGIN + Math.random() * ((MAP_LIMIT - SAFE_MARGIN) * 2)
    for (let i = 0; i < 15; i++) { // Quantidade de lixo
      initialTrash.push({
        id: i,
        position: [rand(), 0.5, rand()],
        type: 3
      })
    }
    return initialTrash
  })

  // Usar useMemo para garantir que as posições das árvores e plantas sejam fixas
  const mangroveTrees = useMemo(() => {
    const trees = []
    for (let i = 0; i < 15; i++) { // Reduzir de 25 para 15 árvores para melhor performance
      const x = (Math.random() - 0.5) * 90
      const z = (Math.random() - 0.5) * 90
      const height = 3 + Math.random() * 2
      const roots = []
      for (let j = 0; j < 3 + Math.floor(Math.random() * 2); j++) { // Reduzir raízes
        const angle = (j / 5) * Math.PI * 2
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
    for (let i = 0; i < 20; i++) { // Reduzir de 30 para 20 plantas
      const x = (Math.random() - 0.5) * 85
      const z = (Math.random() - 0.5) * 85
      plants.push({ x, z })
    }
    return plants
  }, [])

  // Memoizar obstáculos para evitar recriação
  const obstacles = useMemo(() => {
    const mudIslands = Array.from({ length: 10 }, (_, i) => { // Reduzir de 15 para 10
      const x = (Math.random() - 0.5) * 60
      const z = (Math.random() - 0.5) * 60
      return { type: 'mud', x, z, key: `mud-${i}` }
    })
    
    const rocksAndLogs = Array.from({ length: 8 }, (_, i) => { // Reduzir de 10 para 8
      const x = (Math.random() - 0.5) * 70
      const z = (Math.random() - 0.5) * 70
      const isRock = Math.random() > 0.5
      return { type: isRock ? 'rock' : 'log', x, z, key: `obstacle-${i}`, rotation: Math.random() * Math.PI }
    })
    
    return [...mudIslands, ...rocksAndLogs]
  }, [])

  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)

  // Função para atirar caranguejo
  const shootCrab = useCallback(() => {
    const crabId = Date.now()
    
    // Calcular a direção do caranguejo com base na rotação do jogador
    const angle = rotationRef.current // rotação atual
    const direction = [-Math.sin(angle), 0, -Math.cos(angle)] // Inverter Z para frente
    
    setCrabs(prev => [...prev, {
      id: crabId,
      position: [...playerPosRef.current],
      direction: direction
    }])

    // Remover caranguejo após 5 segundos
    setTimeout(() => {
      setCrabs(prev => prev.filter(crab => crab.id !== crabId))
    }, 5000)
  }, [])

  // Controles do teclado (keydown/keyup) sem re-render em cada pressão
  const keysRef = useRef({ w: false, a: false, s: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false })
  useEffect(() => {
    const down = (event) => {
      if (gameOver || gameWon) return
      const k = event.key
      if (['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(k)) {
        event.preventDefault()
      }
      if (k === ' ') {
        shootCrab()
        return
      }
      if (keysRef.current.hasOwnProperty(k)) keysRef.current[k] = true
    }
    const up = (event) => {
      const k = event.key
      if (keysRef.current.hasOwnProperty(k)) keysRef.current[k] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [gameOver, gameWon, shootCrab])

  // Atualizar estados visíveis no HUD de forma suave (throttle)
  useEffect(() => {
    const id = setInterval(() => {
      setPlayerPosition([...playerPosRef.current])
      setPlayerRotation(rotationRef.current)
    }, 100) // 10x por segundo para reduzir renders
    return () => clearInterval(id)
  }, [])

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
  const collectTrash = useCallback((trashId) => {
    setTrash(prev => prev.map(t => {
      if (t.id === trashId) {
        // Reduzir o tipo de lixo (estágio) em 1
        const newType = t.type - 1;
        
        // Pontuação por cada estágio de limpeza
        setScore(prev => prev + 10);
        
        // Se chegou ao estágio 0, remover o lixo completamente
        if (newType <= 0) {
          return null; // Será filtrado abaixo
        }
        
        // Caso contrário, atualizar para o próximo estágio
        return { ...t, type: newType };
      }
      return t;
    }).filter(Boolean)); // Remover itens null (lixo completamente coletado)
    
    // Verificar vitória
    if (trash.length <= 1) {
      setGameWon(true);
    }
  }, [trash.length]);

  // Função para receber dano
  const takeDamage = useCallback(() => {
    // Verificar se o jogador está invulnerável
    if (isInvulnerable) return;
    
    // Reduzir vida e ativar invulnerabilidade
    setPlayerLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameOver(true);
      }
      return newLives;
    });
    
    // Ativar invulnerabilidade temporária
    setIsInvulnerable(true);
    setTimeout(() => {
      setIsInvulnerable(false);
    }, 2000); // 2 segundos de invulnerabilidade
  }, [isInvulnerable]);

  // Remover caranguejo quando sai de cena
  const removeCrab = useCallback((crabId) => {
    setCrabs(prev => prev.filter(crab => crab.id !== crabId))
  }, [])

  return (
    <div className="w-full h-screen bg-gradient-to-b from-sky-200 to-green-200 relative overflow-hidden">
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
      <Canvas 
        camera={{ position: [0, 10, 20], fov: 75, near: 0.1, far: 200 }}
        performance={{ min: 0.3 }} // Configuração de performance mais conservadora
        dpr={[1, 1.2]} // Limitar pixel ratio ainda mais para evitar travamentos
      >
        {/* Iluminação atmosférica do mangue - mais clara */}
        <ambientLight intensity={0.6} color="#cfe8ff" />
        <directionalLight 
          position={[15, 20, 10]} 
          intensity={0.8} 
          color="#ffd700"
          castShadow={false} // Desabilitar sombras para melhor performance
        />
        <pointLight position={[0, 15, 0]} intensity={0.3} color="#90ee90" />
        
        {/* Neblina desativada para reduzir fill-rate e travamentos */}
        {/* <fog attach="fog" args={['#87ceeb', 30, 100]} /> */}

        {/* Chão do mangue - terra mais clara e contrastante */}
        <Plane args={[100, 100]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <meshStandardMaterial color="#7b6a57" roughness={0.8} />
        </Plane>

        {/* Água do mangue - cor azul-esverdeada como mar */}
        <Plane args={[80, 80]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]}>
          <meshStandardMaterial color="#4682B4" transparent opacity={0.7} roughness={0.1} />
        </Plane>

        {/* Paredes do mapa (visuais e indicativas de limite) */}
        <group>
          {/* Norte (z +) */}
          <Box args={[MAP_LIMIT * 2 + 2, 3, 0.8]} position={[0, 1.2, MAP_LIMIT + 1]}>
            <meshStandardMaterial color="#2d1810" />
          </Box>
          {/* Sul (z -) */}
          <Box args={[MAP_LIMIT * 2 + 2, 3, 0.8]} position={[0, 1.2, -MAP_LIMIT - 1]}>
            <meshStandardMaterial color="#2d1810" />
          </Box>
          {/* Leste (x +) */}
          <Box args={[0.8, 3, MAP_LIMIT * 2 + 2]} position={[MAP_LIMIT + 1, 1.2, 0]}>
            <meshStandardMaterial color="#2d1810" />
          </Box>
          {/* Oeste (x -) */}
          <Box args={[0.8, 3, MAP_LIMIT * 2 + 2]} position={[-MAP_LIMIT - 1, 1.2, 0]}>
            <meshStandardMaterial color="#2d1810" />
          </Box>
        </group>

        {/* Obstáculos otimizados */}
        {obstacles.map(obstacle => (
          <group key={obstacle.key} position={[obstacle.x, -0.5, obstacle.z]}>
            {obstacle.type === 'mud' ? (
              <Box args={[2, 0.2, 2]} position={[0, -0.3, 0]}>
                <meshStandardMaterial color="#2d1810" />
              </Box>
            ) : obstacle.type === 'rock' ? (
              <Sphere args={[0.8]} position={[0, 0.3, 0]}>
                <meshStandardMaterial color="#555555" roughness={0.8} />
              </Sphere>
            ) : (
              <Box args={[3, 0.4, 0.4]} rotation={[0, obstacle.rotation, 0]}>
                <meshStandardMaterial color="#8B4513" />
              </Box>
            )}
          </group>
        ))}

        {/* Jogador */}
        <Player 
          positionRef={playerPosRef}
          keysRef={keysRef}
          rotationRef={rotationRef}
          onShoot={shootCrab}
          isInvulnerable={isInvulnerable}
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

        {/* Inimigos: envolver em Suspense para carregamento dos modelos */}
        <Suspense fallback={null}>
          {enemies.map(enemy => (
            <Enemy
              key={enemy.id}
              position={enemy.position}
              playerPosition={playerPosition}
              playerPosRef={playerPosRef}
              onPlayerHit={takeDamage}
              isAlive={enemy.isAlive}
            />
          ))}
        </Suspense>

        {/* Lixo: envolver em Suspense para carregamento dos modelos */}
        <Suspense fallback={null}>
          {trash.map(trashItem => (
            <Trash
              key={trashItem.id}
              position={trashItem.position}
              type={trashItem.type}
              onCollect={() => collectTrash(trashItem.id, trashItem.type)}
              playerPosition={playerPosition}
              playerPosRef={playerPosRef}
            />
          ))}
        </Suspense>

        {/* Árvores do mangue com modelo 3D */}
        {mangroveTrees.map((tree, i) => (
          <MangroveTree 
            key={`mangrove-${i}`} 
            position={[tree.x, 0, tree.z]} 
          />
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
        <AdaptiveDpr minPixelRatio={0.7} />
        <PerformanceMonitor />
      </Canvas>
    </div>
  )
}
