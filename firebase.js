// firebase.js — EmpowerHer Firebase Configuration
// TODO: Replace with your actual Firebase project config from console.firebase.google.com

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ⚠️ REPLACE these values with your own Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBLlm3RM0gUNAe5mUZRGFUTtQu-zo58LXo",
  authDomain: "empowerher-v1.firebaseapp.com",
  projectId: "empowerher-v1",
  storageBucket: "empowerher-v1.firebasestorage.app",
  messagingSenderId: "1049108214800",
  appId: "1:1049108214800:web:e8f691b80332079d9b8695",
  measurementId: "G-W12K0Q0K3P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
