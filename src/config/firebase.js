import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDeJZlS6JsEx_TfR7fW_x3Zt330TSVWHHM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kentang-balap-dieng.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kentang-balap-dieng",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kentang-balap-dieng.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1013014211623",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1013014211623:web:f8dcd4b9b7ab70faf77202"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);