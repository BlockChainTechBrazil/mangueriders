declare const ipfsMetadataService: {
  uploadCompleteNFT: (nftData: any, imageFile: File) => Promise<{ success: boolean; imageUrl?: string; metadataUrl?: string; metadata?: any; error?: string }>;
  uploadImageToIPFS: (imageFile: File, fileName: string) => Promise<string>;
  uploadImageFromUrlToIPFS: (imageUrl: string, fileName?: string) => Promise<string>;
  uploadMetadataToIPFS: (metadata: any) => Promise<string>;
  createNFTMetadata: (nftData: any) => any;
  getStorageInfo: () => { ipfsConfigured: boolean; gateway: string; provider: string; fallbackMode: boolean };
};

export default ipfsMetadataService;