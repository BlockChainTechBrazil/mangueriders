import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useLocation } from 'react-router-dom';
// @ts-ignore - JS service typed via ambient modules
import nftContractService from '../services/nftContractService';
import ipfsMetadataService from '../services/ipfsMetadataService';
// @ts-ignore - JS module typed via ambient modules
import imageManager from '../utils/imageManager';

interface NFTInfo {
  tokenId: number;
  tokenType: string;
  rarity: string;
  element: string;
  uri: string;
  owner: string;
  tokenURI?: string;
  image?: string;
  metadata?: any;
}

interface WalletContextProps {
  isConnected: boolean;
  walletAddress: string | null;
  provider: any;
  signer: any;
  isCorrectNetwork: boolean;
  networkName: string;
  balance: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToSepoliaNetwork: () => Promise<boolean>;
  // Funções para NFTs reais
  buyNFT: (nftId: string, price: string) => Promise<{ success: boolean; txHash?: string; error?: string }>;
  mintNFT: (metadata: any) => Promise<{ success: boolean; txHash?: string; tokenId?: number; error?: string }>;
  refreshNFTs: () => Promise<void>; // Nova função para refresh manual
  ownedNFTs: NFTInfo[];
  contractInfo: any;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextProps>({
  isConnected: false,
  walletAddress: null,
  provider: null,
  signer: null,
  isCorrectNetwork: false,
  networkName: '',
  balance: '0',
  connectWallet: async () => { },
  disconnectWallet: () => { },
  switchToSepoliaNetwork: async () => false,
  // Valores iniciais para as novas funções
  buyNFT: async () => ({ success: false, error: 'Não implementado' }),
  mintNFT: async () => ({ success: false, error: 'Não implementado' }),
  refreshNFTs: async () => { }, // Nova função
  ownedNFTs: [],
  contractInfo: null,
  isLoading: false,
});

export const useWallet = () => useContext(WalletContext);

// Lista de rotas que não precisam verificação de rede ou NFTs
const NON_NFT_ROUTES = ['/gaya', '/landing'];

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [signer, setSigner] = useState<any>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(true);
  const [networkName, setNetworkName] = useState<string>('');
  const [balance, setBalance] = useState<string>('0');
  // Novos estados para NFTs
  const [ownedNFTs, setOwnedNFTs] = useState<NFTInfo[]>([]);
  const [contractInfo, setContractInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Usar o hook de location para determinar a rota atual
  const location = useLocation();
  const currentPath = location.pathname;

  // Determina se a rota atual precisa verificação de rede
  const shouldCheckNetwork = !NON_NFT_ROUTES.some(route =>
    currentPath === route || currentPath.startsWith(`${route}/`)
  );

  // Utilitário IPFS (cast para evitar conflitos de tipos de JS)
  const ipfs: any = ipfsMetadataService as any;
  // Verificar se a rede atual é a Sepolia testnet (chainId 11155111)
  const checkNetwork = async (provider: any) => {
    // Pular verificação se a rota atual não precisa de verificações de rede
    if (!shouldCheckNetwork) {
      // console.log removido
      setIsCorrectNetwork(true);
      setNetworkName('Não verificado');
      return true;
    } try {
      const network = await provider.getNetwork();
      // console.log removido

      // Para debug - verificar exatamente o valor e tipo de chainId
      const chainIdStr = network.chainId.toString();
      // console.log removido
      // console.log removido

      // Sepolia chainId é 11155111 (decimal) ou 0xaa36a7 (hex)
      // Comparando com valor decimal e hexadecimal para garantir
      const isSepoliaNetwork = (
        chainIdStr === "11155111" ||
        chainIdStr === "0xaa36a7"
      );

      setIsCorrectNetwork(isSepoliaNetwork);

      // Obter nome da rede
      let networkName = network.name;
      // Se o nome for desconhecido, mostrar o chainId
      if (networkName === 'unknown' || !networkName) {
        networkName = `Chain ID: ${chainIdStr}`;
      }

      // Para debug - adicione "(Sepolia)" ao nome se for a rede correta
      if (isSepoliaNetwork && networkName !== "sepolia") {
        networkName += " (Compatível)";
      } setNetworkName(networkName);
      // console.log removido
      // console.log removido

      return isSepoliaNetwork;
    } catch (error) {
      // console.error removido
      setIsCorrectNetwork(false);
      return false;
    }
  };

  // Obter saldo da carteira
  const getWalletBalance = async (address: string, provider: any) => {
    try {
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.formatEther(balance);
      setBalance(parseFloat(formattedBalance).toFixed(4));
    } catch (error) {
      // console.error removido
      setBalance('0');
    }
  };

  // Tentar mudar para a rede Sepolia
  const switchToSepoliaNetwork = async () => {
    try {
      const { ethereum } = window as any;

      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // 0xaa36a7 é o chainId hexadecimal da Sepolia
      });

      // Verificar novamente após a tentativa de troca
      if (provider) {
        await checkNetwork(provider);
      }

      return true;
    } catch (switchError: any) {
      // Código 4902 significa que a rede não está adicionada à MetaMask
      if (switchError.code === 4902) {
        try {
          const { ethereum } = window as any;

          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });

          // Verificar novamente após adicionar a rede
          if (provider) {
            await checkNetwork(provider);
          }

          return true;
        } catch (addError) {
          // console.error removido
          return false;
        }
      }

      // console.error removido
      return false;
    }
  };
  // Conectar à wallet
  const connectWallet = async () => {
    // console.log removido
    try {
      const { ethereum } = window as any;
      // console.log removido

      if (!ethereum) {
        // console.error removido
        throw new Error('MetaMask não encontrada. Por favor, instale a MetaMask.');
      }

      // console.log removido
      // Solicitar acesso à conta
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      // console.log removido

      if (accounts.length === 0) {
        // console.error removido
        throw new Error('Nenhuma conta autorizada.');
      }

      // Configurar provider e signer
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      setProvider(provider);
      setSigner(signer);

      // Verificar rede
      const isCorrectNetwork = await checkNetwork(provider);
      if (!isCorrectNetwork) {
        // Perguntar ao usuário se deseja trocar de rede
        const shouldSwitch = window.confirm('Você precisa estar na rede Sepolia para usar este app. Deseja trocar para a rede Sepolia?');

        if (shouldSwitch) {
          await switchToSepoliaNetwork();
        }
      }

      // Tudo certo, definir o endereço da wallet
      setWalletAddress(accounts[0]);
      setIsConnected(true);

      // Inicializar serviço de contratos NFT
      // console.log removido
      // console.log removido
      const initSuccess = await nftContractService.initialize(provider, signer);
      // console.log removido
      // console.log removido

      if (!initSuccess) {
        // console.error removido
        // Não falhar a conexão da wallet por causa do contrato
      } else {
        if (import.meta.env.DEV) console.log('✅ Contrato NFT inicializado com sucesso');
      }

      // Obter informações do contrato
      try {
        const contractInfo = await nftContractService.getContractInfo();
        setContractInfo(contractInfo);
        if (import.meta.env.DEV) console.log('✅ Informações do contrato carregadas:', contractInfo);
      } catch (error) {
        console.warn('⚠️ Contrato NFT não disponível:', error);
      }

      // Obter saldo da carteira
      await getWalletBalance(accounts[0], provider);

      // Buscar NFTs da carteira
      if (import.meta.env.DEV) console.log('🔄 Iniciando busca de NFTs...');
      await fetchOwnedNFTs(accounts[0], provider);

      // Armazenar o estado de conexão no localStorage
      localStorage.setItem('isWalletConnected', 'true');
    } catch (error: any) {
      console.error('Erro ao conectar carteira:', error);
      throw error;
    }
  };

  // Desconectar wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
    setProvider(null);
    setIsConnected(false);
    setBalance('0');

    // Remover o estado de conexão do localStorage
    localStorage.removeItem('isWalletConnected');
  };
  // Verificar se a wallet estava previamente conectada
  useEffect(() => {
    // Pular verificação se a rota atual não precisa de verificações de wallet
    if (!shouldCheckNetwork) {
      if (import.meta.env.DEV) console.log('[Wallet] Pulando inicialização da wallet nesta rota');
      return;
    }

    const { ethereum } = window as any;

    if (ethereum) {
      const checkConnection = async () => {
        // Verificar se o usuário estava previamente conectado
        const wasConnected = localStorage.getItem('isWalletConnected') === 'true';

        if (wasConnected) {
          try {
            // Tentar recuperar contas sem prompt
            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length > 0) {
              // Configurar provider
              const provider = new ethers.BrowserProvider(ethereum);
              const signer = await provider.getSigner();
              setProvider(provider);
              setSigner(signer);

              // Verificar rede
              await checkNetwork(provider);

              // Definir endereço da wallet
              setWalletAddress(accounts[0]);
              setIsConnected(true);

              // Inicializar contrato NFT aqui também
              if (import.meta.env.DEV) console.log('🔄 [useEffect] Inicializando contrato NFT...');
              try {
                const initSuccess = await nftContractService.initialize(provider, signer);
                if (import.meta.env.DEV) console.log('🔧 [useEffect] Resultado da inicialização:', initSuccess);

                if (initSuccess) {
                  // Buscar NFTs após inicializar o contrato
                  if (import.meta.env.DEV) console.log('🔄 [useEffect] Buscando NFTs...');
                  await fetchOwnedNFTs(accounts[0], provider);
                }
              } catch (contractError) {
                console.warn('⚠️ [useEffect] Erro ao inicializar contrato:', contractError);
              }

              // Obter saldo da carteira
              await getWalletBalance(accounts[0], provider);
            }
          } catch (error) {
            console.error('Erro ao restaurar conexão da wallet:', error);
            localStorage.removeItem('isWalletConnected');
          }
        }
      };

      checkConnection();

      // Adicionar listeners para eventos da MetaMask
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // Usuário desconectou via MetaMask
          disconnectWallet();
        } else if (accounts[0] !== walletAddress) {
          // Usuário trocou de conta
          setWalletAddress(accounts[0]);

          // Obter saldo da nova carteira
          if (provider) {
            await getWalletBalance(accounts[0], provider);
          }
        }
      };

      const handleChainChanged = () => {
        // Quando a rede muda, a página deve ser recarregada
        window.location.reload();
      };

      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      return () => {
        // Remover listeners quando o componente for desmontado
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [shouldCheckNetwork, currentPath]);  // Removidas walletAddress e provider para evitar loop infinito
  const fetchOwnedNFTs = async (address: string, provider: any) => {
    if (import.meta.env.DEV) console.log('🚀 [Wallet] === INÍCIO fetchOwnedNFTs ===');
    if (import.meta.env.DEV) console.log('🔍 [Wallet] Address:', address);
    if (import.meta.env.DEV) console.log('🔍 [Wallet] Provider:', !!provider);
    if (import.meta.env.DEV) console.log('🔍 [Wallet] shouldCheckNetwork:', shouldCheckNetwork);

    // Verificar se devemos pular a busca por NFTs baseado na rota
    if (!shouldCheckNetwork) {
      if (import.meta.env.DEV) console.log('[Wallet] Pulando busca de NFTs nesta rota');
      return;
    }

    if (!address || !provider) {
      if (import.meta.env.DEV) console.log('[Wallet] ❌ Address ou provider não fornecidos:', { address: !!address, provider: !!provider });
      return;
    }

    if (import.meta.env.DEV) console.log('🔄 [Wallet] Iniciando setIsLoading(true)');
    setIsLoading(true);
    try {
      if (import.meta.env.DEV) console.log('[Wallet] Buscando NFTs para a carteira:', address);
      if (import.meta.env.DEV) console.log('[Wallet] 🔧 Verificando se contrato está inicializado:', nftContractService.isInitialized());

      if (nftContractService.isInitialized()) {
        if (import.meta.env.DEV) console.log('[Wallet] ✅ Contrato inicializado, buscando NFTs...');

        // Buscar NFTs reais do contrato e enriquecer com metadata/tokenURI
        if (import.meta.env.DEV) console.log('[Wallet] 🚀 Chamando getWalletInfo para:', address);
        const walletInfo = await nftContractService.getWalletInfo(address);
        if (import.meta.env.DEV) console.log('📋 [Wallet] Wallet info recebido:', walletInfo);
        if (import.meta.env.DEV) console.log('📋 [Wallet] Tipo de ownedTokens:', typeof walletInfo.ownedTokens);
        if (import.meta.env.DEV) console.log('📋 [Wallet] Array.isArray(ownedTokens):', Array.isArray(walletInfo.ownedTokens));
        if (import.meta.env.DEV) console.log('📋 [Wallet] ownedTokens.length:', walletInfo.ownedTokens?.length);

        if (walletInfo.ownedTokens && walletInfo.ownedTokens.length > 0) {
          if (import.meta.env.DEV) console.log(`🎯 Encontrados ${walletInfo.ownedTokens.length} tokens:`, walletInfo.ownedTokens);

          const nftDetails = await Promise.all(
            walletInfo.ownedTokens.map(async (tokenId: number) => {
              if (import.meta.env.DEV) console.log('🔍 Buscando detalhes do token:', tokenId);
              const details = await nftContractService.getTokenDetails(tokenId);
              if (import.meta.env.DEV) console.log('📄 Detalhes do token:', details);

              let image: string | undefined = undefined;
              let metadata: any = null;
              try {
                const httpTokenUri = ipfs.convertIPFSToHTTP((details as any).tokenURI || (details as any).uri);
                if (import.meta.env.DEV) console.log('🌐 Token URI HTTP:', httpTokenUri);
                metadata = await ipfs.fetchNFTMetadata(httpTokenUri);
                if (import.meta.env.DEV) console.log('📊 Metadata:', metadata);
                const img = metadata?.image || metadata?.image_url;
                // Converter a imagem para gateway público também
                image = img ? ipfs.convertIPFSToHTTP(img) : undefined;
                if (import.meta.env.DEV) console.log('🖼️ Imagem convertida:', image);
              } catch (e) {
                console.warn('[Wallet] Falha ao obter metadata do token', tokenId, e);
              }
              return {
                ...(details as any),
                tokenURI: (details as any).tokenURI || (details as any).uri,
                image,
                metadata
              } as NFTInfo;
            })
          );
          if (import.meta.env.DEV) console.log('✅ NFTs encontrados:', nftDetails);
          setOwnedNFTs(nftDetails);
        } else {
          if (import.meta.env.DEV) console.log('📭 Nenhum token encontrado para esta carteira');
          setOwnedNFTs([]);
        }
      } else {
        if (import.meta.env.DEV) console.log('[Wallet] ❌ Contrato não inicializado, usando fallback');

        // Fallback para NFTs simulados se o contrato não estiver disponível
        const mockNFTs: NFTInfo[] = [
          {
            tokenId: 1,
            tokenType: 'Character',
            rarity: 'rare',
            element: 'fire',
            uri: imageManager.game.characters.charFire,
            image: `${window.location.origin}${imageManager.game.characters.charFire}`, // URL absoluta
            owner: address
          },
          {
            tokenId: 2,
            tokenType: 'Character',
            rarity: 'epic',
            element: 'water',
            uri: imageManager.game.characters.charWater,
            image: `${window.location.origin}${imageManager.game.characters.charWater}`, // URL absoluta
            owner: address
          }
        ];

        if (import.meta.env.DEV) console.log('[Wallet] 🎭 Usando NFTs mock:', mockNFTs);
        setOwnedNFTs(mockNFTs);
      }
    } catch (error) {
      console.error('Erro ao buscar NFTs:', error);
      setOwnedNFTs([]);
    } finally {
      setIsLoading(false);
    }
  };  // Função para comprar um NFT (transação real na blockchain)
  const buyNFT = async (nftId: string, price: string) => {
    setIsLoading(true);
    try {
      // Verificar se a carteira está conectada
      if (!isConnected || !walletAddress) {
        return { success: false, error: 'Carteira não conectada' };
      }

      // Verificar se está na rede correta (Sepolia)
      if (!isCorrectNetwork) {
        const switched = await switchToSepoliaNetwork();
        if (!switched) {
          return { success: false, error: 'É necessário estar na rede Sepolia' };
        }
      }
      // Endereço do "vendedor" de NFT (para fins de demonstração)
      // Usando getAddress para garantir o checksum correto
      const nftSellerAddress = ethers.getAddress("0x8c79ebed6eaa6a7eabfcd2033df61be1a0278c2e");

      // Criar uma transação real enviando ETH para simular uma compra
      // Em uma implementação de produção, isso seria uma chamada para um smart contract
      const signer = await provider.getSigner();
      // Converter o preço de ETH para Wei
      const priceInWei = ethers.parseEther(price);

      if (import.meta.env.DEV) console.log(`Enviando ${price} ETH para ${nftSellerAddress} para comprar NFT ${nftId}`);
      // Enviar a transação
      const tx = await signer.sendTransaction({
        to: nftSellerAddress,
        value: priceInWei
        // Removemos o campo data para simplificar a transação
      });

      if (import.meta.env.DEV) console.log("Transação enviada:", tx.hash);

      // Aguardar confirmação da transação
      const receipt = await tx.wait(1); // Aguardar pelo menos 1 bloco de confirmação
      if (import.meta.env.DEV) console.log("Transação confirmada:", receipt);      // Simular adição do NFT à lista (será substituído pelo mint real)
      const mockNFT: NFTInfo = {
        tokenId: Date.now(),
        tokenType: 'Character',
        rarity: 'rare',
        element: 'fire',
        uri: imageManager.game.characters.charFire,
        owner: walletAddress
      };

      setOwnedNFTs(prevNFTs => [...prevNFTs, mockNFT]);
      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      console.error('Erro ao comprar NFT:', error);
      return {
        success: false,
        error: error.message || 'Erro ao comprar NFT'
      };
    } finally {
      setIsLoading(false);
    }
  };
  // Nova função para mint de NFT real
  const mintNFT = async (metadata: any) => {
    setIsLoading(true);
    try {
      // Verificar se a carteira está conectada
      if (!isConnected || !walletAddress) {
        return { success: false, error: 'Carteira não conectada' };
      }

      // Verificar se está na rede correta (Sepolia)
      if (!isCorrectNetwork) {
        const switched = await switchToSepoliaNetwork();
        if (!switched) {
          return { success: false, error: 'É necessário estar na rede Sepolia' };
        }
      }

      // Verificar se o serviço de contratos está inicializado
      if (import.meta.env.DEV) console.log('🔍 Verificando se contrato está inicializado...');
      if (import.meta.env.DEV) console.log('🔧 nftContractService instance:', !!nftContractService);
      const contractInitialized = nftContractService.isInitialized();
      if (import.meta.env.DEV) console.log('🔍 Resultado da verificação isInitialized():', contractInitialized);

      if (!contractInitialized) {
        console.error('❌ Contrato NFT não está inicializado');
        if (import.meta.env.DEV) console.log('🔧 Tentando reinicializar contrato...');
        try {
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          const signer = await provider.getSigner();
          const reinitSuccess = await nftContractService.initialize(provider, signer);
          if (import.meta.env.DEV) console.log('🔧 Resultado da reinicialização:', reinitSuccess);
          if (!reinitSuccess) {
            return { success: false, error: 'Contrato NFT não disponível - falha na reinicialização' };
          }
        } catch (reinitError) {
          console.error('❌ Erro na reinicialização:', reinitError);
          return { success: false, error: 'Contrato NFT não disponível - erro na reinicialização' };
        }
      }

      if (import.meta.env.DEV) console.log('🔄 Iniciando mint de NFT...');

      // Executar mint através do serviço de contratos
      const result = await nftContractService.mintNFT(walletAddress, metadata);

      if (result.success) {
        if (import.meta.env.DEV) console.log('✅ NFT mintado com sucesso!');
        // Atualizar lista de NFTs
        if (import.meta.env.DEV) console.log('🔄 Atualizando lista de NFTs após mint...');
        await fetchOwnedNFTs(walletAddress, provider);
        // Aguardar um pouco e tentar novamente para garantir que o blockchain foi atualizado
        setTimeout(async () => {
          if (import.meta.env.DEV) console.log('🔄 Segunda tentativa de buscar NFTs...');
          await fetchOwnedNFTs(walletAddress, provider);
        }, 3000);
        return {
          success: true,
          txHash: result.transactionHash,
          tokenId: result.tokenId
        };
      } else {
        return {
          success: false,
          error: result.error || 'Erro no mint do NFT'
        };
      }
    } catch (error: any) {
      console.error('❌ Erro ao mintar NFT:', error);
      return {
        success: false,
        error: error.message || 'Erro ao mintar NFT'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Função para refresh manual dos NFTs
  const refreshNFTs = async () => {
    if (isConnected && walletAddress && provider) {
      if (import.meta.env.DEV) console.log('🔄 Refresh manual dos NFTs...');

      // Verificar se o contrato está inicializado
      if (!nftContractService.isInitialized()) {
        if (import.meta.env.DEV) console.log('🔧 Contrato não inicializado, tentando inicializar...');
        const signer = await provider.getSigner();
        const initSuccess = await nftContractService.initialize(provider, signer);
        if (import.meta.env.DEV) console.log('🔧 Resultado da inicialização no refresh:', initSuccess);
      }

      await fetchOwnedNFTs(walletAddress, provider);
    }
  };

  const value = {
    isConnected,
    walletAddress,
    provider,
    signer,
    isCorrectNetwork,
    networkName,
    balance,
    connectWallet,
    disconnectWallet,
    switchToSepoliaNetwork,
    // Funções e estados para NFTs
    buyNFT,
    mintNFT,
    refreshNFTs,
    ownedNFTs,
    contractInfo,
    isLoading,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
