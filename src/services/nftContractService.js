import { ethers } from 'ethers';

// ABI do contrato MangueRiderNFT (completo do deploy)
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721IncorrectOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ERC721InsufficientApproval",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidOperator",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC721InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ERC721NonexistentToken",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_fromTokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_toTokenId",
        "type": "uint256"
      }
    ],
    "name": "BatchMetadataUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "ContractWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "MetadataUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bool",
        "name": "paused",
        "type": "bool"
      }
    ],
    "name": "MintPausedChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "tokenType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "rarity",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "element",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      }
    ],
    "name": "NFTMinted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "inputs": [],
    "name": "MAX_MINT_PER_WALLET",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_SUPPLY",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MINT_PRICE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "recipients",
        "type": "address[]"
      },
      {
        "internalType": "string[]",
        "name": "tokenURIs",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "tokenTypes",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "rarities",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "elements",
        "type": "string[]"
      }
    ],
    "name": "batchMintOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      }
    ],
    "name": "getRemainingMints",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getTokenElement",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getTokenInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "tokenType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "rarity",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "element",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "uri",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getTokenRarity",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getTokenType",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner_",
        "type": "address"
      }
    ],
    "name": "getTokensOfOwner",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      }
    ],
    "name": "getWalletMintCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "tokenURI_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "tokenType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "rarity",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "element",
        "type": "string"
      }
    ],
    "name": "mintNFT",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintPaused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pauseMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "setMintPrice",
    "outputs": [],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpauseMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

// Configurações do contrato
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';
const NETWORK_NAME = import.meta.env.VITE_NETWORK_NAME || 'sepolia';
const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || '11155111');

class NFTContractService {
  constructor() {
    this.contract = null;
    this.provider = null;
    this.signer = null;
  }

  /**
   * Inicializa a conexão com o contrato
   */
  async initialize(provider, signer) {
    try {
      console.log('🚀 Inicializando NFT Contract Service...');
      console.log('🔧 Provider:', !!provider);
      console.log('🔧 Signer:', !!signer);

      if (!provider || !signer) {
        console.error('❌ Provider ou Signer não fornecidos');
        return false;
      }

      this.provider = provider;
      this.signer = signer;

      console.log('🔧 Debug - CONTRACT_ADDRESS:', CONTRACT_ADDRESS);
      console.log('🔧 Debug - env var VITE_CONTRACT_ADDRESS:', import.meta.env.VITE_CONTRACT_ADDRESS);
      console.log('🔧 Debug - todas as env vars:', Object.keys(import.meta.env).filter(key => key.includes('CONTRACT')));

      if (!CONTRACT_ADDRESS) {
        console.error('❌ CONTRACT_ADDRESS está vazio ou undefined');
        return false;
      }

      if (!ethers.isAddress(CONTRACT_ADDRESS)) {
        console.error('❌ CONTRACT_ADDRESS não é um endereço válido:', CONTRACT_ADDRESS);
        return false;
      }

      console.log('🔄 Criando instância do contrato...');
      // Criar instância do contrato
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      console.log('✅ NFT Contract initialized:', CONTRACT_ADDRESS);
      console.log('✅ Contract instance created:', !!this.contract);

      // Verificar se a instância foi criada corretamente
      if (!this.contract) {
        console.error('❌ Falha ao criar instância do contrato');
        return false;
      }

      // Testar se o contrato responde (sem falhar a inicialização)
      try {
        console.log('🔄 Testando conectividade do contrato...');
        const name = await this.contract.name();
        console.log('✅ Contract name:', name);
        console.log('✅ Contrato responde corretamente');
      } catch (testError) {
        console.warn('⚠️ Erro ao testar contrato (pode ser normal em development):', testError.message);
        // Não falhar a inicialização por causa deste teste
      }

      console.log('✅ Inicialização do contrato concluída com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Error initializing NFT contract:', error);
      console.error('❌ Error stack:', error.stack);
      this.contract = null; // Garantir que seja null em caso de erro
      return false;
    }
  }

  /**
   * Obtém o endereço do contrato
   */
  getContractAddress() {
    return CONTRACT_ADDRESS;
  }

  /**
   * Verifica se o contrato está inicializado
   */
  isInitialized() {
    const initialized = this.contract !== null;
    console.log('🔍 isInitialized check:', {
      contractExists: !!this.contract,
      initialized,
      contractAddress: CONTRACT_ADDRESS
    });
    return initialized;
  }

  /**
   * Obtém informações básicas do contrato
   */
  async getContractInfo() {
    if (!this.isInitialized()) {
      throw new Error('Contract not initialized');
    }

    try {
      const [totalSupply, mintPrice, maxSupply, maxMintPerWallet] = await Promise.all([
        this.contract.totalSupply(),
        this.contract.MINT_PRICE(),
        this.contract.MAX_SUPPLY(),
        this.contract.MAX_MINT_PER_WALLET()
      ]);

      return {
        totalSupply: Number(totalSupply),
        mintPrice: ethers.formatEther(mintPrice),
        maxSupply: Number(maxSupply),
        maxMintPerWallet: Number(maxMintPerWallet),
        contractAddress: CONTRACT_ADDRESS,
        networkName: NETWORK_NAME,
        chainId: CHAIN_ID
      };
    } catch (error) {
      console.error('❌ Error getting contract info:', error);
      throw error;
    }
  }

  /**
   * Obtém informações da wallet
   */
  async getWalletInfo(walletAddress) {
    console.log('🔍 [NFTContract] getWalletInfo iniciado para:', walletAddress);

    if (!this.isInitialized()) {
      console.log('❌ [NFTContract] Contrato não inicializado');
      throw new Error('Contract not initialized');
    }

    console.log('✅ [NFTContract] Contrato inicializado, fazendo chamadas...');
    console.log('📋 [NFTContract] Contract address:', this.contractAddress);
    console.log('📋 [NFTContract] Contract instance:', !!this.contract);

    try {
      // Verificar se as funções existem no contrato
      console.log('🔧 [NFTContract] Verificando funções disponíveis...');
      console.log('🔧 [NFTContract] getTokensOfOwner existe:', typeof this.contract.getTokensOfOwner === 'function');
      console.log('🔧 [NFTContract] getWalletMintCount existe:', typeof this.contract.getWalletMintCount === 'function');
      console.log('🔧 [NFTContract] getRemainingMints existe:', typeof this.contract.getRemainingMints === 'function');
      console.log('🔧 [NFTContract] balanceOf existe:', typeof this.contract.balanceOf === 'function');
      console.log('🔧 [NFTContract] tokenOfOwnerByIndex existe:', typeof this.contract.tokenOfOwnerByIndex === 'function');
      console.log('🔧 [NFTContract] ownerOf existe:', typeof this.contract.ownerOf === 'function');
      console.log('🔧 [NFTContract] totalSupply existe:', typeof this.contract.totalSupply === 'function');

      console.log('📞 [NFTContract] Chamando getTokensOfOwner...');
      const ownedTokens = await this.contract.getTokensOfOwner(walletAddress);
      console.log('📋 [NFTContract] Tokens brutos retornados:', ownedTokens);
      console.log('📋 [NFTContract] Tipo de tokens retornados:', typeof ownedTokens);
      console.log('� [NFTContract] É array:', Array.isArray(ownedTokens));
      console.log('📋 [NFTContract] Length:', ownedTokens?.length);

      console.log('�📞 [NFTContract] Chamando getWalletMintCount...');
      const mintCount = await this.contract.getWalletMintCount(walletAddress);
      console.log('🔢 [NFTContract] Mint count:', mintCount);

      console.log('📞 [NFTContract] Chamando getRemainingMints...');
      const remainingMints = await this.contract.getRemainingMints(walletAddress);
      console.log('⏳ [NFTContract] Remaining mints:', remainingMints);

      // Método alternativo usando balanceOf e tokenOfOwnerByIndex se getTokensOfOwner retornar vazio
      if (!ownedTokens || ownedTokens.length === 0) {
        console.log('🔄 [NFTContract] getTokensOfOwner retornou vazio, tentando método alternativo...');
        try {
          const balance = await this.contract.balanceOf(walletAddress);
          const balanceNum = Number(balance);
          console.log('💰 [NFTContract] Balance do usuário:', balanceNum);

          if (balanceNum > 0) {
            console.log('🔍 [NFTContract] Usuário tem NFTs, buscando tokens...');
            const alternativeTokens = [];

            // Se tokenOfOwnerByIndex existe, usar ele
            if (typeof this.contract.tokenOfOwnerByIndex === 'function') {
              console.log('📋 [NFTContract] Usando tokenOfOwnerByIndex...');
              for (let i = 0; i < balanceNum; i++) {
                try {
                  const tokenId = await this.contract.tokenOfOwnerByIndex(walletAddress, i);
                  alternativeTokens.push(tokenId);
                  console.log(`🎯 [NFTContract] Token encontrado: ${tokenId}`);
                } catch (indexError) {
                  console.warn(`⚠️ [NFTContract] Erro no índice ${i}:`, indexError);
                }
              }
            } else {
              console.log('📋 [NFTContract] tokenOfOwnerByIndex não disponível, tentando varredura...');
              // Método de varredura: verificar tokens recentemente mintados
              try {
                const totalSupply = await this.contract.totalSupply();
                const totalSupplyNum = Number(totalSupply);
                console.log('📊 [NFTContract] Total supply:', totalSupplyNum);

                // Verificar os últimos 100 tokens (ou totalSupply se menor)
                const startToken = Math.max(1, totalSupplyNum - 100);
                console.log(`🔍 [NFTContract] Verificando tokens de ${startToken} a ${totalSupplyNum}...`);

                for (let tokenId = startToken; tokenId <= totalSupplyNum; tokenId++) {
                  try {
                    const owner = await this.contract.ownerOf(tokenId);
                    if (owner.toLowerCase() === walletAddress.toLowerCase()) {
                      alternativeTokens.push(BigInt(tokenId));
                      console.log(`🎯 [NFTContract] Token ${tokenId} pertence ao usuário`);
                      if (alternativeTokens.length >= balanceNum) break; // Parar se já encontramos todos
                    }
                  } catch {
                    // Token pode não existir, continuar
                  }
                }
              } catch (supplyError) {
                console.warn('⚠️ [NFTContract] Erro ao obter totalSupply:', supplyError);
              }
            }

            if (alternativeTokens.length > 0) {
              console.log('✅ [NFTContract] Substituindo por tokens do método alternativo:', alternativeTokens);
              ownedTokens.splice(0, ownedTokens.length, ...alternativeTokens);
            }
          }
        } catch (alternativeError) {
          console.warn('⚠️ [NFTContract] Método alternativo falhou:', alternativeError);
        }
      }

      const processedTokens = ownedTokens.map(token => Number(token));
      console.log('🔄 [NFTContract] Tokens processados:', processedTokens);

      const result = {
        ownedTokens: processedTokens,
        mintCount: Number(mintCount),
        remainingMints: Number(remainingMints)
      };

      console.log('✅ [NFTContract] Resultado final getWalletInfo:', result);
      return result;
    } catch (error) {
      console.error('❌ [NFTContract] Error getting wallet info:', error);
      console.error('❌ [NFTContract] Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        data: error.data
      });
      throw error;
    }
  }

  /**
   * Obtém detalhes de um NFT específico
   */
  async getTokenDetails(tokenId) {
    if (!this.isInitialized()) {
      throw new Error('Contract not initialized');
    }

    try {
      const [tokenInfo, owner, tokenURI] = await Promise.all([
        this.contract.getTokenInfo(tokenId),
        this.contract.ownerOf(tokenId),
        this.contract.tokenURI(tokenId)
      ]);

      return {
        tokenId,
        tokenType: tokenInfo[0],
        rarity: tokenInfo[1],
        element: tokenInfo[2],
        uri: tokenInfo[3],
        owner,
        tokenURI
      };
    } catch (error) {
      console.error('❌ Error getting token details:', error);
      throw error;
    }
  }

  /**
   * Minta um novo NFT
   */
  async mintNFT(toAddress, metadata) {
    if (!this.isInitialized()) {
      throw new Error('Contract not initialized');
    }

    try {
      const { tokenType, rarity, element, tokenURI } = metadata;

      // Obtém o preço de mint
      const mintPrice = await this.contract.MINT_PRICE();

      console.log('🔄 Minting NFT...');
      console.log('To:', toAddress);
      console.log('Metadata:', metadata);
      console.log('Price:', ethers.formatEther(mintPrice), 'ETH');

      // Executa a transação de mint
      const transaction = await this.contract.mintNFT(
        toAddress,
        tokenURI,
        tokenType,
        rarity,
        element,
        {
          value: mintPrice,
          gasLimit: 300000 // Limite de gas estimado
        }
      );

      console.log('📄 Transaction sent:', transaction.hash);

      // Aguarda a confirmação
      const receipt = await transaction.wait();

      console.log('✅ NFT minted successfully!');
      console.log('Block:', receipt.blockNumber);
      console.log('Gas used:', receipt.gasUsed.toString());

      // Busca o evento de mint para obter o tokenId
      const mintEvent = receipt.events?.find(event => event.event === 'NFTMinted');
      const tokenId = mintEvent?.args?.tokenId ? Number(mintEvent.args.tokenId) : undefined;

      return {
        success: true,
        transactionHash: transaction.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        tokenId,
        metadata
      };
    } catch (error) {
      console.error('❌ Error minting NFT:', error);

      // Trata diferentes tipos de erro
      let errorMessage = 'Unknown error occurred';

      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for minting';
      } else if (error.message.includes('Max mint per wallet reached')) {
        errorMessage = 'Maximum mints per wallet reached';
      } else if (error.message.includes('Max supply reached')) {
        errorMessage = 'Maximum supply reached';
      } else if (error.code === 4001) {
        errorMessage = 'Transaction rejected by user';
      }

      return {
        success: false,
        error: errorMessage,
        originalError: error
      };
    }
  }

  /**
   * Estima o gas necessário para mint
   */
  async estimateMintGas(toAddress, metadata) {
    if (!this.isInitialized()) {
      throw new Error('Contract not initialized');
    }

    try {
      const { tokenType, rarity, element, tokenURI } = metadata;
      const mintPrice = await this.contract.MINT_PRICE();

      const gasEstimate = await this.contract.estimateGas.mintNFT(
        toAddress,
        tokenURI,
        tokenType,
        rarity,
        element,
        { value: mintPrice }
      );

      return Number(gasEstimate);
    } catch (error) {
      console.error('❌ Error estimating gas:', error);
      return 300000; // Fallback gas limit
    }
  }

  /**
   * Obtém histórico de mints
   */
  async getMintHistory(fromBlock = 0, toBlock = 'latest') {
    if (!this.isInitialized()) {
      throw new Error('Contract not initialized');
    }

    try {
      const filter = this.contract.filters.NFTMinted();
      const events = await this.contract.queryFilter(filter, fromBlock, toBlock);

      return events.map(event => ({
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        to: event.args.to,
        tokenId: Number(event.args.tokenId),
        tokenType: event.args.tokenType,
        rarity: event.args.rarity,
        element: event.args.element,
        tokenURI: event.args.tokenURI
      }));
    } catch (error) {
      console.error('❌ Error getting mint history:', error);
      throw error;
    }
  }

  /**
   * Obtém histórico de mints de uma wallet específica
   */
  async getWalletMintHistory(walletAddress) {
    if (!this.isInitialized()) {
      throw new Error('Contract not initialized');
    }

    try {
      const filter = this.contract.filters.NFTMinted(walletAddress);
      const events = await this.contract.queryFilter(filter);

      return events.map(event => ({
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        tokenId: Number(event.args.tokenId),
        tokenType: event.args.tokenType,
        rarity: event.args.rarity,
        element: event.args.element,
        tokenURI: event.args.tokenURI,
        timestamp: null // Será preenchido se necessário buscar o timestamp do bloco
      }));
    } catch (error) {
      console.error('❌ Error getting wallet mint history:', error);
      throw error;
    }
  }
}

// Instância singleton
const nftContractService = new NFTContractService();

export default nftContractService;
