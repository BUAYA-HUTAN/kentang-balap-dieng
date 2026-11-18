import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDeJZlS6JsEx_TfR7fW_x3Zt330TSVWHHM",
  authDomain: "kentang-balap-dieng.firebaseapp.com",
  projectId: "kentang-balap-dieng",
  storageBucket: "kentang-balap-dieng.firebasestorage.app",
  messagingSenderId: "1013014211623",
  appId: "1:1013014211623:web:f8dcd4b9b7ab70faf77202",
  measurementId: "G-ZWVEEV9V48"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);