import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAUmysH6Bjx-7rxDwcoq1SuQYMYxr-ldgQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "tde-iot-yannes.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://tde-iot-yannes-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "tde-iot-yannes",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "tde-iot-yannes.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "449580908679",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:449580908679:web:d06c92de21a083ca3a3822"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Authenticate anonymously
signInAnonymously(auth).catch((error) => {
  console.error("Firebase Anonymous Auth failed:", error);
});

export { app, database, auth };
