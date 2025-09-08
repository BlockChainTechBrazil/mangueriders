import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ui/ToastProvider';
import Spinner from '../components/ui/Spinner';
import { useNavigate } from 'react-router-dom';
import { NFT } from '../services/nftService';
import { useWallet } from "@/context/WalletContext";
// Modal de Mint removido definitivamente
import ipfsMetadataService from '../services/ipfsMetadataService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

// Importação do sistema de gerenciamento de imagens
// @ts-ignore - JS module typed via local d.ts
import { gameImages } from '../utils/imageManager';

// Interfaces para tipos
interface NFTCardProps {
  nft: NFT;
  onEquip: (nft: NFT) => void;
  onView: (nft: NFT) => void;
}

interface NFTProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  onView: (product: Product) => void;
  onBuyWithETH: (product: Product) => void;
}

interface Product {
  id: string;
  name: string;
  type: string;
  element: string;
  rarity: string;
  description: string;
  image: string;
  price: number;
  category: string;
  attributes: {
    [key: string]: string;
  };
}

// Criamos uma interface separada que combina os campos necessários de ambos NFT e Product
interface SelectedNFT {
  id?: string;
  firestoreId?: string;
  name?: string;
  type?: string;
  element?: string;
  rarity?: string;
  description?: string;
  image?: string;
  price?: number;
  value?: number;
  action?: 'buy' | 'view';
  category?: string;
  attributes?: { [key: string]: string | number };
  createdAt?: number;
  isEquipped?: boolean;
}

interface NFTStats {
  total: number;
  byRarity?: {
    [key: string]: number;
  };
  byType?: {
    [key: string]: number;
  };
  totalValue: number; equipped: number;
}

// Interface para categorias de NFT
interface NFTCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

// Componente para exibir um NFT à venda
const NFTProductCard: React.FC<NFTProductCardProps> = ({ product, onBuy, onView, onBuyWithETH }) => {
  // Badges de raridade com cores específicas para cada nível
  const rarityBadges: { [key: string]: string } = {
    common: 'bg-gray-100 text-gray-800',
    rare: 'bg-blue-100 text-blue-800',
    epic: 'bg-purple-100 text-purple-800',
    legendary: 'bg-yellow-100 text-yellow-800',
    mythic: 'bg-red-100 text-red-800'
  };

  // emojis removidos (não utilizados)

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-lg transform transition-all duration-300 hover:scale-105 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-60"></div>

      {/* Imagem */}
      <div className="h-48 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Badge de raridade */}
      <div className="absolute top-4 right-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${rarityBadges[product.rarity]}`}>
          {product.rarity.toUpperCase()}
        </span>
      </div>

      <div className="p-6 relative z-10">
        <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Atributos */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {Object.entries(product.attributes).map(([key, value]) => (
            <div key={key} className="bg-gray-800/60 border border-gray-700 p-2 rounded-md">
              <span className="text-xs text-gray-300 block capitalize">{key}</span>
              <span className="font-medium text-white">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="mr-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">                    <span className="text-black font-bold text-xs">RC</span>
            </div>
            <span className="text-xl font-bold">{product.price}</span>
          </div>
          <span className="text-xs text-gray-400">Edição limitada</span>
        </div>        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => onBuy(product)}
            className="flex-1 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg font-bold text-xs transition-all"
          >
            💰 Rider COIN
          </button>
          <button
            onClick={() => onBuyWithETH(product)}
            className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg font-bold text-xs transition-all"
          >
            ⚡ 0.001 ETH
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => onView(product)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold text-sm transition-all"
          >
            👁️ Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para exibir um NFT que o jogador já possui
const NFTCard: React.FC<NFTCardProps> = ({ nft, onEquip, onView }) => {
  const rarityColors: { [key: string]: string } = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500',
    mythic: 'from-pink-400 to-red-500'
  };

  const rarityEmojis: { [key: string]: string } = {
    common: '⚪',
    rare: '🔵',
    epic: '🟣',
    legendary: '🟡',
    mythic: '🔴'
  };

  const typeEmojis: { [key: string]: string } = {
    dino_egg: '🥚',
    rider_skin: '🎨',
    power_crystal: '💎',
    artifact: '🏺'
  };

  return (
    <div className={`
      relative bg-gradient-to-br ${rarityColors[nft.rarity]}
      rounded-2xl p-6 text-white transform transition-all duration-300
      hover:scale-105 hover:shadow-2xl cursor-pointer
      ${nft.isEquipped ? 'ring-4 ring-yellow-400' : ''}
    `}>
      {nft.isEquipped && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-yellow-900 font-bold text-sm">✓</span>
        </div>
      )}

      <div className="text-center">
        <div className="text-6xl mb-4">
          {typeEmojis[nft.type] || '🎁'}
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">{rarityEmojis[nft.rarity]}</span>
          <h3 className="text-xl font-bold">{nft.name}</h3>
        </div>

        <p className="text-sm opacity-90 mb-4 capitalize">
          {nft.rarity} • {nft.category}
        </p>

        <p className="text-xs opacity-80 mb-4 line-clamp-2">
          {nft.description}
        </p>

        <div className="bg-black/30 rounded-lg p-3 mb-4">
          <div className="text-xs space-y-1">
            {Object.entries(nft.attributes).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize text-gray-200">{key}</span>
                <span className="font-semibold">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={() => onEquip(nft)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${nft.isEquipped ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {nft.isEquipped ? 'Desequipar' : 'Equipar'}
          </button>
          <button
            onClick={() => onView(nft)}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold text-sm transition-all"
          >
            👁️ Detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

// Seção informativa (separada do NFTCard)
const NFTInfoSection: React.FC = () => (
  <div className="bg-gray-900 bg-opacity-75 p-6 rounded-2xl mb-8 border border-yellow-600 border-opacity-30">
    <h2 className="text-2xl font-bold mb-4 text-yellow-400">Como Funcionam NFTs no BombRider</h2>

    <div className="space-y-4 text-gray-100">
      <p>
        Em BombRider, <span className="text-yellow-300 font-bold">os personagens principais (Riders) não são NFTs</span> - eles são parte do jogo base
        para garantir que todos os jogadores tenham acesso ao conteúdo essencial. Em vez disso, nossos NFTs focam em conteúdo colecionável e aprimoramentos.
      </p>

      <h3 className="text-lg font-semibold text-yellow-300 mt-4">O que são os NFTs de BombRider?</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><span className="font-bold">Dinos colecionáveis:</span> Companheiros que acompanham seu Rider em batalha com bônus e habilidades especiais</li>
        <li><span className="font-bold">Skins para Dinos:</span> Visuais únicos que personalizam a aparência do seu Dino</li>
        <li><span className="font-bold">Acessórios:</span> Itens equipáveis para personalizar tanto Riders quanto Dinos</li>
        <li><span className="font-bold">Itens especiais:</span> Power-ups raros e outros coletáveis que elevam sua experiência de jogo</li>
      </ul>

      <h3 className="text-lg font-semibold text-yellow-300 mt-4">Como adquirir NFTs:</h3>
      <ol className="list-decimal pl-5 space-y-2">
        <li><span className="font-bold">Usando Rider COIN</span> - Nossa moeda do jogo que pode ser obtida jogando</li>
        <li><span className="font-bold">Processo de Mint</span> - Quando disponível, você poderá criar um NFT usando sua carteira de criptomoedas</li>
        <li><span className="font-bold">Marketplace</span> - Compre e venda diretamente com outros jogadores (em breve)</li>
      </ol>
    </div>

    <div className="mt-6 bg-yellow-900 bg-opacity-30 p-4 rounded-lg">
      <h3 className="font-semibold flex items-center text-yellow-300">
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
        </svg>
        O processo de Minting
      </h3>
      <p className="mt-2 text-sm">
        Quando a integração blockchain estiver completa, você poderá mintar NFTs diretamente no jogo.
        O processo começa com a compra usando Rider COIN, seguido pela criação na blockchain
        (cobrando apenas uma pequena taxa de gas). Os NFTs serão compatíveis com padrões ERC-721/ERC-1155
        e poderão ser comercializados em marketplaces populares.
      </p>
    </div>
  </div>
);

const NFTInventory: React.FC = () => {
  const navigate = useNavigate();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [stats, setStats] = useState<NFTStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNFT, setSelectedNFT] = useState<SelectedNFT | null>(null);
  const [playerBalance, setPlayerBalance] = useState<number>(500);
  const [activeTab, setActiveTab] = useState<string>('store');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  // Adicionando os estados para compra com ETH
  const [isContractModalOpen, setIsContractModalOpen] = useState<boolean>(false);
  const [isCreatingContract, setIsCreatingContract] = useState<boolean>(false);
  const [contractCreationError, setContractCreationError] = useState<string | null>(null);
  const [selectedNFTForBlockchain, setSelectedNFTForBlockchain] = useState<Product | null>(null);

  // Modal de mint removido: o mint ocorre somente via compra do item (ETH)

  // Inserindo a seção de contexto da wallet
  const { isConnected, walletAddress, balance, networkName, isCorrectNetwork, mintNFT, ownedNFTs, refreshNFTs } = useWallet();

  // Categorias de NFTs
  const categories: NFTCategory[] = [
    {
      id: 'all',
      name: 'Todos',
      description: 'Veja todos os itens disponíveis',
      icon: '🌟',
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 'dinos',
      name: 'Dinos',
      description: 'Companheiros colecionáveis com habilidades únicas',
      icon: '🦖',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'dino_skins',
      name: 'Skins para Dinos',
      description: 'Aparências exclusivas para seus companheiros',
      icon: '🎨',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      id: 'accessories',
      name: 'Acessórios',
      description: 'Itens cosméticos para personalização',
      icon: '👑',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'powerups',
      name: 'Power-ups',
      description: 'Potencializadores de gameplay',
      icon: '⚡',
      color: 'from-red-500 to-orange-500'
    }
  ];

  // Produtos à venda - reorganizados por categoria
  const [products] = useState<Product[]>([
    // DINOS
    {
      id: 'nft-dino-rex',
      name: 'Rex',
      type: 'dino',
      element: 'Fogo',
      rarity: 'legendary',
      description: 'Este dinossauro companheiro pode ajudar seu Rider com ataques de fogo, causando dano extra em área quando as bombas explodem.',
      image: gameImages.characters.charFire,
      price: 3000,
      attributes: {
        espécie: 'T-Rex',
        dano: '5/5',
        defesa: '3/5',
        velocidade: '3/5',
        habilidade: 'Mordida Flamejante'
      },
      category: 'dinos'
    },
    {
      id: 'nft-dino-aqua',
      name: 'Aqua',
      type: 'dino',
      element: 'Água',
      rarity: 'epic',
      description: 'Um dinossauro aquático que pode criar pequenas poças de água, desacelerando inimigos que passam por elas.',
      image: gameImages.characters.charWater,
      price: 2200,
      attributes: {
        espécie: 'Plesiosaurus',
        dano: '3/5',
        defesa: '4/5',
        velocidade: '4/5',
        habilidade: 'Tsunami Miniatura'
      },
      category: 'dinos'
    },
    {
      id: 'nft-dino-spark',
      name: 'Spark',
      type: 'dino',
      element: 'Raio',
      rarity: 'mythic',
      description: 'Este pequeno e ágil dinossauro pode gerar campos elétricos que paralisam inimigos por curtos períodos.',
      image: gameImages.characters.charRaio,
      price: 4500,
      attributes: {
        espécie: 'Velociraptor',
        dano: '4/5',
        defesa: '2/5',
        velocidade: '5/5',
        habilidade: 'Choque Paralisante'
      },
      category: 'dinos'
    },

    // SKINS PARA DINOS
    {
      id: 'nft-skin-cyber-rex',
      name: 'Cyber Rex',
      type: 'dino_skin',
      element: 'Digital',
      rarity: 'epic',
      description: 'Transforme seu dino T-Rex em uma versão cibernética futurista com efeitos digitais nas explosões.',
      image: gameImages.characters.charEarth,
      price: 1500,
      attributes: {
        compatibilidade: 'T-Rex',
        efeito_visual: 'Explosão Digital',
        bônus: '+5% Alcance de Bomba',
        raridade: 'Edição Limitada'
      },
      category: 'dino_skins'
    },
    {
      id: 'nft-skin-ghost-raptor',
      name: 'Raptor Fantasma',
      type: 'dino_skin',
      element: 'Espectro',
      rarity: 'legendary',
      description: 'Um visual translúcido e espectral para seu Velociraptor, com efeitos de fumaça e aparições fantasmagóricas.',
      image: gameImages.characters.charAir,
      price: 2500,
      attributes: {
        compatibilidade: 'Velociraptor',
        efeito_visual: 'Rastro Fantasma',
        bônus: '+10% Velocidade',
        raridade: 'Ultra Raro'
      },
      category: 'dino_skins'
    },

    // ACESSÓRIOS
    {
      id: 'nft-access-crown',
      name: 'Coroa do Campeão',
      type: 'accessory',
      element: 'Cosmético',
      rarity: 'legendary',
      description: 'Uma coroa dourada que pode ser equipada em qualquer personagem ou dino, mostrando seu status de campeão.',
      image: gameImages.elements.arcade,
      price: 1800,
      attributes: {
        slot: 'Cabeça',
        compatibilidade: 'Universal',
        efeito: 'Aura Dourada',
        prestígio: '+25% Rider Coins em vitórias'
      },
      category: 'accessories'
    },

    // POWER-UPS
    {
      id: 'nft-power-bomb',
      name: 'Bomba Suprema',
      type: 'powerup',
      element: 'Poder',
      rarity: 'legendary',
      description: 'Uma bomba ancestral com poder destrutivo lendário. Aumenta o alcance e o dano de todas as bombas do personagem.',
      image: gameImages.elements.bomb,
      price: 2200,
      attributes: {
        alcance: '+2',
        dano: '+50%',
        velocidade: '-1',
        efeito: 'Explosão Suprema'
      },
      category: 'powerups'
    }
  ]);

  // Carregar NFTs da carteira do usuário
  const loadPlayerNFTs = async (): Promise<void> => {
    setLoading(true);
    try {
      // Verificar se a carteira está conectada
      if (!isConnected || !walletAddress) {
        // console.log removido
        setNfts([]);
        setStats(null);
        setLoading(false);
        return;
      }

      // console.log removido

      // Buscar NFTs reais da blockchain usando o contexto da wallet
      const userNFTs: NFT[] = ownedNFTs.map(nftInfo => ({
        id: `token-${nftInfo.tokenId}`,
        type: nftInfo.tokenType.toLowerCase(),
        name: nftInfo.metadata?.name || `NFT #${nftInfo.tokenId}`,
        description: nftInfo.metadata?.description || 'BombRider NFT',
        rarity: nftInfo.rarity as NFT['rarity'],
        category: nftInfo.tokenType.toLowerCase(),
        value: 1000, // Valor estimado
        attributes: nftInfo.metadata?.attributes?.reduce((acc: any, attr: any) => {
          acc[attr.trait_type] = attr.value;
          return acc;
        }, {}) || {},
        ownerId: walletAddress,
        createdAt: Date.now(),
        obtainedFrom: 'purchase',
        isEquipped: false,
        metadata: {
          image: nftInfo.image || '/images/characters/bomberman1.jpg',
          animation: null,
          external_url: 'https://bombriders.com'
        },
        element: nftInfo.element
      }));

      const userStats: NFTStats = {
        total: userNFTs.length,
        totalValue: userNFTs.reduce((sum, nft) => sum + nft.value, 0),
        equipped: userNFTs.filter(nft => nft.isEquipped).length,
        byRarity: {
          common: userNFTs.filter(nft => nft.rarity === 'common').length,
          rare: userNFTs.filter(nft => nft.rarity === 'rare').length,
          epic: userNFTs.filter(nft => nft.rarity === 'epic').length,
          legendary: userNFTs.filter(nft => nft.rarity === 'legendary').length,
          mythic: userNFTs.filter(nft => nft.rarity === 'mythic').length,
        },
        byType: userNFTs.reduce((acc, nft) => {
          acc[nft.type] = (acc[nft.type] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number })
      };

      setNfts(userNFTs);
      setStats(userStats);
      // console.log removido
    } catch (error) {
      // console.error removido
      setNfts([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Comprar um NFT
  const { showToast } = useToast();
  const handleBuyNFT = (product: Product) => {
    if (playerBalance < product.price) {
      showToast('Moeda em Desenvolvimento!', 'info', 4000);
      return;
    }

    setSelectedNFT({
      ...product,
      action: 'buy'
    });
  };

  // Confirmar compra de NFT
  const confirmBuy = async (): Promise<void> => {
    if (!selectedNFT) return;

    // Reduzir saldo do jogador
    setPlayerBalance(prev => prev - (selectedNFT.price || 0));

    // Adicionar NFT ao inventário (simulação local)
    try {
      // console.log removido

      // Criar NFT local
      const newNFT: NFT = {
        id: `local-${Date.now()}`,
        type: selectedNFT.type || 'unknown',
        name: selectedNFT.name || '',
        description: selectedNFT.description || '',
        rarity: (selectedNFT.rarity as NFT['rarity']) || 'common',
        category: selectedNFT.category || 'misc',
        value: selectedNFT.price || 0,
        attributes: selectedNFT.attributes || {},
        ownerId: walletAddress || 'unknown',
        createdAt: Date.now(),
        obtainedFrom: 'purchase',
        isEquipped: false,
        metadata: {
          image: selectedNFT.image || '/images/characters/bomberman1.jpg',
          animation: null,
          external_url: 'https://bombriders.com'
        },
        element: selectedNFT.element
      };

      // Adicionar ao estado local
      setNfts(currentNfts => [...currentNfts, newNFT]);

      // Atualizar estatísticas
      setStats(currentStats => {
        if (!currentStats) return null;

        return {
          ...currentStats,
          total: currentStats.total + 1,
          totalValue: currentStats.totalValue + newNFT.value,
          byRarity: {
            ...currentStats.byRarity,
            [newNFT.rarity]: (currentStats.byRarity?.[newNFT.rarity] || 0) + 1
          },
          byType: {
            ...currentStats.byType,
            [newNFT.type]: (currentStats.byType?.[newNFT.type] || 0) + 1
          }
        };
      });

      // Fechar modal
      setSelectedNFT(null);

      // Mudar para a aba de inventário
      setActiveTab('inventory');
    } catch (error) {
      // console.error removido
    }
  };

  // Visualizar detalhes do NFT
  const handleViewNFT = (nft: NFT | Product): void => {
    setSelectedNFT({
      ...nft,
      action: 'view'
    });
  };  // Equipar/desequipar NFT - atualização local
  const handleEquipNFT = async (nft: NFT): Promise<void> => {
    try {
      // console.log removido

      // Atualizar estado local
      setNfts(currentNfts =>
        currentNfts.map(currentNft =>
          currentNft.id === nft.id
            ? { ...currentNft, isEquipped: !currentNft.isEquipped }
            : currentNft
        )
      );

      // Atualizar estatísticas
      const updatedNfts = nfts.map(currentNft =>
        currentNft.id === nft.id
          ? { ...currentNft, isEquipped: !currentNft.isEquipped }
          : currentNft
      );

      const newStats: NFTStats = {
        total: updatedNfts.length,
        totalValue: updatedNfts.reduce((sum, nft) => sum + nft.value, 0),
        equipped: updatedNfts.filter(nft => nft.isEquipped).length,
        byRarity: {
          common: updatedNfts.filter(nft => nft.rarity === 'common').length,
          rare: updatedNfts.filter(nft => nft.rarity === 'rare').length,
          epic: updatedNfts.filter(nft => nft.rarity === 'epic').length,
          legendary: updatedNfts.filter(nft => nft.rarity === 'legendary').length,
          mythic: updatedNfts.filter(nft => nft.rarity === 'mythic').length,
        },
        byType: updatedNfts.reduce((acc, nft) => {
          acc[nft.type] = (acc[nft.type] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number })
      };

      setStats(newStats);
    } catch (error) {
      // console.error removido
    }
  };

  // Função para comprar um NFT na blockchain
  const createNFTContract = async () => {
    try {
      setIsCreatingContract(true);
      setContractCreationError(null);

      if (!selectedNFTForBlockchain) return;

      // (ID local removido, o tokenId vem do contrato)

      // Verificar se a carteira está conectada
      if (!isConnected) {
        setContractCreationError("Conecte sua carteira MetaMask para continuar.");
        setIsCreatingContract(false);
        return;
      }

      // Verificar se está na rede correta
      if (!isCorrectNetwork) {
        setContractCreationError("É necessário estar na rede Sepolia para esta transação.");
        setIsCreatingContract(false);
        return;
      }

      // console.log removido

      // Mapear campos para o contrato e metadata
      const mapElement = (el: string) => {
        const m: Record<string, string> = {
          'Fogo': 'fire', 'Água': 'water', 'Agua': 'water', 'Raio': 'electric', 'Terra': 'earth', 'Ar': 'air', 'Digital': 'digital', 'Espectro': 'spectral', 'Poder': 'power'
        };
        return m[el] || (el?.toLowerCase() || 'fire');
      };
      const mapType = (t: string) => {
        const m: Record<string, string> = {
          'dino': 'Character', 'dino_skin': 'Item', 'accessory': 'Item', 'powerup': 'Power'
        };
        return m[t] || 'Character';
      };
      const tokenType = mapType(selectedNFTForBlockchain.type);
      const rarity = (selectedNFTForBlockchain.rarity || 'common').toLowerCase();
      const element = mapElement(selectedNFTForBlockchain.element || 'fire');

      // 1) Enviar imagem do produto ao IPFS
      const uploadedImageUrl = await ipfsMetadataService.uploadImageFromUrlToIPFS(
        selectedNFTForBlockchain.image,
        `${tokenType}_${rarity}_${Date.now()}`
      );

      // 2) Criar metadata e enviar ao IPFS
      const metadata = ipfsMetadataService.createNFTMetadata({
        name: selectedNFTForBlockchain.name,
        description: selectedNFTForBlockchain.description,
        tokenType,
        rarity,
        element,
        imageUrl: uploadedImageUrl,
        attributes: selectedNFTForBlockchain.attributes || {}
      });
      const tokenURI = await ipfsMetadataService.uploadMetadataToIPFS(metadata);

      // 3) Executar mint pelo contrato
      const result = await mintNFT({ tokenType, rarity, element, tokenURI });
      if (result.success) {
        setIsCreatingContract(false);
        setIsContractModalOpen(false);

        const txHashShort = result.txHash?.substring(0, 10) + '...' + result.txHash?.substring(result.txHash.length - 8);
        const etherscanLink = `https://sepolia.etherscan.io/tx/${result.txHash}`;
        if (confirm(`NFT ${selectedNFTForBlockchain.name} mintado com sucesso!\n\nToken ID: ${result.tokenId}\nTx: ${txHashShort}\n\nClique em OK para ver no Etherscan.`)) {
          window.open(etherscanLink, '_blank');
        }

        // Atualiza inventário local (simulado)
        // console.log removido

        const newNFT: NFT = {
          id: `blockchain-${result.tokenId || Date.now()}`,
          type: selectedNFTForBlockchain.type || 'unknown',
          name: selectedNFTForBlockchain.name || '',
          description: selectedNFTForBlockchain.description || '',
          rarity: (selectedNFTForBlockchain.rarity as NFT['rarity']) || 'common',
          category: selectedNFTForBlockchain.category || 'misc',
          value: selectedNFTForBlockchain.price || 0,
          attributes: selectedNFTForBlockchain.attributes || {},
          ownerId: walletAddress || 'unknown',
          createdAt: Date.now(),
          obtainedFrom: 'purchase',
          isEquipped: false,
          metadata: {
            image: uploadedImageUrl,
            animation: null,
            external_url: 'https://bombriders.com'
          },
          element: selectedNFTForBlockchain.element
        };

        // Adicionar ao estado local
        setNfts(currentNfts => [...currentNfts, newNFT]);

        // Atualizar estatísticas
        setStats(currentStats => {
          if (!currentStats) return null;

          return {
            ...currentStats,
            total: currentStats.total + 1,
            totalValue: currentStats.totalValue + newNFT.value,
            byRarity: {
              ...currentStats.byRarity,
              [newNFT.rarity]: (currentStats.byRarity?.[newNFT.rarity] || 0) + 1
            },
            byType: {
              ...currentStats.byType,
              [newNFT.type]: (currentStats.byType?.[newNFT.type] || 0) + 1
            }
          };
        });
      } else {
        setContractCreationError(result.error || "Erro ao mintar NFT. Verifique o saldo de ETH para taxa de gas.");
        setIsCreatingContract(false);
      }

    } catch (error: any) {
      // console.error removido
      setContractCreationError(error.message || "Erro ao comprar NFT.");
      setIsCreatingContract(false);
    }
  };

  // Abrir modal de compra por ETH
  const handleBuyWithETH = (product: Product) => {
    setSelectedNFTForBlockchain(product);
    setIsContractModalOpen(true);
  };

  // Filtrar produtos por categoria
  const getFilteredProducts = (): Product[] => {
    if (activeCategory === 'all') {
      return products;
    }
    return products.filter(product => product.category === activeCategory);
  };

  // Filtrar NFTs
  const getFilteredNFTs = (): NFT[] => {
    let filtered = [...nfts];

    // Aplicar filtro
    if (filter !== 'all') {
      if (filter === 'equipped') {
        filtered = filtered.filter(nft => nft.isEquipped);
      } else {
        filtered = filtered.filter(nft => nft.rarity === filter || nft.type === filter);
      }
    }

    // Aplicar ordenação
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'value_high':
        filtered.sort((a, b) => b.value - a.value);
        break;
      case 'value_low':
        filtered.sort((a, b) => a.value - b.value);
        break;
      case 'rarity': {
        const rarityOrder: { [key: string]: number } = { mythic: 5, legendary: 4, epic: 3, rare: 2, common: 1 };
        filtered.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
        break;
      }
    }

    return filtered;
  };

  useEffect(() => {
    loadPlayerNFTs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, walletAddress, ownedNFTs]);

  // Removido: prefill para modal de mint

  const filteredNFTs = getFilteredNFTs();
  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1518481852452-9415f48c8ceb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')] bg-fixed bg-cover text-white">
      <div className="min-h-screen backdrop-blur-sm bg-black bg-opacity-70 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6 relative w-36 h-36 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                <span className="text-5xl">💎</span>
              </div>
            </div>            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-red-500 to-pink-500 bg-clip-text text-transparent">
              Rider NFTs
            </h1>
            <p className="text-xl opacity-90 mb-4">Colecionáveis digitais para aprimorar sua aventura</p>

            <button
              onClick={() => setShowInfoModal(!showInfoModal)}
              className="inline-flex items-center px-4 py-2 mb-6 bg-yellow-600 hover:bg-yellow-700 rounded-full text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
              </svg>
              {showInfoModal ? "Ocultar Informações" : "Como Funcionam os NFTs"}
            </button>            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 p-1 rounded-full">
                <div className="bg-black rounded-full px-6 py-2 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-xs">RC</span>
                  </div>
                  <span className="font-bold text-xl text-yellow-300">{playerBalance}</span>
                  <span className="text-yellow-300 text-xs">Rider COIN</span>
                </div>
              </div>
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-full">
                + Adicionar Fundos
              </button>

              {/* Botão de refresh dos NFTs para debug */}
              {isConnected && (
                <button
                  onClick={async () => {
                    // console.log removido
                    if (refreshNFTs) {
                      await refreshNFTs();
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
                >
                  🔄 Atualizar NFTs
                </button>
              )}

              {/* Removido: Mint NFT manual */}
            </div>

            {/* Seção informativa (colapsável) */}
            {showInfoModal && <NFTInfoSection />}

            {/* Tabs */}
            <div className="inline-flex p-1 bg-gray-800 bg-opacity-80 rounded-lg">
              <button
                className={`px-8 py-3 rounded-md font-semibold transition-all ${activeTab === 'store'
                  ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white'
                  : 'text-gray-300 hover:text-white'}`}
                onClick={() => setActiveTab('store')}
              >
                Loja NFT
              </button>
              <button
                className={`px-8 py-3 rounded-md font-semibold transition-all ${activeTab === 'inventory'
                  ? 'bg-gradient-to-r from-yellow-500 to-red-500 text-white'
                  : 'text-gray-300 hover:text-white'}`}
                onClick={() => setActiveTab('inventory')}
              >
                Meu Inventário
              </button>
            </div>
          </div>          {/* Aba da Loja */}
          {activeTab === 'store' && (
            <div>
              {/* Personagens Disponíveis */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
                  🎭 Personagens Disponíveis
                </h2>
                <p className="text-center text-gray-300 mb-6">
                  Colecione personagens únicos com habilidades especiais e visuais exclusivos
                </p>
                {/* Grid de todos os personagens disponíveis */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <NFTProductCard
                      key={product.id}
                      product={product}
                      onBuy={handleBuyNFT}
                      onView={handleViewNFT}
                      onBuyWithETH={handleBuyWithETH}
                    />
                  ))}
                </div>
              </div>

              {/* Categorias */}
              <div className="overflow-x-auto pb-4 mb-6">
                <div className="flex gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`
                        flex-shrink-0 px-4 py-3 rounded-xl transition-all
                        ${activeCategory === category.id
                          ? `bg-gradient-to-r ${category.color} shadow-lg`
                          : 'bg-gray-800 hover:bg-gray-700'}
                      `}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-1">{category.icon}</span>
                        <span className="font-medium whitespace-nowrap">{category.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Introdução à categoria */}
              {categories.find(c => c.id === activeCategory) && (
                <div className="bg-gray-800 bg-opacity-60 p-4 rounded-xl mb-6">
                  <h2 className="text-xl font-bold flex items-center">
                    <span className="text-2xl mr-2">
                      {categories.find(c => c.id === activeCategory)?.icon}
                    </span>
                    {categories.find(c => c.id === activeCategory)?.name}
                  </h2>
                  <p className="text-gray-300">
                    {categories.find(c => c.id === activeCategory)?.description}
                  </p>
                </div>)}

              {/* Produtos por categoria */}
              {activeCategory !== 'all' && (
                <>
                  <h3 className="text-2xl font-bold mb-4 text-center">
                    {categories.find(c => c.id === activeCategory)?.icon} {categories.find(c => c.id === activeCategory)?.name}
                  </h3>                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <NFTProductCard
                        key={product.id}
                        product={product}
                        onBuy={handleBuyNFT}
                        onView={handleViewNFT}
                        onBuyWithETH={handleBuyWithETH}
                      />
                    ))}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="text-center py-20 bg-gray-800 bg-opacity-60 rounded-2xl">
                      <div className="text-6xl mb-4">🔍</div>
                      <p className="text-xl mb-4">Nenhum item encontrado nesta categoria</p>
                      <button
                        onClick={() => setActiveCategory('all')}
                        className="bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 px-8 py-3 rounded-xl font-bold transition-all duration-300"
                      >
                        Ver Todos os Itens
                      </button>
                    </div>
                  )}
                </>
              )}

              <div className="mt-12 p-6 bg-gray-800 bg-opacity-70 rounded-2xl">
                <h2 className="text-2xl font-bold mb-4">🚀 Sobre o Futuro dos NFTs</h2>
                <p className="mb-4">
                  BombRider está implementando um sistema de NFTs cuidadosamente projetado para aprimorar
                  a experiência de jogo sem criar desvantagens para jogadores não-NFT. Nossa visão:
                </p>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                    <div className="text-3xl mb-2">🔄</div>
                    <h3 className="font-bold text-lg mb-1">Interoperabilidade</h3>
                    <p className="text-sm text-gray-300">Seus NFTs poderão ser usados em múltiplos jogos do nosso ecossistema no futuro.</p>
                  </div>

                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                    <div className="text-3xl mb-2">👥</div>
                    <h3 className="font-bold text-lg mb-1">Comunidade</h3>
                    <p className="text-sm text-gray-300">Governança DAO permitirá que proprietários de NFTs votem em futuros recursos.</p>
                  </div>

                  <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg">
                    <div className="text-3xl mb-2">💰</div>
                    <h3 className="font-bold text-lg mb-1">Valor Real</h3>
                    <p className="text-sm text-gray-300">Todos os NFTs serão ativos digitais verdadeiros que você realmente possui.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba do Inventário */}
          {activeTab === 'inventory' && (
            <>
              {/* Estatísticas - apenas se carteira conectada */}
              {isConnected && stats && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                  <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold">{stats.total}</div>
                    <div className="text-sm opacity-80">Total NFTs</div>
                  </div>
                  <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold">{stats.equipped}</div>
                    <div className="text-sm opacity-80">Equipados</div>
                  </div>
                  <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold">💰{stats.totalValue}</div>
                    <div className="text-sm opacity-80">Valor Total</div>
                  </div>
                  <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold">{stats.byRarity?.mythic || 0}</div>
                    <div className="text-sm opacity-80">🔴 Míticos</div>
                  </div>
                  <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold">{stats.byRarity?.legendary || 0}</div>
                    <div className="text-sm opacity-80">🟡 Lendários</div>
                  </div>
                  <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-4 text-center">
                    <div className="text-2xl font-bold">{stats.byRarity?.epic || 0}</div>
                    <div className="text-sm opacity-80">🟣 Épicos</div>
                  </div>
                </div>
              )}

              {/* Controles - apenas se carteira conectada */}
              {isConnected && (
                <div className="bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 mb-8">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-4">
                      {/* Filtros */}
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="all">Todos</option>
                        <option value="equipped">Equipados</option>
                        <option value="mythic">Míticos</option>
                        <option value="legendary">Lendários</option>
                        <option value="epic">Épicos</option>
                        <option value="rare">Raros</option>
                        <option value="common">Comuns</option>
                      </select>

                      {/* Ordenação */}
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="newest">Mais Recentes</option>
                        <option value="oldest">Mais Antigos</option>
                        <option value="value_high">Maior Valor</option>
                        <option value="value_low">Menor Valor</option>
                        <option value="rarity">Por Raridade</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Lista de NFTs */}
              {!isConnected ? (
                <div className="text-center py-20 bg-gray-800 bg-opacity-60 rounded-2xl">
                  <div className="text-6xl mb-4">👛</div>
                  <p className="text-xl mb-4">Conecte sua carteira para ver seus NFTs</p>
                  <p className="text-gray-400 mb-6">
                    Seus NFTs são armazenados na blockchain e vinculados ao seu endereço de carteira
                  </p>
                  <button
                    onClick={() => setActiveTab('store')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-3 rounded-xl font-bold transition-all duration-300"
                  >
                    🛒 Explorar Loja NFT
                  </button>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-800 bg-opacity-60 rounded-2xl min-h-[300px]">
                  <Spinner size={64} color="#facc15" className="mb-6" />
                  <p className="text-xl text-yellow-300 font-semibold">Carregando seus NFTs...</p>
                </div>
              ) : filteredNFTs.length === 0 ? (
                <div className="text-center py-20 bg-gray-800 bg-opacity-60 rounded-2xl">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-xl mb-4">
                    {filter === 'all' ? 'Você ainda não possui NFTs nesta carteira' : 'Nenhum NFT encontrado com este filtro'}
                  </p>
                  <p className="text-gray-400 mb-6">
                    Carteira conectada: {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                  </p>
                  <button
                    onClick={() => setActiveTab('store')}
                    className="bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 px-8 py-3 rounded-xl font-bold transition-all duration-300"
                  >
                    🎁 Comprar seu primeiro NFT
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredNFTs.map((nft) => (
                    <NFTCard
                      key={nft.id}
                      nft={nft}
                      onEquip={handleEquipNFT}
                      onView={handleViewNFT}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Modal de detalhes/compra do NFT */}
          {selectedNFT && (
            <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-yellow-500">
                <div className="text-center mb-6">
                  {selectedNFT.image && (
                    <div className="h-48 mb-6 rounded-xl overflow-hidden">
                      <img
                        src={selectedNFT.image}
                        alt={selectedNFT.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {!selectedNFT.image && (
                    <div className="text-8xl mb-4">
                      {selectedNFT.type === 'dino' && '🦖'}
                      {selectedNFT.type === 'dino_skin' && '🎨'}
                      {selectedNFT.type === 'accessory' && '👑'}
                      {selectedNFT.type === 'powerup' && '💎'}
                    </div>
                  )}

                  <h2 className="text-3xl font-bold mb-1">{selectedNFT.name}</h2>
                  <div className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-sm font-semibold">
                    {selectedNFT.element} • {selectedNFT.rarity?.charAt(0).toUpperCase() + (selectedNFT.rarity?.slice(1) || '')}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Descrição</h3>
                    <p className="opacity-90">{selectedNFT.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">Atributos</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedNFT.attributes || {}).map(([key, value]) => (
                        <div key={key} className="bg-gray-700 bg-opacity-50 rounded-lg p-3">
                          <span className="block capitalize opacity-80 text-sm">{key}</span>
                          <span className="font-medium text-lg">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedNFT.action === 'buy' && (
                    <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-xl p-4 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-lg">Preço:</div>
                        <div className="flex items-center">
                          <div className="mr-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                            <span className="text-black font-bold text-xs">RC</span>
                          </div>
                          <span className="text-2xl font-bold text-yellow-400">{selectedNFT.price}</span>
                        </div>
                      </div>

                      <div className="text-sm mb-4">
                        {playerBalance >= (selectedNFT.price || 0)
                          ? `Saldo atual: ${playerBalance} Rider COIN • Após a compra: ${playerBalance - (selectedNFT.price || 0)} Rider COIN`
                          : `Saldo insuficiente. Você precisa de mais ${(selectedNFT.price || 0) - playerBalance} Rider COIN.`
                        }
                      </div>

                      <div className="text-xs text-gray-400 mb-4 italic">
                        Nota: Atualmente, as compras usam apenas a moeda do jogo (Rider COIN). Quando a integração
                        blockchain estiver concluída, você poderá mintar este item como um NFT verdadeiro.
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={confirmBuy}
                          disabled={playerBalance < (selectedNFT.price || 0)}
                          className={`
                            flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300
                            ${playerBalance >= (selectedNFT.price || 0)
                              ? 'bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600'
                              : 'bg-gray-600 cursor-not-allowed'
                            }
                          `}
                        >
                          Comprar Item
                        </button>

                        <button
                          onClick={() => setSelectedNFT(null)}
                          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-all duration-300"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedNFT.action === 'view' && (
                    <div className="flex gap-4">
                      {'isEquipped' in selectedNFT && (
                        <button
                          onClick={() => handleEquipNFT(selectedNFT as NFT)}
                          className={`
                            flex-1 py-3 px-6 rounded-xl font-bold transition-all duration-300
                            ${selectedNFT.isEquipped
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'bg-green-600 hover:bg-green-700'
                            }
                          `}
                        >
                          {selectedNFT.isEquipped ? 'Desequipar' : 'Equipar'}
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedNFT(null)}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-all duration-300"
                      >
                        Fechar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>)}

          {/* Modal de compra por ETH */}
          <Dialog open={isContractModalOpen} onOpenChange={setIsContractModalOpen}>
            <DialogContent className="bg-gradient-to-b from-gray-900 to-black border border-cyan-500/30 text-white">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-cyan-300 text-xl">
                  Comprar {selectedNFTForBlockchain?.name} com ETH
                </DialogTitle>
                <DialogDescription className="text-cyan-100">
                  Adquira este NFT exclusivo por apenas 0.001 ETH na rede Sepolia.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                {selectedNFTForBlockchain && (
                  <>
                    <div className="flex items-center justify-center mb-6">
                      <div className="relative w-36 h-36 overflow-hidden rounded-lg border-2 border-cyan-500/50">
                        <img
                          src={selectedNFTForBlockchain.image}
                          alt={selectedNFTForBlockchain.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/70 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full p-2 text-center">
                          <span className="text-cyan-300 font-bold text-sm">
                            {selectedNFTForBlockchain.name} #{Math.floor(Math.random() * 1000)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-800/50 to-cyan-900/50 p-4 rounded-md mb-4 border border-cyan-500/20">
                      <p className="text-sm text-cyan-100 mb-2">
                        Benefícios deste NFT:
                      </p>
                      <ul className="text-sm text-cyan-100 list-disc pl-5 space-y-1">
                        <li>Personagem exclusivo para seu jogo</li>
                        <li>Habilidades especiais: {selectedNFTForBlockchain.element}</li>
                        <li>Raridade: {selectedNFTForBlockchain.rarity}</li>
                        <li>Transferível entre contas</li>
                        <li>Propriedade verdadeira na blockchain</li>
                      </ul>
                    </div>

                    <div className="flex items-center justify-between bg-cyan-900/30 p-3 rounded-md border border-cyan-500/30 mb-4">
                      <span className="text-cyan-300">Preço:</span>
                      <span className="text-white font-bold">0.001 ETH</span>
                    </div>

                    {/* Informações da wallet */}
                    {isConnected && walletAddress && (
                      <div className="mb-4 p-3 bg-gradient-to-r from-gray-900/80 to-cyan-900/50 rounded-lg border border-cyan-500/30 text-sm">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-cyan-300">Carteira:</span>
                            <span className="text-cyan-100">
                              {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-cyan-300">Saldo:</span>
                            <span className="text-cyan-100">{balance} ETH</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-cyan-300">Rede:</span>
                            <span className={isCorrectNetwork ? "text-green-400" : "text-orange-400"}>
                              {networkName}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {contractCreationError && (
                      <div className="mt-3 bg-red-900/30 p-3 rounded-md border border-red-500/30 text-red-300 text-sm">
                        {contractCreationError}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Informação de status quando botão desabilitado */}
              {(!isConnected || !isCorrectNetwork) && (
                <div className="mb-4 p-3 rounded-md bg-gray-800/80 border border-cyan-500/30">
                  {!isConnected && (
                    <p className="text-sm text-cyan-300">
                      Conecte sua carteira MetaMask para poder comprar este NFT.
                    </p>
                  )}
                  {isConnected && !isCorrectNetwork && (
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-cyan-300">
                        Para comprar um NFT, você precisa estar na rede Sepolia.
                      </p>
                      <button
                        className="text-sm py-1 px-3 bg-cyan-700/50 text-cyan-300 rounded-md border border-cyan-600/50 hover:bg-cyan-700/70 transition-colors"
                        onClick={async () => {
                          try {
                            const { ethereum } = window as any;
                            await ethereum.request({
                              method: 'wallet_switchEthereumChain',
                              params: [{ chainId: '0xaa36a7' }], // Sepolia
                            });
                          } catch (error) {
                            // console.error removido
                          }
                        }}
                      >
                        Mudar para Sepolia
                      </button>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter className="flex gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors"
                  onClick={() => setIsContractModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-md hover:from-cyan-500 hover:to-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={createNFTContract}
                  disabled={isCreatingContract || (!isConnected || !isCorrectNetwork)}
                  title={
                    isCreatingContract
                      ? "Processando..."
                      : !isConnected
                        ? "Conecte sua carteira"
                        : !isCorrectNetwork
                          ? "Mude para a rede Sepolia"
                          : "Comprar este NFT"
                  }
                >
                  {isCreatingContract ? 'Comprando...' : 'Comprar NFT com ETH'}
                </button>
              </DialogFooter>            </DialogContent>
          </Dialog>

          {/* Removido: NFTMintModal */}

          {/* Navegação */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/')}
              className="text-white text-opacity-70 hover:text-opacity-100 underline"
            >
              ← Voltar para a Landing Page
            </button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default NFTInventory;
