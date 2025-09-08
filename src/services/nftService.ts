import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';

// Interfaces para tipar os objetos NFTs
interface NFTAttribute {
  [key: string]: string | number;
}

interface NFTMetadata {
  image: string;
  animation: string | null;
  external_url: string;
}

export interface NFT {
  id: string;
  firestoreId?: string;
  type: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  category: string;
  value: number;
  attributes: NFTAttribute;
  ownerId: string;
  createdAt: number;
  obtainedFrom: 'game_reward' | 'purchase' | 'trade';
  isEquipped: boolean;
  metadata: NFTMetadata;
  element?: string;
}

interface NFTType {
  id: string;
  name: string;
  description: string;
  rarity: string;
  category: string;
  baseValue: number;
  attributes: {
    [key: string]: Array<string | number>;
  };
}

interface NFTTypes {
  [key: string]: NFTType;
}

interface NFTStats {
  total: number;
  byRarity: { [key: string]: number };
  byType: { [key: string]: number };
  totalValue: number;
  equipped: number;
}

interface NFTReward {
  type: string;
  rarity: string;
}

interface NFTSpecificData {
  name: string;
  type?: string;
  description?: string;
  rarity?: string;
  category?: string;
  value?: number;
  attributes?: NFTAttribute;
  obtainedFrom?: string;
  metadata?: NFTMetadata;
  element?: string;
}

class NFTService {
  private userNFTs: NFT[];
  private listeners: Map<string, () => void>;

  constructor() {
    this.userNFTs = [];
    this.listeners = new Map();
  }

  // Tipos de NFTs disponíveis
  getNFTTypes(): NFTTypes {
    return {
      DINO_EGG: {
        id: 'dino_egg',
        name: 'Ovo de Dinossauro',
        description: 'Um ovo misterioso que pode conter um dinossauro lendário',
        rarity: 'epic',
        category: 'collectible',
        baseValue: 100,
        attributes: {
          species: ['T-Rex', 'Triceratops', 'Velociraptor', 'Brontosaurus', 'Stegosaurus'],
          element: ['Fire', 'Water', 'Earth', 'Air', 'Lightning'],
          power: [1, 2, 3, 4, 5]
        }
      },
      RIDER_SKIN: {
        id: 'rider_skin',
        name: 'Skin de Rider',
        description: 'Uma aparência única para seu personagem',
        rarity: 'rare',
        category: 'cosmetic',
        baseValue: 50,
        attributes: {
          character: ['Aria', 'Bront', 'Kiro', 'Lume', 'Zunn'],
          theme: ['Prehistoric', 'Futuristic', 'Elemental', 'Tribal', 'Cosmic'],
          color: ['Red', 'Blue', 'Green', 'Purple', 'Gold']
        }
      },
      POWER_CRYSTAL: {
        id: 'power_crystal',
        name: 'Cristal de Poder',
        description: 'Um cristal que concede habilidades especiais',
        rarity: 'legendary',
        category: 'utility',
        baseValue: 200,
        attributes: {
          power: ['Bomb Range', 'Speed Boost', 'Extra Bomb', 'Shield', 'Teleport'],
          level: [1, 2, 3, 4, 5],
          duration: [30, 60, 90, 120, 180] // segundos
        }
      },
      ARTIFACT: {
        id: 'artifact',
        name: 'Artefato Antigo',
        description: 'Um item raro da era pré-histórica',
        rarity: 'mythic',
        category: 'collectible',
        baseValue: 500,
        attributes: {
          type: ['Fossil', 'Weapon', 'Tool', 'Ornament', 'Scroll'],
          age: ['Triassic', 'Jurassic', 'Cretaceous'],
          condition: ['Poor', 'Fair', 'Good', 'Excellent', 'Perfect']
        }
      }
    };
  }

  // Gerar NFT aleatório baseado na raridade
  generateRandomNFT(playerId: string, type: string | null = null, rarity: string | null = null): NFT {
    const nftTypes = this.getNFTTypes();
    const typeKeys = Object.keys(nftTypes);

    // Se não especificado, escolher tipo aleatório
    if (!type) {
      type = typeKeys[Math.floor(Math.random() * typeKeys.length)];
    }

    const nftTemplate = nftTypes[type];
    if (!nftTemplate) {
      throw new Error('Tipo de NFT inválido');
    }

    // Se não especificado, gerar raridade baseada em probabilidade
    if (!rarity) {
      const rarityRoll = Math.random();
      if (rarityRoll < 0.01) rarity = 'mythic';      // 1%
      else if (rarityRoll < 0.05) rarity = 'legendary'; // 4%
      else if (rarityRoll < 0.15) rarity = 'epic';      // 10%
      else if (rarityRoll < 0.35) rarity = 'rare';      // 20%
      else rarity = 'common';                            // 65%
    }

    // Gerar atributos aleatórios
    const attributes: NFTAttribute = {};
    Object.keys(nftTemplate.attributes).forEach(attr => {
      const options = nftTemplate.attributes[attr];
      attributes[attr] = options[Math.floor(Math.random() * options.length)];
    });

    // Calcular valor baseado na raridade
    const rarityMultipliers: { [key: string]: number } = {
      common: 1,
      rare: 2,
      epic: 5,
      legendary: 10,
      mythic: 25
    };    // Criar ID único para o NFT
    const nftId = `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const nft: NFT = {
      id: nftId,
      type: type,
      name: nftTemplate.name,
      description: nftTemplate.description,
      rarity: rarity as 'common' | 'rare' | 'epic' | 'legendary' | 'mythic',
      category: nftTemplate.category,
      value: Math.floor(nftTemplate.baseValue * rarityMultipliers[rarity]),
      attributes: attributes,
      ownerId: playerId,
      createdAt: Date.now(),
      obtainedFrom: 'game_reward', // game_reward, purchase, trade
      isEquipped: false,
      metadata: {
        image: `/assets/nfts/${type}_${rarity}.png`,
        animation: `/assets/nfts/${type}_${rarity}.gif`,
        external_url: `https://bombrider.game/nft/${nftId}`
      }
    };

    return nft;
  }

  // Salvar NFT no Firestore
  async mintNFT(playerId: string, nftType: string | null = null, rarity: string | null = null): Promise<NFT> {
    try {
      const nft = this.generateRandomNFT(playerId, nftType, rarity);

      const nftsCollection = collection(db, 'nfts');
      const docRef = await addDoc(nftsCollection, nft);

      const nftWithId = { ...nft, firestoreId: docRef.id };

      console.log('NFT criado:', nftWithId);
      return nftWithId;
    } catch (error) {
      console.error('Erro ao criar NFT:', error);
      throw error;
    }
  }

  // Obter NFTs do jogador
  async getPlayerNFTs(playerId: string): Promise<NFT[]> {
    try {
      const nftsCollection = collection(db, 'nfts');
      const q = query(
        nftsCollection,
        where('ownerId', '==', playerId),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const nfts: NFT[] = [];

      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        nfts.push({
          firestoreId: doc.id,
          ...doc.data() as NFT
        });
      });

      this.userNFTs = nfts;
      return nfts;
    } catch (error) {
      console.error('Erro ao obter NFTs do jogador:', error);
      return [];
    }
  }

  // Equipar/desequipar NFT
  async toggleNFTEquipped(nftId: string, isEquipped: boolean): Promise<boolean> {
    try {
      const nftDoc = doc(db, 'nfts', nftId);
      await updateDoc(nftDoc, {
        isEquipped: isEquipped,
        lastModified: Date.now()
      });

      // Atualizar cache local
      const nftIndex = this.userNFTs.findIndex(nft => nft.firestoreId === nftId);
      if (nftIndex !== -1) {
        this.userNFTs[nftIndex].isEquipped = isEquipped;
      }

      return true;
    } catch (error) {
      console.error('Erro ao equipar/desequipar NFT:', error);
      return false;
    }
  }

  // Transferir NFT (para futuro sistema de trade)
  async transferNFT(nftId: string, fromPlayerId: string, toPlayerId: string): Promise<boolean> {
    try {
      const nftDoc = doc(db, 'nfts', nftId);
      const nftSnapshot = await getDoc(nftDoc);

      if (!nftSnapshot.exists()) {
        throw new Error('NFT não encontrado');
      }

      const nftData = nftSnapshot.data() as NFT;
      if (nftData.ownerId !== fromPlayerId) {
        throw new Error('Jogador não é o dono do NFT');
      }

      await updateDoc(nftDoc, {
        ownerId: toPlayerId,
        previousOwner: fromPlayerId,
        transferredAt: Date.now(),
        isEquipped: false
      });

      // Registrar transferência
      const transfersCollection = collection(db, 'nft_transfers');
      await addDoc(transfersCollection, {
        nftId: nftId,
        fromPlayerId: fromPlayerId,
        toPlayerId: toPlayerId,
        transferredAt: Date.now(),
        type: 'trade'
      });

      return true;
    } catch (error) {
      console.error('Erro ao transferir NFT:', error);
      throw error;
    }
  }

  // Obter estatísticas de NFTs
  async getNFTStats(playerId: string): Promise<NFTStats | null> {
    try {
      const nfts = await this.getPlayerNFTs(playerId);

      const stats: NFTStats = {
        total: nfts.length,
        byRarity: {},
        byType: {},
        totalValue: 0,
        equipped: 0
      };

      nfts.forEach(nft => {
        // Por raridade
        stats.byRarity[nft.rarity] = (stats.byRarity[nft.rarity] || 0) + 1;

        // Por tipo
        stats.byType[nft.type] = (stats.byType[nft.type] || 0) + 1;

        // Valor total
        stats.totalValue += nft.value;

        // Equipados
        if (nft.isEquipped) stats.equipped++;
      });

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas de NFT:', error);
      return null;
    }
  }

  // Escutar mudanças nos NFTs do jogador
  onPlayerNFTsUpdate(playerId: string, callback: (nfts: NFT[]) => void): string {
    const nftsCollection = collection(db, 'nfts');
    const q = query(
      nftsCollection,
      where('ownerId', '==', playerId),
      orderBy('createdAt', 'desc')
    );

    const listenerId = 'nfts_' + playerId + '_' + Date.now();

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const nfts: NFT[] = [];
      querySnapshot.forEach((doc) => {
        nfts.push({
          firestoreId: doc.id,
          ...doc.data() as NFT
        });
      });

      this.userNFTs = nfts;
      callback(nfts);
    });

    this.listeners.set(listenerId, unsubscribe);
    return listenerId;
  }

  // Remover listener
  removeListener(listenerId: string): void {
    const unsubscribe = this.listeners.get(listenerId);
    if (unsubscribe) {
      unsubscribe();
      this.listeners.delete(listenerId);
    }
  }

  // Simular recompensa de NFT por conquista no jogo
  async rewardNFT(playerId: string, achievement: string): Promise<NFT> {
    const rewardTypes: { [key: string]: NFTReward } = {
      'first_win': { type: 'DINO_EGG', rarity: 'rare' },
      'bomb_master': { type: 'POWER_CRYSTAL', rarity: 'epic' },
      'survivor': { type: 'RIDER_SKIN', rarity: 'rare' },
      'collector': { type: 'ARTIFACT', rarity: 'legendary' },
      'champion': { type: 'ARTIFACT', rarity: 'mythic' }
    };

    const reward = rewardTypes[achievement];
    if (!reward) {
      // Recompensa aleatória
      return await this.mintNFT(playerId);
    }

    return await this.mintNFT(playerId, reward.type, reward.rarity);
  }

  // Limpar cache local
  clearCache(): void {
    this.userNFTs = [];
    this.listeners.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.listeners.clear();
  }

  // Criar um NFT específico com dados personalizados
  async mintSpecificNFT(playerId: string, nftData: NFTSpecificData): Promise<NFT> {
    try {      // Criar ID único para o NFT
      const nftId = `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Garantir que o NFT tenha todos os campos necessários
      const nft: NFT = {
        id: nftId,
        type: nftData.type || 'rider_skin',
        name: nftData.name,
        description: nftData.description || 'Um NFT exclusivo do BombRider',
        rarity: (nftData.rarity || 'rare') as 'common' | 'rare' | 'epic' | 'legendary' | 'mythic',
        category: nftData.category || 'collectible',
        value: nftData.value || 100,
        attributes: nftData.attributes || {},
        ownerId: playerId,
        createdAt: Date.now(),
        obtainedFrom: (nftData.obtainedFrom || 'purchase') as 'game_reward' | 'purchase' | 'trade',
        isEquipped: false,
        metadata: nftData.metadata || {
          image: `/assets/nfts/${nftData.type || 'character'}_${nftData.rarity || 'rare'}.png`,
          animation: null,
          external_url: `https://bombrider.game/nft/${nftId}`
        },
        element: nftData.element
      };

      const nftsCollection = collection(db, 'nfts');
      const docRef = await addDoc(nftsCollection, nft);

      const nftWithId = { ...nft, firestoreId: docRef.id };

      console.log('NFT específico criado:', nftWithId);
      return nftWithId;
    } catch (error) {
      console.error('Erro ao criar NFT específico:', error);
      throw error;
    }
  }
}

// Exportar instância singleton
export const nftService = new NFTService();
export default nftService;
