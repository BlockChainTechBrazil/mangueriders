🧨 Game Design Document (GDD) — MangueRiders

---

Última Atualização: 8 de setembro de 2025
Autor: [Você]
Versão: 3.0 — Adaptação para tema ambiental com CrabCoin

---

📌 1. Visão Geral

Nome do Jogo: MangueRiders
Gênero: Ação Ambiental, Coleta e Limpeza, Aventura com NFTs opcionais
Estilo Visual: 3D realista com elementos cartunescos (usando Three.js e bibliotecas 3D)
Engine: React + Three.js + @react-three/fiber
Distribuição: Web (PWA), com foco em educação ambiental

---

🎯 2. Objetivo Principal

O jogador controla Manguito, um herói ambiental que limpa o mangue de Recife de lixo jogado por empresários gananciosos. Durante a limpeza, coleta lixo (latinhas, garrafas), encontra crabs que dão moedas, e ganha CrabCoin para evoluir e comprar itens.

Mecânicas principais:

Coleta de lixo com aspirador ou rede

Encontro de crabs raros que dão recompensas

Sistema de economia com CrabCoin

Limpeza progressiva do mangue para desbloquear áreas

Educação ambiental integrada ao gameplay

---

� 3. História e Universo

🌍 Sinopse

Em Recife, o manguezal está sendo destruído pela poluição causada por empresários sem escrúpulos que jogam lixo indiscriminadamente. Manguito, um jovem ativista ambiental, decide agir. Equipado com um aspirador high-tech ou uma rede mágica, ele parte para limpar o mangue, coletar lixo e restaurar o ecossistema.

Durante sua jornada, encontra crabs misteriosos que guardam segredos antigos do mangue. Cada crab coletado dá moedas especiais (CrabCoin), que podem ser usadas para melhorar equipamentos ou comprar NFTs únicos.

👾 Antagonista

Os empresários poluentes, representados como vilões corporativos que continuam jogando lixo no mangue, criando obstáculos e inimigos para Manguito.

---

👤 4. Personagem Jogável

Nome: Manguito
Habilidade: Aspirador de lixo ou rede coletora
Personalidade: Determinado, amigável, apaixonado pela natureza

Manguito pode evoluir seu equipamento com CrabCoin, desbloqueando novos poderes como velocidade aumentada ou capacidade de coleta maior.

---

� 5. Crabs e Recompensas

Os crabs são criaturas especiais encontradas no mangue. Cada tipo dá uma quantidade diferente de CrabCoin:

Nome	Tipo	Recompensa	Especial

Crab Comum	Comum	1 CrabCoin	Nenhum
Crab Dourado	Raro	5 CrabCoin	+ velocidade temporária
Crab Rei	Lendário	10 CrabCoin	+ capacidade de bolsa

Crabs aparecem aleatoriamente durante a limpeza.

---

💰 6. Sistema de Economia (CrabCoin)

CrabCoin é a moeda do jogo, ganha através de:

Coleta de lixo: 0.1 CrabCoin por item
Encontro de crabs: 1-10 CrabCoin dependendo do tipo
Missões diárias: Recompensas extras

Usado para:

Comprar upgrades para o aspirador/rede
Desbloquear skins para Manguito
Comprar NFTs ambientais

---

�️ 7. Lixo e Coleta

Tipos de lixo:

Latinhas: Fáceis de coletar, 0.1 CrabCoin
Garrafas: Médias, 0.2 CrabCoin
Lixo tóxico: Difíceis, 0.5 CrabCoin, mas perigosos

O jogador usa o aspirador para sugar o lixo ou a rede para capturar. Bolsas têm limite de capacidade.

---

🌍 7. Mapas e Fases

Região	Características Principais

Mangue de Recife	Áreas poluídas com lixo espalhado, raízes e água
Rio poluído	Obstáculos flutuantes como lixo, correntezas
Floresta de Mangue	Árvores e raízes como barreiras, esconderijos de crabs
Praia poluída	Areia com lixo enterrado, ondas
Arena de Limpeza (PvP)	Simétrica, cheia de lixo e desafios ambientais

🌌 Portais Secretos

Áreas limpas desbloqueiam portais para crabs lendários

Chefes: Empresários gigantes que jogam lixo

---

👾 8. Inimigos

Nome	Comportamento	Observações

Poluidor	Anda jogando lixo	Deixa rastro de lixo, mini-chefe
Drone Poluente	Persegue por radar	Rápido, mas frágil
Lixo Vivo	Move-se aleatoriamente, explode se não coletado	Solta loot raro
Slime Tóxico	Libera nuvem que desativa equipamentos	Apenas em áreas poluídas

---

🎮 9. Modos de Jogo

Modo	Descrição

Campanha Solo	Narrativa de limpeza progressiva do mangue
Coop Local	Até 2 jogadores limpando juntos
Arena PvP	Duelo de limpeza com ranking e skins NFT como prêmio
Arena Eco	PvP com foco em sustentabilidade (opcional)
Fase Infinita	Limpe o máximo possível com leaderboard

---

🌐 10. NFTs e Economia (Opcional)

NFTs de crabs raros e itens ambientais

Sistema de evolução com CrabCoin → recompensa com NFT visual

Arena PvP com foco em limpeza via MetaMask/WalletConnect

Marketplace interno para itens ecológicos

Loot boxes com skins ambientais (sem pay-to-win)

---

🛠 11. Tecnologias

Front-end: React, Three.js, @react-three/fiber, Zustand

Assets/Arte: Modelos 3D de mangue, lixo, crabs gerados por IA

Animações: React Spring, Drei

Blockchain: Polygon ou Solana para CrabCoin

Carteiras: MetaMask, WalletConnect

Servidor: Firebase para multiplayer

---

🗺️ 12. Roadmap

✅ Etapa 1 – Protótipo

Cena 3D básica do mangue

Controles de Manguito

Sistema de coleta simples

🧪 Etapa 2 – MVP Jogável

Múltiplos tipos de lixo e crabs

Sistema de CrabCoin

Modo PvP local e mapa interativo

Interface e HUD + menu dinâmico

🔗 Etapa 3 – Multiplayer + Web3

Conexão com carteiras cripto

PvP online com ranking

Lançamento de NFTs ambientais

Eventos sazonais de limpeza

Marketplace + eventos sazonais