import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface LoveStreak {
  uid: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const createLoveStreak = async (uid: string): Promise<void> => {
  const streakRef = doc(db, 'streaks', uid);
  const streakSnap = await getDoc(streakRef);
  
  if (!streakSnap.exists()) {
    await setDoc(streakRef, {
      uid,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
};

export const getLoveStreak = async (uid: string): Promise<LoveStreak | null> => {
  const streakRef = doc(db, 'streaks', uid);
  const streakSnap = await getDoc(streakRef);
  
  if (streakSnap.exists()) {
    return streakSnap.data() as LoveStreak;
  }
  return null;
};

export const updateLoveStreak = async (uid: string): Promise<LoveStreak> => {
  const streakRef = doc(db, 'streaks', uid);
  const streakSnap = await getDoc(streakRef);
  
  if (!streakSnap.exists()) {
    await createLoveStreak(uid);
    return (await getDoc(streakRef)).data() as LoveStreak;
  }
  
  const currentStreak = streakSnap.data() as LoveStreak;
  const today = new Date().toISOString().split('T')[0];
  
  const lastDate = currentStreak.lastActivityDate;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  // Already updated today
  if (lastDate === today) {
    return currentStreak;
  }
  
  let newStreak = 1;
  
  // Continuing streak from yesterday
  if (lastDate === yesterdayStr) {
    newStreak = currentStreak.currentStreak + 1;
  }
  
  const longestStreak = Math.max(newStreak, currentStreak.longestStreak);
  
  await updateDoc(streakRef, {
    currentStreak: newStreak,
    longestStreak,
    lastActivityDate: today,
    updatedAt: serverTimestamp(),
  });
  
  return {
    ...currentStreak,
    currentStreak: newStreak,
    longestStreak,
    lastActivityDate: today,
  };
};
