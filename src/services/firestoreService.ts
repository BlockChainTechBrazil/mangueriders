import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc, query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Interfaces para os dados
export interface NFTData {
  id?: string;
  tokenId: number;
  contractAddress: string;
  ownerAddress: string;
  name: string;
  description: string;
  tokenType: string;
  rarity: string;
  element: string;
  tokenURI: string;
  imageUrl?: string;
  metadata?: any;
  mintedAt: Timestamp;
  txHash: string;
  mintPrice: string;
  network: string;
  isActive: boolean;
}

export interface UserProfile {
  id?: string;
  walletAddress: string;
  username?: string;
  email?: string;
  avatar?: string;
  totalNFTs: number;
  totalMinted: number;
  totalSpent: string;
  joinedAt: Timestamp;
  lastActive: Timestamp;
  preferences: {
    notifications: boolean;
    publicProfile: boolean;
    showEmail: boolean;
  };
}

export interface TransactionHistory {
  id?: string;
  txHash: string;
  type: 'mint' | 'transfer' | 'sale' | 'purchase';
  fromAddress: string;
  toAddress: string;
  tokenId?: number;
  contractAddress: string;
  amount: string;
  currency: string;
  network: string;
  timestamp: Timestamp;
  status: 'pending' | 'completed' | 'failed';
  gasUsed?: string;
  gasPrice?: string;
  blockNumber?: number;
}

export interface GameStats {
  id?: string;
  walletAddress: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  bestScore: number;
  totalPoints: number;
  charactersUsed: string[];
  favoriteCharacter?: string;
  lastPlayed: Timestamp;
  achievements: string[];
}

class FirestoreService {
  // Coleções
  private readonly NFT_COLLECTION = 'nfts';
  private readonly USERS_COLLECTION = 'users';
  private readonly TRANSACTIONS_COLLECTION = 'transactions';
  private readonly GAME_STATS_COLLECTION = 'gameStats';

  // ========== NFT Methods ==========

  async saveNFT(nftData: Omit<NFTData, 'id' | 'mintedAt'>): Promise<string> {
    try {
      const nftWithTimestamp = {
        ...nftData,
        mintedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, this.NFT_COLLECTION), nftWithTimestamp);
      console.log('NFT saved with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving NFT:', error);
      throw error;
    }
  }

  async getNFT(id: string): Promise<NFTData | null> {
    try {
      const docRef = doc(db, this.NFT_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as NFTData;
      }
      return null;
    } catch (error) {
      console.error('Error getting NFT:', error);
      throw error;
    }
  }

  async getNFTByTokenId(tokenId: number, contractAddress: string): Promise<NFTData | null> {
    try {
      const q = query(
        collection(db, this.NFT_COLLECTION),
        where('tokenId', '==', tokenId),
        where('contractAddress', '==', contractAddress),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as NFTData;
      }
      return null;
    } catch (error) {
      console.error('Error getting NFT by token ID:', error);
      throw error;
    }
  }

  async getUserNFTs(walletAddress: string): Promise<NFTData[]> {
    try {
      const q = query(
        collection(db, this.NFT_COLLECTION),
        where('ownerAddress', '==', walletAddress.toLowerCase()),
        where('isActive', '==', true),
        orderBy('mintedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NFTData[];
    } catch (error) {
      console.error('Error getting user NFTs:', error);
      throw error;
    }
  }

  async updateNFTOwner(tokenId: number, contractAddress: string, newOwner: string, txHash: string): Promise<void> {
    try {
      const nft = await this.getNFTByTokenId(tokenId, contractAddress);
      if (nft && nft.id) {
        const docRef = doc(db, this.NFT_COLLECTION, nft.id);
        await updateDoc(docRef, {
          ownerAddress: newOwner.toLowerCase(),
          lastTransferTxHash: txHash,
          lastTransferAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error updating NFT owner:', error);
      throw error;
    }
  }

  // ========== User Profile Methods ==========

  async createOrUpdateUserProfile(profile: Omit<UserProfile, 'id' | 'joinedAt'>): Promise<string> {
    try {
      // Verifica se usuário já existe
      const existingUser = await this.getUserProfile(profile.walletAddress);

      if (existingUser && existingUser.id) {
        // Atualiza usuário existente
        const docRef = doc(db, this.USERS_COLLECTION, existingUser.id);
        await updateDoc(docRef, {
          ...profile,
          lastActive: Timestamp.now()
        });
        return existingUser.id;
      } else {
        // Cria novo usuário
        const userWithTimestamp = {
          ...profile,
          joinedAt: Timestamp.now(),
          lastActive: Timestamp.now()
        };

        const docRef = await addDoc(collection(db, this.USERS_COLLECTION), userWithTimestamp);
        return docRef.id;
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      throw error;
    }
  }

  async getUserProfile(walletAddress: string): Promise<UserProfile | null> {
    try {
      const q = query(
        collection(db, this.USERS_COLLECTION),
        where('walletAddress', '==', walletAddress.toLowerCase()),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as UserProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async updateUserStats(walletAddress: string, stats: Partial<Pick<UserProfile, 'totalNFTs' | 'totalMinted' | 'totalSpent'>>): Promise<void> {
    try {
      const user = await this.getUserProfile(walletAddress);
      if (user && user.id) {
        const docRef = doc(db, this.USERS_COLLECTION, user.id);
        await updateDoc(docRef, {
          ...stats,
          lastActive: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }

  // ========== Transaction History Methods ==========

  async saveTransaction(transaction: Omit<TransactionHistory, 'id' | 'timestamp'>): Promise<string> {
    try {
      const transactionWithTimestamp = {
        ...transaction,
        timestamp: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, this.TRANSACTIONS_COLLECTION), transactionWithTimestamp);
      return docRef.id;
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  }

  async getUserTransactions(walletAddress: string, limitCount = 50): Promise<TransactionHistory[]> {
    try {
      const q = query(
        collection(db, this.TRANSACTIONS_COLLECTION),
        where('fromAddress', '==', walletAddress.toLowerCase()),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TransactionHistory[];
    } catch (error) {
      console.error('Error getting user transactions:', error);
      throw error;
    }
  }

  async updateTransactionStatus(txHash: string, status: TransactionHistory['status'], blockNumber?: number): Promise<void> {
    try {
      const q = query(
        collection(db, this.TRANSACTIONS_COLLECTION),
        where('txHash', '==', txHash),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        const updateData: any = { status };
        if (blockNumber) {
          updateData.blockNumber = blockNumber;
        }
        await updateDoc(docRef, updateData);
      }
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  }

  // ========== Game Stats Methods ==========

  async saveGameStats(stats: Omit<GameStats, 'id' | 'lastPlayed'>): Promise<string> {
    try {
      const statsWithTimestamp = {
        ...stats,
        lastPlayed: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, this.GAME_STATS_COLLECTION), statsWithTimestamp);
      return docRef.id;
    } catch (error) {
      console.error('Error saving game stats:', error);
      throw error;
    }
  }

  async getGameStats(walletAddress: string): Promise<GameStats | null> {
    try {
      const q = query(
        collection(db, this.GAME_STATS_COLLECTION),
        where('walletAddress', '==', walletAddress.toLowerCase()),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as GameStats;
      }
      return null;
    } catch (error) {
      console.error('Error getting game stats:', error);
      throw error;
    }
  }

  async updateGameStats(walletAddress: string, updates: Partial<GameStats>): Promise<void> {
    try {
      const existingStats = await this.getGameStats(walletAddress);

      if (existingStats && existingStats.id) {
        const docRef = doc(db, this.GAME_STATS_COLLECTION, existingStats.id);
        await updateDoc(docRef, {
          ...updates,
          lastPlayed: Timestamp.now()
        });
      } else {
        // Criar novas estatísticas se não existirem
        await this.saveGameStats({
          walletAddress: walletAddress.toLowerCase(),
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          bestScore: 0,
          totalPoints: 0,
          charactersUsed: [],
          achievements: [],
          ...updates
        });
      }
    } catch (error) {
      console.error('Error updating game stats:', error);
      throw error;
    }
  }

  // ========== Utility Methods ==========

  async getCollectionStats(): Promise<{
    totalNFTs: number;
    totalUsers: number;
    totalTransactions: number;
    recentMints: NFTData[];
  }> {
    try {
      const [nftsSnapshot, usersSnapshot, transactionsSnapshot] = await Promise.all([
        getDocs(collection(db, this.NFT_COLLECTION)),
        getDocs(collection(db, this.USERS_COLLECTION)),
        getDocs(collection(db, this.TRANSACTIONS_COLLECTION))
      ]);

      // Buscar NFTs recentes
      const recentMintsQuery = query(
        collection(db, this.NFT_COLLECTION),
        orderBy('mintedAt', 'desc'),
        limit(10)
      );
      const recentMintsSnapshot = await getDocs(recentMintsQuery);
      const recentMints = recentMintsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NFTData[];

      return {
        totalNFTs: nftsSnapshot.size,
        totalUsers: usersSnapshot.size,
        totalTransactions: transactionsSnapshot.size,
        recentMints
      };
    } catch (error) {
      console.error('Error getting collection stats:', error);
      throw error;
    }
  }

  async searchNFTs(searchTerm: string, filters?: {
    rarity?: string;
    element?: string;
    tokenType?: string;
  }): Promise<NFTData[]> {
    try {
      let q = query(collection(db, this.NFT_COLLECTION), where('isActive', '==', true));

      // Aplicar filtros
      if (filters?.rarity) {
        q = query(q, where('rarity', '==', filters.rarity));
      }
      if (filters?.element) {
        q = query(q, where('element', '==', filters.element));
      }
      if (filters?.tokenType) {
        q = query(q, where('tokenType', '==', filters.tokenType));
      }

      const querySnapshot = await getDocs(q);
      let results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NFTData[];

      // Filtrar por termo de busca (nome ou descrição)
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        results = results.filter(nft =>
          nft.name.toLowerCase().includes(term) ||
          nft.description.toLowerCase().includes(term)
        );
      }

      return results;
    } catch (error) {
      console.error('Error searching NFTs:', error);
      throw error;
    }
  }
}

// Exportar instância única
export const firestoreService = new FirestoreService();
export default firestoreService;
