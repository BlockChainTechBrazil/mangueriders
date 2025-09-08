declare module '../services/ipfsMetadataService' {
  const ipfsMetadataService: {
    uploadImageToIPFS: (imageFile: File, fileName: string) => Promise<string>;
    uploadMetadataToIPFS: (metadata: any) => Promise<string>;
    uploadImageFromUrlToIPFS: (imageUrl: string, fileName?: string) => Promise<string>;
    createNFTMetadata: (nftData: any) => any;
    fetchNFTMetadata: (tokenURI: string) => Promise<any>;
    getFallbackImageURL: (fileName?: string) => string;
    isValidIPFSUrl: (url: string) => boolean;
    convertIPFSToHTTP: (ipfsUrl: string) => string;
    uploadCompleteNFT: (nftData: any, imageFile: File) => Promise<{ success: boolean; imageUrl?: string; metadataUrl?: string; metadata?: any; error?: string }>;
    getStorageInfo: () => { ipfsConfigured: boolean; gateway: string; provider: string; fallbackMode: boolean };
  };
  export default ipfsMetadataService;
}
