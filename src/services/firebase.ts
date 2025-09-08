// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Configuração do Firebase com credenciais diretas
const firebaseConfig = {
  apiKey: "AIzaSyDiCbW_Qc0P-Qiw0dYKD1m50PvGNJKRF_0",
  authDomain: "mangueriders-nft.firebaseapp.com",
  databaseURL: "https://mangueriders-nft-default-rtdb.firebaseio.com",
  projectId: "mangueriders-nft",
  storageBucket: "mangueriders-nft.firebasestorage.app",
  messagingSenderId: "845988569527",
  appId: "1:845988569527:web:e9f5b5e12b9b2e2f4a72b5"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore (para dados persistentes como NFTs)
export const db = getFirestore(app);

// Inicializar Realtime Database (para multiplayer em tempo real)
export const realtimeDb = getDatabase(app);

export default app;
