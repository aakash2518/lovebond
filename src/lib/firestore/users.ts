import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface UserProfile {
  uid: string;
  name: string;
  email: string | null;
  partnerId: string | null;
  coupleId: string | null;
  partnerNickname: string | null;
  relationshipStartDate: string | null;
  bio: string | null;
  profilePhotoUrl: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const createUserProfile = async (
  uid: string, 
  name: string, 
  email: string | null
): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid,
      name,
      email,
      partnerId: null,
      coupleId: null,
      partnerNickname: null,
      relationshipStartDate: null,
      bio: null,
      profilePhotoUrl: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (
  uid: string, 
  updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};
