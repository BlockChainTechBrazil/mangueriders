import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,  // Adicionando a URL do Realtime Database para corrigir o aviso
  databaseURL: "https://mangueriders-30fbe-default-rtdb.firebaseio.com/",
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Exportar instância do Firestore para uso em firestoreService.ts
export const db = getFirestore(app);

// Exportar instância do Realtime Database para uso em multiplayerService.js
export const realtimeDb = getDatabase(app);