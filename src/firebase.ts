import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3Yczv4YAUuQpkNErmxrRAB1YPx0mrIF4",
  authDomain: "dolcezza-586d5.firebaseapp.com",
  projectId: "dolcezza-586d5",
  storageBucket: "dolcezza-586d5.firebasestorage.app",
  messagingSenderId: "186663190348",
  appId: "1:186663190348:web:64ab653da41cbdcf8e99e9",
  measurementId: "G-R1NZL09SBG",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
