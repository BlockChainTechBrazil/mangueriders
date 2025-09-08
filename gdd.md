🧨 Game Design Document (GDD) — BombRider

---

Última Atualização: 4 de junho de 2025
Autor: [Você]
Versão: 2.0 — Planejando integração com Web3 e adaptação transmídia

---

📌 1. Visão Geral

Nome do Jogo: BombRider
Gênero: Ação Estratégica, Multiplayer, Aventura com NFTs opcionais
Estilo Visual: Cartunesco 3D isométrico (com assets gerados por IA + pixel stylized FX)
Engine: React + Three.js + @react-three/fiber
Distribuição: Web (PWA), builds para desktop com Electron e futuro mobile com Capacitor

---

🎯 2. Objetivo Principal

O jogador controla um Rider aventureiro em um mundo fragmentado, devendo explorar mapas perigosos, encontrar ovos de dinossauro, e usar bombas para derrotar inimigos e dominar arenas.

Mecânicas principais:

Posicionamento estratégico de bombas no estilo clássico (grid-based)

Exploração de mapas e coleta de ovos de dinossauros

Evolução dos dinos com o tempo de uso (vida extra e habilidades bônus)

Coleção de skins raras e NFTs opcionais

PvP local/online com apostas em tokens

---

🦖 3. História e Universo

🌍 Sinopse

Num futuro colapsado, onde a ciência e a magia colidiram, portais do tempo abriram rachaduras na realidade, trazendo de volta espécies extintas. A civilização caiu. Agora, os Riders, sobreviventes com poderes elementares, lutam para restaurar a ordem em um mundo dominado por relíquias do passado — os Dinossauros.

Guiado por uma entidade misteriosa chamada Kora, você viaja entre ruínas, florestas e desertos radioativos em busca dos ovos mágicos. Esses dinossauros não são comuns: possuem laços com os antigos elementos e podem alterar o rumo de uma batalha.

👾 Antagonista

Um tirano interdimensional conhecido como Dr. Nexx deseja capturar todos os dinossauros para criar um exército de clones biomecânicos e tomar o controle dos portais do tempo.

---

👤 4. Personagens Jogáveis

Nome	Elemento	Habilidade Passiva	Personalidade

Aria	Ar	Velocidade +	Rebelde e veloz
Bront	Terra	Reduz knockback	Paciente e forte
Kiro	Fogo	Aumenta alcance	Intenso e explosivo
Lume	Éter	Inicia com 2 bombas	Místico e enigmático
Zunn	Água	Atravessa água	Serene e precisa

Cada Rider pode montar qualquer dino.

Skins alternativas podem ser NFTs (sem afetar jogabilidade).

---

🦖 5. Dinossauros

Os dinossauros não são montarias padrão. São descobertos nos mapas dentro de ovos. Ao serem ativados, dão vida extra, força e poderes especiais.
Eles evoluem conforme o uso (batalhas, tempo montado).

Nome	Tipo	Habilidade Especial Inicial	Evolução

Raptorix	Velocidade	Aumenta velocidade do Rider	Pode atravessar blocos
TriceraBoom	Defesa	Protege contra 1 explosão extra	Reflete explosões
Flameodon	Ataque	Fogo extra nas bombas	Cria explosões em cruz
Aqualux	Suporte	Pode atravessar água sem perder bomba	Escudo aquático temporário
Aerozard	Mobilidade	Pulo curto por cima de bombas	Dash aéreo curto
T-Rexon	Força	Empurra blocos/bombas	Destrói blocos frágeis ao contato

Raros: aparecem em fases especiais, são colecionáveis.

Skins raras = cosméticos NFT.

---

💣 6. Power-Ups (Estilo Super Bomberman)

Ícone	Nome	Efeito

💣	Bomb Up	+1 bomba simultânea
🔥	Fire Up	+1 de alcance de explosão
🏃‍♂️	Speed Up	+ velocidade do jogador
🛡️	Full Armor	Invulnerabilidade curta após dano
💫	Remote Bomb	Detona bomba manualmente
💨	Kick	Chuta bomba pela linha
🌀	Pass	Atravesse bombas sem colisão
🎲	Randomizer	Pode ser efeito positivo ou negativo

---

🌍 7. Mapas e Fases

Região	Características Principais

Floresta Pré-Histórica	Grama oculta bombas, ovos escondidos
Caverna do Eco	Som reverbera bombas (detona em delay)
Deserto Atômico	Tempestades de areia reduzem visão temporariamente
Pântano Mutante	Slimes e terreno escorregadio
Arena do Tempo (PvP)	Simétrica, cheia de armadilhas e efeitos climáticos

🌌 Portais Secretos

Só abertos com dinossauros evoluídos

Chefes secretos e recompensas lendárias

---

👾 8. Inimigos

Nome	Comportamento	Observações

Dino Sombrio	Imita seus movimentos	Mini-chefe
Drone do Nexx	Persegue por radar	Rápido, mas frágil
Bomba-Viva	Anda aleatoriamente e explode	Solta loot raro às vezes
Slime Tóxico	Libera nuvem que desativa power-ups	Apenas em pântano

---

🎮 9. Modos de Jogo

Modo	Descrição

Campanha Solo	Narrativa com progressão e exploração de fases
Coop Local	Até 2 jogadores na mesma tela
Arena PvP	Duelo com ranking e skins NFT como prêmio
Arena Cripto	PvP com apostas usando tokens (opcional)
Fase Infinita	Sobreviva o maior tempo possível com leaderboard

---

🌐 10. NFTs e Economia (Opcional)

Skins de Riders e dinossauros como NFTs

Sistema de evolução → recompensa com NFT visual

Arena PvP com apostas via MetaMask/WalletConnect

Marketplace interno e crafting de ovos raros

Loot boxes cosméticas (sem pay-to-win)

---

🛠 11. Tecnologias

Front-end: React, Three.js, @react-three/fiber, Zustand

Assets/Arte: Piskel, DALL·E, Leonardo AI, PBR com stylization

Animações: React Spring, Drei, Mixamo

Blockchain: Polygon ou Solana (via smart contracts)

Carteiras: MetaMask, WalletConnect (etapa 3)

Servidor futuro: Firebase + WebSockets (PvP Online)

---

🗺️ 12. Roadmap

✅ Etapa 1 – Protótipo

Grid, bombas, power-ups clássicos

1 mapa com ovos escondidos

Movimentação fluida com colisões

🧪 Etapa 2 – MVP Jogável

Múltiplos personagens e dinossauros

Sistema de evolução de dinossauros

Modo PvP local e mapa interativo

Interface e HUD + menu dinâmico

🔗 Etapa 3 – Multiplayer + Web3

Conexão com carteiras cripto

PvP online com ranking e tokens

Lançamento de NFTs cosméticos

Marketplace + eventos sazonais