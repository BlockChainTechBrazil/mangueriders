import React, { useEffect, useState } from 'react';
import { useFirestore } from '../hooks/useFirestore';

interface NFTStatsCardProps {
  className?: string;
}

const NFTStatsCard: React.FC<NFTStatsCardProps> = ({ className = '' }) => {
  const { collectionStats, userProfile, userNFTs, loading, loadCollectionStats } = useFirestore();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadCollectionStats();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!collectionStats) {
      loadCollectionStats();
    }
  }, [collectionStats, loadCollectionStats]);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Collection Stats</h3>
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading.collectionStats}
          className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          {refreshing ? (
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>
      </div>

      {loading.collectionStats ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats Globais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {collectionStats?.totalNFTs || 0}
              </div>
              <div className="text-sm text-gray-600">Total NFTs</div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {collectionStats?.totalUsers || 0}
              </div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
          </div>

          {/* Stats do Usuário */}
          {userProfile && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Your Stats</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-lg">{userNFTs.length}</div>
                  <div className="text-gray-600">Owned</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">{userProfile.totalMinted}</div>
                  <div className="text-gray-600">Minted</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">{parseFloat(userProfile.totalSpent).toFixed(3)}</div>
                  <div className="text-gray-600">ETH Spent</div>
                </div>
              </div>
            </div>
          )}

          {/* NFTs Recentes */}
          {collectionStats?.recentMints && collectionStats.recentMints.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Recent Mints</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {collectionStats.recentMints.slice(0, 3).map((nft: any) => (
                  <div key={nft.id} className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                      {nft.imageUrl ? (
                        <img src={nft.imageUrl} alt={nft.name} className="w-full h-full object-cover rounded" />
                      ) : (
                        <span className="text-xs">#{nft.tokenId}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{nft.name}</div>
                      <div className="text-gray-500 text-xs">
                        {nft.rarity} • {nft.element}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NFTStatsCard;
