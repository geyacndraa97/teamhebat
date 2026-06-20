// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Kode konfigurasi resmi dari proyek "EAS mobile computting" milikmu
const firebaseConfig = {
  apiKey: "AIzaSyA246g4SX_Mv_TsF4WJyGKXZCh8QpTv-3c",
  authDomain: "eas-mobile-computting.firebaseapp.com",
  databaseURL: "https://eas-mobile-computting-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "eas-mobile-computting",
  storageBucket: "eas-mobile-computting.firebasestorage.app",
  messagingSenderId: "670656109715",
  appId: "1:670656109715:web:f7913150ee422fee864166",
  measurementId: "G-X243E4CE6E"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor Firestore agar bisa dipakai di LoginScreen dan Dashboard
export const db = getFirestore(app);