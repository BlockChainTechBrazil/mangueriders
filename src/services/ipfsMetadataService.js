// Serviço para gerenciar upload e metadata dos NFTs no IPFS
import imageManager from '../utils/imageManager.js';

class IPFSMetadataService {
  constructor() {
    // Suporte apenas a autenticação via JWT
    this.pinataJWT = import.meta.env.VITE_PINATA_JWT || import.meta.env.REACT_APP_PINATA_JWT;
    this.ipfsGateway = import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
  }

  /**
   * Faz upload de imagem para IPFS via Pinata
   */
  async uploadImageToIPFS(imageFile, fileName) {
    // Verificar credenciais JWT
    if (!this.pinataJWT) {
      // console.warn removido
      return this.getFallbackImageURL(fileName);
    }

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const metadata = JSON.stringify({
        name: fileName,
        keyvalues: {
          project: 'BombRider',
          type: 'nft-image'
        }
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', options);

      const headers = { 'Authorization': `Bearer ${this.pinataJWT}` };

      // console.log removido

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers,
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        // console.error removido
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      // console.log removido
      return `${this.ipfsGateway}${result.IpfsHash}`;
    } catch {
      return this.getFallbackImageURL(fileName);
    }
  }

  /**
   * Cria e faz upload de metadata JSON para IPFS
   */
  async uploadMetadataToIPFS(metadata) {
    if (!this.pinataJWT) {
      // console.warn removido
      return this.getFallbackMetadataURL(metadata);
    }

    try {
      // Usar pinJSONToIPFS com autenticação JWT
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.pinataJWT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pinataOptions: { cidVersion: 1 },
          pinataMetadata: {
            name: `${metadata.name || 'BombRider NFT'} Metadata`,
            keyvalues: {
              project: 'BombRider',
              type: 'nft-metadata',
              tokenType: metadata.attributes?.find(attr => attr.trait_type === 'Type')?.value || 'unknown',
              rarity: metadata.attributes?.find(attr => attr.trait_type === 'Rarity')?.value || 'unknown'
            }
          },
          pinataContent: metadata
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        // console.error removido
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      // console.log removido
      return `${this.ipfsGateway}${result.IpfsHash || result.Hash}`;
    } catch {
      return this.getFallbackMetadataURL(metadata);
    }
  }

  /**
   * Faz upload de uma imagem a partir de uma URL (data URL, local/public ou remota) para o IPFS via Pinata
   */
  async uploadImageFromUrlToIPFS(imageUrl, fileName = `image_${Date.now()}.png`) {
    try {
      // Se a URL for data: ou blob: podemos enviar diretamente
      if (imageUrl.startsWith('data:')) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return await this.uploadImageToIPFS(blob, fileName);
      }

      // Para URLs de arquivos locais ou remotos
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();
      return await this.uploadImageToIPFS(blob, fileName);
    } catch {
      return this.getFallbackImageURL(fileName);
    }
  }

  /**
   * Cria metadados NFT com base nos dados fornecidos
   */
  createNFTMetadata(nftData) {
    return {
      name: nftData.name || 'BombRider NFT',
      description: nftData.description || 'A unique BombRider character NFT',
      image: nftData.imageUrl || this.getFallbackImageURL('default'),
      attributes: [
        {
          trait_type: "Type",
          value: nftData.type || 'Character'
        },
        {
          trait_type: "Rarity",
          value: nftData.rarity || 'Common'
        },
        {
          trait_type: "Speed",
          value: nftData.attributes?.speed || 50
        },
        {
          trait_type: "Bomb Power",
          value: nftData.attributes?.bombPower || 50
        },
        {
          trait_type: "Health",
          value: nftData.attributes?.health || 100
        },
        {
          trait_type: "Special Ability",
          value: nftData.attributes?.specialAbility || 'None'
        },
        {
          trait_type: "Background",
          value: nftData.attributes?.background || 'Default'
        },
        {
          trait_type: "Theme",
          value: nftData.attributes?.theme || 'Classic'
        }
      ],
      external_url: nftData.externalUrl || 'https://bombriders.com',
      animation_url: nftData.animationUrl,
      properties: {
        category: 'Gaming',
        creators: [
          {
            address: nftData.creator || '0x0000000000000000000000000000000000000000',
            share: 100
          }
        ],
        files: [
          {
            uri: nftData.imageUrl,
            type: 'image/png'
          }
        ]
      }
    };
  }

  /**
   * Busca metadados NFT de uma URI
   */
  async fetchNFTMetadata(tokenURI) {
    try {
      if (!tokenURI) return null;

      // Se for uma URL IPFS, converter para HTTP
      const httpUrl = this.convertIPFSToHTTP(tokenURI);

      const response = await fetch(httpUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch {
      return null;
    }
  }

  /**
   * Retorna URL de imagem de fallback local
   */
  getFallbackImageURL(fileName) {
    // Tenta encontrar a imagem no imageManager primeiro
    const localImage = imageManager.getCharacterImage(fileName);
    if (localImage) {
      return localImage;
    }

    // Fallback para imagens padrão
    const fallbacks = {
      'bomberman1.jpg': '/images/characters/bomberman1.jpg',
      'bomberman2.jpg': '/images/characters/bomberman2.jpg',
      'bomberman3.jpg': '/images/characters/bomberman3.jpg',
      'default': '/images/characters/bomberman1.jpg'
    };

    return fallbacks[fileName] || fallbacks.default;
  }

  /**
   * Retorna URL de metadata de fallback local
   */
  getFallbackMetadataURL(metadata) {
    // Para demonstração, retorna uma URL local com os dados
    const encodedMetadata = encodeURIComponent(JSON.stringify(metadata));
    return `data:application/json,${encodedMetadata}`;
  }

  /**
   * Verifica se uma URL é válida do IPFS
   */
  isValidIPFSUrl(url) {
    return url && (
      url.startsWith('ipfs://') ||
      url.includes('ipfs.io/ipfs/') ||
      url.includes('gateway.pinata.cloud/ipfs/') ||
      url.includes('cloudflare-ipfs.com/ipfs/')
    );
  }

  /**
   * Converte URLs IPFS para HTTP usando gateway
   */
  convertIPFSToHTTP(ipfsUrl) {
    if (!ipfsUrl) return ipfsUrl;

    if (ipfsUrl.startsWith('ipfs://')) {
      // Usar gateway público que não tem problemas de cookies
      return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }

    // Se já é um URL do gateway da Pinata, trocar para gateway público
    if (ipfsUrl.includes('gateway.pinata.cloud/ipfs/')) {
      return ipfsUrl.replace('https://gateway.pinata.cloud/ipfs/', 'https://ipfs.io/ipfs/');
    }

    return ipfsUrl;
  }

  /**
   * Upload de imagem local (da pasta public) para IPFS
   */
  async uploadLocalImageToIPFS(imagePath, fileName) {
    try {
      // Buscar a imagem da pasta public
      const imageUrl = `${window.location.origin}${imagePath}`;
      // console.log removido

      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      const imageBlob = await response.blob();
      const imageFile = new File([imageBlob], fileName, { type: imageBlob.type });

      // console.log removido
      return await this.uploadImageToIPFS(imageFile, fileName);
    } catch {
      // Fallback para URL local se o upload falhar
      return `${window.location.origin}${imagePath}`;
    }
  }

  /**
   * Upload completo de NFT (imagem + metadata)
   */
  async uploadCompleteNFT(nftData, imageFile) {
    try {
      // console.log removido

      // 1. Upload da imagem
      const imageUrl = await this.uploadImageToIPFS(imageFile, nftData.fileName || 'nft-image.png');

      // 2. Criar metadata com a URL da imagem
      const metadata = this.createNFTMetadata({
        ...nftData,
        imageUrl
      });

      // 3. Upload dos metadados
      const metadataUrl = await this.uploadMetadataToIPFS(metadata);

      // console.log removido

      return {
        success: true,
        imageUrl,
        metadataUrl,
        metadata
      };
    } catch (error) {
      // console.error removido
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Retorna informações sobre a configuração do storage
   */
  getStorageInfo() {
    return {
      ipfsConfigured: !!this.pinataJWT,
      gateway: this.ipfsGateway,
      provider: 'Pinata',
      fallbackMode: !this.pinataJWT
    };
  }
}

// Singleton instance
const ipfsMetadataService = new IPFSMetadataService();
export default ipfsMetadataService;
