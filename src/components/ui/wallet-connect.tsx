import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletConnectProps {
  onConnect?: (address: string, provider: any) => void;
  onDisconnect?: () => void;
  className?: string;
  buttonText?: {
    connect: string;
    connecting: string;
    connected: string;
    installMetamask: string;
    wrongNetwork: string;
  };
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onDisconnect,
  className = '',
  buttonText = {
    connect: 'Conectar Wallet',
    connecting: 'Conectando...',
    connected: 'Conectado',
    installMetamask: 'Instalar MetaMask',
    wrongNetwork: 'Rede Incorreta',
  },
}) => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string>('');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tokenBalance, setTokenBalance] = useState<string>('0');
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Verificar se o MetaMask está instalado
  const checkIfWalletIsInstalled = () => {
    const { ethereum } = window as any;
    return Boolean(ethereum);
  };

  // Verificar se a rede atual é a Sepolia testnet (chainId 11155111)
  const checkNetwork = async (provider: any) => {
    try {
      const network = await provider.getNetwork();
      console.log('Rede atual:', network);

      // Sepolia chainId é 11155111
      // Usando toString para compatibilidade com versões anteriores a ES2020
      const isSepoliaNetwork = network.chainId.toString() === "11155111";
      setIsCorrectNetwork(isSepoliaNetwork);

      // Obter nome da rede
      setNetworkName(network.name === 'unknown' ? `Chain ID: ${network.chainId.toString()}` : network.name);

      return isSepoliaNetwork;
    } catch (error) {
      console.error('Erro ao checar rede:', error);
      setIsCorrectNetwork(false);
      return false;
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

          return true;
        } catch (addError) {
          console.error('Erro ao adicionar rede Sepolia:', addError);
          return false;
        }
      }

      console.error('Erro ao trocar para rede Sepolia:', switchError);
      return false;
    }
  };

  // Conectar à wallet
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      const { ethereum } = window as any;

      if (!ethereum) {
        setError('MetaMask não encontrada. Por favor, instale a MetaMask.');
        setIsConnecting(false);
        return;
      }

      // Solicitar acesso à conta
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      if (accounts.length === 0) {
        setError('Nenhuma conta autorizada.');
        setIsConnecting(false);
        return;
      }

      // Configurar provider
      const provider = new ethers.BrowserProvider(ethereum);
      setProvider(provider);

      // Verificar rede
      const isCorrectNetwork = await checkNetwork(provider);
      if (!isCorrectNetwork) {
        setError('Por favor, conecte-se à rede Sepolia.');
        setIsConnecting(false);

        // Perguntar ao usuário se deseja trocar de rede
        const shouldSwitch = window.confirm('Você precisa estar na rede Sepolia para usar este app. Deseja trocar para a rede Sepolia?');

        if (shouldSwitch) {
          await switchToSepoliaNetwork();
          // Verificar novamente após a tentativa de troca
          await checkNetwork(provider);
        }

        return;
      }      // Tudo certo, definir o endereço da wallet
      setWalletAddress(accounts[0]);

      // Buscar apenas saldo de tokens - o histórico será carregado somente quando solicitado
      await fetchTokenBalance(accounts[0], provider);

      // Chamar callback externo, se fornecido
      if (onConnect) {
        onConnect(accounts[0], provider);
      }

      // Armazenar o estado de conexão no localStorage
      localStorage.setItem('isWalletConnected', 'true');
    } catch (error: any) {
      console.error('Erro ao conectar carteira:', error);
      setError(error.message || 'Ocorreu um erro ao conectar à carteira.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Desconectar wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
    setProvider(null);
    setError(null);

    // Remover o estado de conexão do localStorage
    localStorage.removeItem('isWalletConnected');

    // Chamar callback externo, se fornecido
    if (onDisconnect) {
      onDisconnect();
    }
  };

  // Verificar se a wallet estava previamente conectada
  useEffect(() => {
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
              setProvider(provider);

              // Verificar rede
              await checkNetwork(provider);              // Definir endereço da wallet
              setWalletAddress(accounts[0]);

              // Buscar apenas saldo de tokens - o histórico será carregado somente quando solicitado
              await fetchTokenBalance(accounts[0], provider);

              // Chamar callback externo, se fornecido
              if (onConnect) {
                onConnect(accounts[0], provider);
              }
            }
          } catch (error) {
            console.error('Erro ao restaurar conexão da wallet:', error);
            localStorage.removeItem('isWalletConnected');
          }
        }
      };

      checkConnection();

      // Adicionar listeners para eventos da MetaMask
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // Usuário desconectou via MetaMask
          disconnectWallet();
        } else {
          // Usuário trocou de conta
          setWalletAddress(accounts[0]);

          if (onConnect && provider) {
            onConnect(accounts[0], provider);
          }
        }
      };

      const handleChainChanged = (chainId: string) => {
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
  }, [onConnect, provider]);

  // Função para formatar o endereço da wallet
  const formatAddress = (address: string): string => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Determinar texto do botão
  const getButtonText = () => {
    if (!checkIfWalletIsInstalled()) return buttonText.installMetamask;
    if (isConnecting) return buttonText.connecting;
    if (walletAddress) return buttonText.connected;
    if (!isCorrectNetwork) return buttonText.wrongNetwork;
    return buttonText.connect;
  };

  // Determinar ação do botão
  const handleButtonClick = () => {
    if (!checkIfWalletIsInstalled()) {
      window.open('https://metamask.io', '_blank');
    } else if (walletAddress) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };
  // Buscar histórico de transações
  const fetchTransactionHistory = async (address: string) => {
    try {
      // Se não temos um endereço, não prosseguimos
      if (!address) return;

      // Vamos gerar transações simuladas para fins de demonstração
      // Quando estiver usando Etherscan em produção, descomente o código abaixo e use sua apiKey

      /* 
      const apiKey = 'SUA_API_KEY_AQUI'; 
      const apiUrl = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
      if (data.status === '1' && Array.isArray(data.result)) {
        // Limitar a 10 transações mais recentes
        const recentTransactions = data.result.slice(0, 10).map((tx: any) => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: ethers.formatEther(tx.value),
          timeStamp: new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString(),
        }));
        
        setTransactions(recentTransactions);
      } else {
        console.error('Erro ao buscar histórico:', data.message || 'Erro desconhecido');
        setTransactions([]);
      }
      */

      // Dados simulados para fins de demonstração em desenvolvimento
      // Remova esses dados quando for utilizar a API real
      const mockTransactions = [
        {
          hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          from: address,
          to: '0xD8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
          value: '0.05',
          timeStamp: new Date(Date.now() - 86400000).toLocaleDateString(),
        },
        {
          hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          from: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          to: address,
          value: '0.1',
          timeStamp: new Date(Date.now() - 172800000).toLocaleDateString(),
        },
        {
          hash: '0x0987654321fedcba0987654321fedcba0987654321fedcba0987654321fedcba',
          from: address,
          to: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          value: '0.025',
          timeStamp: new Date(Date.now() - 259200000).toLocaleDateString(),
        }
      ];

      setTransactions(mockTransactions);

    } catch (error) {
      console.error('Erro ao buscar histórico de transações:', error);
      setTransactions([]);
    }
  };
  // Buscar saldo de tokens RiderCoin (ERC-20)
  const fetchTokenBalance = async (address: string, provider: any) => {
    try {
      // Se não temos um endereço ou provider, não prosseguimos
      if (!address || !provider) return;

      // BLOCO COMENTADO: Código real para quando o contrato estiver implantado
      /* 
      // Endereço do contrato RiderCoin - substitua quando o contrato estiver implantado
      const tokenAddress = '0x123...'; 
      
      // ABI simplificado para um token ERC-20
      const tokenAbi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)"
      ];
      
      // Criar instância do contrato
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);
      
      try {
        // Tentar buscar o saldo do token
        const balance = await tokenContract.balanceOf(address);
        const decimals = await tokenContract.decimals();
        const symbol = await tokenContract.symbol();
        
        // Formatar o saldo
        const formattedBalance = ethers.formatUnits(balance, decimals);
        setTokenBalance(`${formattedBalance} ${symbol}`);
      } catch (contractError) {
        console.log('Token RiderCoin não encontrado ou ainda não implantado');
        setTokenBalance('RiderCoin ainda não disponível');
      }
      */

      // Saldo simulado para desenvolvimento
      setTokenBalance(`1000 RIDER`);

    } catch (error) {
      console.error('Erro ao buscar saldo de tokens:', error);
      setTokenBalance('Erro ao buscar tokens');
    }
  };

  // Controlar o carregamento de transações quando o usuário solicitar
  useEffect(() => {
    if (walletAddress && showHistory && transactions.length === 0) {
      fetchTransactionHistory(walletAddress);
    }
  }, [walletAddress, showHistory]);

  return (
    <div className={`flex flex-col ${className}`}>
      <button
        onClick={handleButtonClick}
        disabled={isConnecting}
        className={`px-4 py-2 rounded-full flex items-center justify-center transition-all
          ${walletAddress
            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
            : !isCorrectNetwork
              ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
          }
          font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]`}
      >
        <div className="flex items-center">
          {/* Ícone da carteira */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="mr-2"
            viewBox="0 0 16 16"
          >
            <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
          </svg>

          {getButtonText()}

          {/* Mostrar endereço da carteira se estiver conectado */}
          {walletAddress && (
            <span className="ml-2 bg-black bg-opacity-20 px-2 py-1 rounded-full text-xs">
              {formatAddress(walletAddress)}
            </span>
          )}
        </div>
      </button>

      {/* Mostrar erro, se houver */}
      {error && (
        <div className="text-red-500 text-sm mt-2 bg-red-100 p-2 rounded">
          {error}
        </div>
      )}

      {/* Mostrar informações da rede */}
      {walletAddress && networkName && (
        <div className={`text-xs mt-2 text-center ${isCorrectNetwork ? 'text-green-500' : 'text-orange-500'}`}>
          Rede: {networkName}
          {!isCorrectNetwork && (
            <button
              onClick={switchToSepoliaNetwork}
              className="ml-2 text-blue-500 hover:text-blue-700 underline"
            >
              Trocar para Sepolia
            </button>
          )}
        </div>
      )}      {/* Botão para mostrar/ocultar histórico */}
      {walletAddress && (
        <div className="mt-3 text-center">
          <button
            onClick={() => {
              // Alternar visibilidade do histórico
              setShowHistory(prev => !prev);
            }}
            className="px-3 py-1 bg-purple-800/50 hover:bg-purple-700/60 text-xs rounded-full text-purple-100"
          >
            {showHistory ? 'Ocultar Histórico' : 'Ver Histórico de Transações'}
          </button>
        </div>
      )}

      {/* Mostrar histórico de transações */}
      {showHistory && (
        <div className="mt-3 max-h-60 overflow-y-auto bg-gradient-to-r from-gray-900/80 to-blue-900/30 rounded-lg border border-blue-500/30">
          <div className="p-3 border-b border-blue-500/30">
            <h3 className="text-sm font-semibold text-blue-300">Histórico de Transações</h3>
          </div>

          {transactions.length > 0 ? (
            <ul className="divide-y divide-blue-700/30">
              {transactions.map((tx) => (
                <li key={tx.hash} className="p-2 hover:bg-blue-800/20">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">{tx.timeStamp}</span>
                      <span className="text-xs text-blue-300">{tx.value} ETH</span>
                    </div>
                    <div className="text-xs mt-1">
                      <span className="text-gray-400">De: </span>
                      <span className="text-gray-300">{formatAddress(tx.from)}</span>
                    </div>
                    <div className="text-xs mt-1">
                      <span className="text-gray-400">Para: </span>
                      <span className="text-gray-300">{formatAddress(tx.to)}</span>
                    </div>
                    <div className="mt-1">
                      <a
                        href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 underline"
                      >
                        Ver na Etherscan
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-400">
              {isConnecting ? 'Buscando transações...' : 'Nenhuma transação encontrada.'}
            </div>
          )}
        </div>
      )}
      {/* Mostrar saldo do token RiderCoin */}
      {walletAddress && (
        <div className="mt-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-3 rounded-lg border border-purple-500/30 text-center">
          <div className="font-medium text-purple-200 mb-1">Seu Saldo de RiderCoin</div>
          <div className="text-lg font-bold text-white">{tokenBalance}</div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
