import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { updateUserProfile, getUserProfile } from './users';

export interface Couple {
  id: string;
  coupleCode: string;
  user1: string;
  user2: string | null;
  createdBy: string;
  connectedAt: Timestamp | null;
  createdAt: Timestamp;
}

// Generate a unique 8-character couple code
const generateCoupleCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createCouple = async (userId: string): Promise<{ coupleId: string; coupleCode: string }> => {
  const coupleCode = generateCoupleCode();
  const coupleRef = doc(collection(db, 'couples'));
  
  await setDoc(coupleRef, {
    id: coupleRef.id,
    coupleCode: coupleCode.toUpperCase(), // Fix: Store as uppercase
    user1: userId,
    user2: null,
    createdBy: userId,
    connectedAt: null,
    createdAt: serverTimestamp(),
  });

  // Update user's coupleId
  await updateUserProfile(userId, { coupleId: coupleRef.id });

  return { coupleId: coupleRef.id, coupleCode: coupleCode.toUpperCase() }; // Fix: Return uppercase
};

export const getCoupleByCode = async (code: string): Promise<Couple | null> => {
  console.log('getCoupleByCode called with:', code);
  const upperCode = code.toUpperCase();
  console.log('Searching for couple with uppercase code:', upperCode);
  
  const couplesRef = collection(db, 'couples');
  const q = query(couplesRef, where('coupleCode', '==', upperCode));
  const querySnapshot = await getDocs(q);
  
  console.log('Query result - empty:', querySnapshot.empty);
  console.log('Query result - size:', querySnapshot.size);
  
  if (querySnapshot.empty) {
    console.log('No couple found with code:', upperCode);
    return null;
  }
  
  const coupleData = querySnapshot.docs[0].data() as Couple;
  console.log('Found couple data:', coupleData);
  return coupleData;
};

export const getCoupleById = async (coupleId: string): Promise<Couple | null> => {
  const coupleRef = doc(db, 'couples', coupleId);
  const coupleSnap = await getDoc(coupleRef);
  
  if (coupleSnap.exists()) {
    return coupleSnap.data() as Couple;
  }
  return null;
};

export const joinCouple = async (userId: string, coupleCode: string): Promise<string> => {
  console.log('joinCouple called with:', { userId, coupleCode });
  
  const couple = await getCoupleByCode(coupleCode);
  console.log('Found couple:', couple);
  
  if (!couple) {
    console.log('No couple found with code:', coupleCode);
    throw new Error('Invalid couple code');
  }
  
  if (couple.user2 !== null) {
    console.log('Couple already has two members:', couple);
    throw new Error('This couple already has two members');
  }
  
  if (couple.user1 === userId) {
    console.log('User trying to join own couple:', userId);
    throw new Error('You cannot join your own couple');
  }

  console.log('Updating couple with user2:', userId);
  const coupleRef = doc(db, 'couples', couple.id);
  
  // Update couple with second user
  await updateDoc(coupleRef, {
    user2: userId,
    connectedAt: serverTimestamp(),
  });

  console.log('Updating user profiles...');
  // Update both users' profiles
  await updateUserProfile(userId, { 
    coupleId: couple.id,
    partnerId: couple.user1
  });
  
  await updateUserProfile(couple.user1, { 
    partnerId: userId 
  });

  console.log('Successfully joined couple:', couple.id);
  return couple.id;
};

export const getUserCoupleCode = async (userId: string): Promise<string | null> => {
  const profile = await getUserProfile(userId);
  
  if (!profile?.coupleId) return null;
  
  const couple = await getCoupleById(profile.coupleId);
  return couple?.coupleCode || null;
};

export const getPartnerProfile = async (userId: string) => {
  const profile = await getUserProfile(userId);
  
  if (!profile?.partnerId) return null;
  
  return getUserProfile(profile.partnerId);
};
