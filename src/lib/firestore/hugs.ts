import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  onSnapshot,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Hug {
  id: string;
  sender_id: string;
  receiver_id: string;
  couple_id: string;
  message?: string;
  created_at: Timestamp;
}

// Send a hug to partner
export const sendHug = async (
  senderId: string, 
  receiverId: string, 
  coupleId: string, 
  message?: string
): Promise<string> => {
  const hugRef = await addDoc(collection(db, 'hugs'), {
    sender_id: senderId,
    receiver_id: receiverId,
    couple_id: coupleId,
    message: message || null,
    created_at: serverTimestamp(),
  });

  return hugRef.id;
};

// Subscribe to incoming hugs for real-time notifications
export const subscribeToHugs = (
  userId: string,
  callback: (hug: Hug) => void
): (() => void) => {
  const hugsRef = collection(db, 'hugs');
  const q = query(
    hugsRef,
    where('receiver_id', '==', userId),
    orderBy('created_at', 'desc'),
    limit(1)
  );

  let lastHugId: string | null = null;

  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const hug = {
          id: change.doc.id,
          ...change.doc.data()
        } as Hug;

        // Only trigger callback for new hugs (not initial load)
        if (lastHugId !== null && hug.id !== lastHugId) {
          callback(hug);
        }
        lastHugId = hug.id;
      }
    });
  });

  return unsubscribe;
};

// Get recent hugs for a couple
export const getCoupleHugs = async (coupleId: string, limitCount: number = 10): Promise<Hug[]> => {
  const hugsRef = collection(db, 'hugs');
  const q = query(
    hugsRef,
    where('couple_id', '==', coupleId),
    orderBy('created_at', 'desc'),
    limit(limitCount)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Hug));
};

// Get hugs received by a user today
export const getTodayHugsReceived = async (userId: string): Promise<number> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const hugsRef = collection(db, 'hugs');
  const q = query(
    hugsRef,
    where('receiver_id', '==', userId),
    where('created_at', '>=', today)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};

// Get hugs sent by a user today
export const getTodayHugsSent = async (userId: string): Promise<number> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const hugsRef = collection(db, 'hugs');
  const q = query(
    hugsRef,
    where('sender_id', '==', userId),
    where('created_at', '>=', today)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};