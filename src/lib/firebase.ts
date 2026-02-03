import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB9Z6Arg5f6zb6tWce6tpv9n0Lc4pDE6mo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "lovebond-f652f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "lovebond-f652f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "lovebond-f652f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "706062395226",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:706062395226:web:24744882bfd9ef6a4e3563",
};

const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);

export default app;
