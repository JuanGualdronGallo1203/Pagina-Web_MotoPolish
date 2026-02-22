// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// --- AQUÍ PEGA TUS DATOS DE FIREBASE ---
// Copia estos valores exactamente como aparecen en tu consola de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC-wp7oyDWO2BQA4fWrhuy_ehc8L4KVv48",
  authDomain: "motopolish-5bcd4.firebaseapp.com",
  projectId: "motopolish-5bcd4",
  storageBucket: "motopolish-5bcd4.firebasestorage.app",
  messagingSenderId: "457706861685",
  appId: "1:457706861685:web:5bb98d77e297b065eff43c",
  measurementId: "G-404M2QDHS6"
};

// 1. Inicializamos la conexión con Firebase
const app = initializeApp(firebaseConfig);

// 2. Exportamos las herramientas para usarlas en el resto de la app
// auth: Para Login y Registro
export const auth = getAuth(app);
// db: La base de datos (Firestore)
export const db = getFirestore(app);
// storage: Para guardar fotos
export const storage = getStorage(app);