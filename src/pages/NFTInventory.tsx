import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../components/ui/ToastProvider';

const NFTInventory: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { isConnected, walletAddress, ownedNFTs, refreshNFTs } = useWallet();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const didFetchRef = useRef(false);

  // Buscar NFTs quando a tela for carregada
  useEffect(() => {
    const fetchNFTsOnLoad = async () => {
      if (isConnected && walletAddress && !didFetchRef.current) {
        didFetchRef.current = true;
        setIsLoading(true);
        try {
          await refreshNFTs();
        } catch (error) {
          console.error('Erro ao buscar NFTs:', error);
          showToast('Erro ao carregar NFTs', 'error');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchNFTsOnLoad();
  }, [isConnected, walletAddress]);

  const handleNFTClick = (nft: any) => {
    setSelectedNFT(nft);
    setShowModal(true);
  };

  const handleRefresh = async () => {
    if (!isConnected) {
      showToast('Conecte sua carteira primeiro', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await refreshNFTs();
      showToast('NFTs atualizados com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar NFTs:', error);
      showToast('Erro ao atualizar NFTs', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const NFTCard: React.FC<{ nft: any }> = ({ nft }) => (
    <div 
      className="bg-gray-800 bg-opacity-75 rounded-xl p-4 border border-purple-500 border-opacity-30 hover:border-opacity-60 transition-all duration-300 cursor-pointer transform hover:scale-105"
      onClick={() => handleNFTClick(nft)}
    >
      <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {nft.metadata?.image ? (
          <img 
            src={nft.metadata.image} 
            alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder/nft-placeholder.png';
            }}
          />
        ) : (
          <div className="text-6xl">💎</div>
        )}
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2 truncate">
        {nft.metadata?.name || `NFT #${nft.tokenId}`}
      </h3>
      
      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
        {nft.metadata?.description || 'NFT exclusivo do MangueRiders'}
      </p>
      
      <div className="flex justify-between items-center">
        <span className="text-purple-400 font-semibold">
          #{nft.tokenId}
        </span>
        <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs">
          {nft.metadata?.attributes?.find((attr: any) => attr.trait_type === 'Rarity')?.value || 'Comum'}
        </span>
      </div>
    </div>
  );

  const NFTModal: React.FC = () => {
    if (!selectedNFT) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedNFT.metadata?.name || `NFT #${selectedNFT.tokenId}`}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center overflow-hidden">
                {selectedNFT.metadata?.image ? (
                  <img 
                    src={selectedNFT.metadata.image} 
                    alt={selectedNFT.metadata?.name || `NFT #${selectedNFT.tokenId}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder/nft-placeholder.png';
                    }}
                  />
                ) : (
                  <div className="text-8xl">💎</div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Descrição</h3>
                  <p className="text-gray-300">
                    {selectedNFT.metadata?.description || 'NFT exclusivo do MangueRiders'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Detalhes</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token ID:</span>
                      <span className="text-white">#{selectedNFT.tokenId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Contrato:</span>
                      <span className="text-white font-mono text-xs">
                        {selectedNFT.contractAddress?.slice(0, 6)}...{selectedNFT.contractAddress?.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedNFT.metadata?.attributes && selectedNFT.metadata.attributes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">Atributos</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedNFT.metadata.attributes.map((attr: any, index: number) => (
                        <div key={index} className="bg-gray-800 p-2 rounded">
                          <div className="text-xs text-gray-400">{attr.trait_type}</div>
                          <div className="text-sm text-white font-semibold">{attr.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold mb-4">Carteira Não Conectada</h1>
          <p className="text-xl opacity-90 mb-8">Conecte sua carteira para ver seus NFTs</p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-semibold transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Meus NFTs 💎
            </h1>
            <p className="text-xl opacity-90 mb-6">Coleção exclusiva do MangueRiders</p>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-1 rounded-full">
                <div className="bg-black rounded-full px-6 py-3 flex items-center gap-3">
                  <span className="text-purple-400 font-semibold">Carteira:</span>
                  <span className="text-white font-mono text-sm">
                    {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-6 py-3 rounded-full font-semibold transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Carregando...
                  </>
                ) : (
                  <>
                    🔄 Atualizar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* NFTs Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-xl">Carregando seus NFTs...</p>
              </div>
            </div>
          ) : (Array.isArray(ownedNFTs) ? ownedNFTs.length : 0) > 0 ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-purple-400">
                  {ownedNFTs.length} NFT{ownedNFTs.length !== 1 ? 's' : ''} encontrado{ownedNFTs.length !== 1 ? 's' : ''}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.isArray(ownedNFTs) && ownedNFTs.map((nft, index) => (
                  <NFTCard key={`${nft.contractAddress}-${nft.tokenId}-${index}`} nft={nft} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-3xl font-bold mb-4">Nenhum NFT Encontrado</h2>
              <p className="text-xl opacity-90 mb-8">
                Você ainda não possui NFTs do MangueRiders
              </p>
              <button
                onClick={() => navigate('/game')}
                className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Jogar para Ganhar NFTs
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && <NFTModal />}
    </div>
  );
};

export default NFTInventory;
