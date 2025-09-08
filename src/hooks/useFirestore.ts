import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../context/WalletContext';
import { firestoreService, NFTData, UserProfile, TransactionHistory, GameStats } from '../services/firestoreService';

export interface UseFirestoreReturn {
  // User Profile
  userProfile: UserProfile | null;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;

  // NFTs
  userNFTs: NFTData[];
  loadUserNFTs: () => Promise<void>;
  saveNFTToFirestore: (nftData: Omit<NFTData, 'id' | 'mintedAt'>) => Promise<string>;

  // Transactions
  userTransactions: TransactionHistory[];
  loadUserTransactions: () => Promise<void>;
  saveTransaction: (transaction: Omit<TransactionHistory, 'id' | 'timestamp'>) => Promise<string>;

  // Game Stats
  gameStats: GameStats | null;
  updateGameStats: (stats: Partial<GameStats>) => Promise<void>;

  // Collection Stats
  collectionStats: {
    totalNFTs: number;
    totalUsers: number;
    totalTransactions: number;
    recentMints: NFTData[];
  } | null;
  loadCollectionStats: () => Promise<void>;

  // Search
  searchResults: NFTData[];
  searchNFTs: (searchTerm: string, filters?: any) => Promise<void>;

  // Loading states
  loading: {
    profile: boolean;
    nfts: boolean;
    transactions: boolean;
    gameStats: boolean;
    collectionStats: boolean;
    search: boolean;
  };

  // Errors
  error: string | null;
}

export const useFirestore = (): UseFirestoreReturn => {
  const { walletAddress, isConnected } = useWallet();

  // States
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userNFTs, setUserNFTs] = useState<NFTData[]>([]);
  const [userTransactions, setUserTransactions] = useState<TransactionHistory[]>([]);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);
  const [collectionStats, setCollectionStats] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState({
    profile: false,
    nfts: false,
    transactions: false,
    gameStats: false,
    collectionStats: false,
    search: false
  });
  const [error, setError] = useState<string | null>(null);

  // Helper para atualizar loading state
  const updateLoading = useCallback((key: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  }, []);

  // Helper para handle errors
  const handleError = useCallback((error: any, context: string) => {
    console.error(`${context}:`, error);
    setError(`Error in ${context}: ${error.message || 'Unknown error'}`);
  }, []);

  // ========== User Profile Methods ==========

  const loadUserProfile = useCallback(async () => {
    if (!walletAddress || !isConnected) return;

    try {
      updateLoading('profile', true);
      setError(null);

      const profile = await firestoreService.getUserProfile(walletAddress);
      setUserProfile(profile);
      // Se não existe perfil, criar um básico
      if (!profile) {
        const newProfile: Omit<UserProfile, 'id' | 'joinedAt'> = {
          walletAddress: walletAddress.toLowerCase(),
          totalNFTs: 0,
          totalMinted: 0,
          totalSpent: '0',
          lastActive: new Date() as any, // Será convertido para Timestamp no serviço
          preferences: {
            notifications: true,
            publicProfile: true,
            showEmail: false
          }
        };

        await firestoreService.createOrUpdateUserProfile(newProfile);
        setUserProfile({ ...newProfile, id: 'temp' } as UserProfile);
      }
    } catch (error) {
      handleError(error, 'loading user profile');
    } finally {
      updateLoading('profile', false);
    }
  }, [walletAddress, isConnected, updateLoading, handleError]);
  const updateUserProfile = useCallback(async (profileUpdates: Partial<UserProfile>) => {
    if (!walletAddress || !isConnected) return;

    try {
      updateLoading('profile', true);
      setError(null);

      // Garantir que temos os campos obrigatórios
      const currentProfile = userProfile || {
        walletAddress: walletAddress.toLowerCase(),
        totalNFTs: 0,
        totalMinted: 0,
        totalSpent: '0',
        lastActive: new Date() as any,
        preferences: {
          notifications: true,
          publicProfile: true,
          showEmail: false
        }
      };

      const updatedProfile: Omit<UserProfile, 'id' | 'joinedAt'> = {
        ...currentProfile,
        ...profileUpdates,
        walletAddress: walletAddress.toLowerCase()
      };

      await firestoreService.createOrUpdateUserProfile(updatedProfile);

      // Atualizar estado local
      setUserProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
    } catch (error) {
      handleError(error, 'updating user profile');
      throw error;
    } finally {
      updateLoading('profile', false);
    }
  }, [walletAddress, isConnected, userProfile, updateLoading, handleError]);

  // ========== NFT Methods ==========

  const loadUserNFTs = useCallback(async () => {
    if (!walletAddress || !isConnected) return;

    try {
      updateLoading('nfts', true);
      setError(null);

      const nfts = await firestoreService.getUserNFTs(walletAddress);
      setUserNFTs(nfts);
    } catch (error) {
      handleError(error, 'loading user NFTs');
    } finally {
      updateLoading('nfts', false);
    }
  }, [walletAddress, isConnected, updateLoading, handleError]);

  const saveNFTToFirestore = useCallback(async (nftData: Omit<NFTData, 'id' | 'mintedAt'>): Promise<string> => {
    try {
      updateLoading('nfts', true);
      setError(null);

      const nftId = await firestoreService.saveNFT(nftData);

      // Atualizar lista local
      // await loadUserNFTs(); // Comentado: NFTs devem ser buscados da carteira, não do Firebase

      // Atualizar estatísticas do usuário
      if (userProfile) {
        await firestoreService.updateUserStats(walletAddress!, {
          totalNFTs: userProfile.totalNFTs + 1,
          totalMinted: userProfile.totalMinted + 1,
          totalSpent: (parseFloat(userProfile.totalSpent) + parseFloat(nftData.mintPrice)).toString()
        });
      }

      return nftId;
    } catch (error) {
      handleError(error, 'saving NFT to Firestore');
      throw error;
    } finally {
      updateLoading('nfts', false);
    }
  }, [walletAddress, userProfile, loadUserNFTs, updateLoading, handleError]);

  // ========== Transaction Methods ==========

  const loadUserTransactions = useCallback(async () => {
    if (!walletAddress || !isConnected) return;

    try {
      updateLoading('transactions', true);
      setError(null);

      const transactions = await firestoreService.getUserTransactions(walletAddress);
      setUserTransactions(transactions);
    } catch (error) {
      handleError(error, 'loading user transactions');
    } finally {
      updateLoading('transactions', false);
    }
  }, [walletAddress, isConnected, updateLoading, handleError]);

  const saveTransaction = useCallback(async (transaction: Omit<TransactionHistory, 'id' | 'timestamp'>): Promise<string> => {
    try {
      updateLoading('transactions', true);
      setError(null);

      const transactionId = await firestoreService.saveTransaction(transaction);

      // Atualizar lista local
      await loadUserTransactions();

      return transactionId;
    } catch (error) {
      handleError(error, 'saving transaction');
      throw error;
    } finally {
      updateLoading('transactions', false);
    }
  }, [loadUserTransactions, updateLoading, handleError]);

  // ========== Game Stats Methods ==========

  const loadGameStats = useCallback(async () => {
    if (!walletAddress || !isConnected) return;

    try {
      updateLoading('gameStats', true);
      setError(null);

      const stats = await firestoreService.getGameStats(walletAddress);
      setGameStats(stats);
    } catch (error) {
      handleError(error, 'loading game stats');
    } finally {
      updateLoading('gameStats', false);
    }
  }, [walletAddress, isConnected, updateLoading, handleError]);

  const updateGameStats = useCallback(async (statsUpdates: Partial<GameStats>) => {
    if (!walletAddress || !isConnected) return;

    try {
      updateLoading('gameStats', true);
      setError(null);

      await firestoreService.updateGameStats(walletAddress, statsUpdates);

      // Atualizar estado local
      setGameStats(prev => prev ? { ...prev, ...statsUpdates } : null);
    } catch (error) {
      handleError(error, 'updating game stats');
      throw error;
    } finally {
      updateLoading('gameStats', false);
    }
  }, [walletAddress, isConnected, updateLoading, handleError]);

  // ========== Collection Stats Methods ==========

  const loadCollectionStats = useCallback(async () => {
    try {
      updateLoading('collectionStats', true);
      setError(null);

      const stats = await firestoreService.getCollectionStats();
      setCollectionStats(stats);
    } catch (error) {
      handleError(error, 'loading collection stats');
    } finally {
      updateLoading('collectionStats', false);
    }
  }, [updateLoading, handleError]);

  // ========== Search Methods ==========

  const searchNFTs = useCallback(async (searchTerm: string, filters?: any) => {
    try {
      updateLoading('search', true);
      setError(null);

      const results = await firestoreService.searchNFTs(searchTerm, filters);
      setSearchResults(results);
    } catch (error) {
      handleError(error, 'searching NFTs');
    } finally {
      updateLoading('search', false);
    }
  }, [updateLoading, handleError]);

  // ========== Effects ==========

  // Carregar dados quando wallet conecta
  useEffect(() => {
    if (isConnected && walletAddress) {
      loadUserProfile();
      // loadUserNFTs(); // Comentado: NFTs devem ser buscados da carteira, não do Firebase
      loadUserTransactions();
      loadGameStats();
    } else {
      // Limpar dados quando wallet desconecta
      setUserProfile(null);
      setUserNFTs([]);
      setUserTransactions([]);
      setGameStats(null);
    }
  }, [isConnected, walletAddress, loadUserProfile, loadUserNFTs, loadUserTransactions, loadGameStats]);

  // Carregar estatísticas da coleção uma vez
  useEffect(() => {
    loadCollectionStats();
  }, [loadCollectionStats]);

  return {
    // User Profile
    userProfile,
    updateUserProfile,

    // NFTs
    userNFTs,
    loadUserNFTs,
    saveNFTToFirestore,

    // Transactions
    userTransactions,
    loadUserTransactions,
    saveTransaction,

    // Game Stats
    gameStats,
    updateGameStats,

    // Collection Stats
    collectionStats,
    loadCollectionStats,

    // Search
    searchResults,
    searchNFTs,

    // Loading states
    loading,

    // Errors
    error
  };
};
