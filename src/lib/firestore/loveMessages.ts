import { 
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface DailyLoveMessage {
  id: string;
  message: string;
  category: string | null;
  createdAt: Timestamp;
}

// Predefined love messages
const defaultMessages = [
  { message: "Every moment with you is a treasure 💎", category: "romantic" },
  { message: "You make my heart smile every day ❤️", category: "romantic" },
  { message: "Distance means nothing when someone means everything 🌟", category: "distance" },
  { message: "You are my today and all of my tomorrows 💕", category: "romantic" },
  { message: "Together is my favorite place to be 🏠", category: "cozy" },
  { message: "I love you more than yesterday, less than tomorrow 💗", category: "romantic" },
  { message: "You're my favorite notification 📱", category: "cute" },
  { message: "Being with you is my favorite adventure 🌈", category: "adventure" },
  { message: "You're the reason I believe in love 💝", category: "romantic" },
  { message: "My heart is and always will be yours 💖", category: "romantic" },
];

export const initializeLoveMessages = async (): Promise<void> => {
  const messagesRef = collection(db, 'dailyLoveMessages');
  const snapshot = await getDocs(messagesRef);
  
  // Only seed if empty
  if (snapshot.empty) {
    for (const message of defaultMessages) {
      await addDoc(messagesRef, {
        ...message,
        createdAt: serverTimestamp(),
      });
    }
  }
};

export const getDailyLoveMessage = async (): Promise<DailyLoveMessage | null> => {
  const messagesRef = collection(db, 'dailyLoveMessages');
  const snapshot = await getDocs(messagesRef);
  
  let messages: DailyLoveMessage[] = [];
  snapshot.forEach((doc) => {
    messages.push({ id: doc.id, ...doc.data() } as DailyLoveMessage);
  });
  
  // If no messages exist, initialize them
  if (messages.length === 0) {
    await initializeLoveMessages();
    return getDailyLoveMessage();
  }
  
  // Return a random message
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};
