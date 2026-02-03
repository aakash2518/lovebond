import { 
  collection,
  doc, 
  addDoc,
  getDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

export interface DailyPhoto {
  id: string;
  userId: string;
  photoUrl: string;
  uploadDate: string;
  caption: string | null;
  createdAt: Timestamp;
}

export const uploadDailyPhoto = async (
  userId: string,
  file: File,
  caption?: string
): Promise<DailyPhoto> => {
  const today = new Date().toISOString().split('T')[0];
  const fileExt = file.name.split('.').pop();
  const fileName = `photos/${userId}/${today}-${Date.now()}.${fileExt}`;
  
  // Upload to Firebase Storage
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, file);
  const photoUrl = await getDownloadURL(storageRef);
  
  // Save to Firestore
  const photosRef = collection(db, 'dailyPhotos');
  const docRef = await addDoc(photosRef, {
    userId,
    photoUrl,
    uploadDate: today,
    caption: caption || null,
    createdAt: serverTimestamp(),
  });
  
  return {
    id: docRef.id,
    userId,
    photoUrl,
    uploadDate: today,
    caption: caption || null,
    createdAt: Timestamp.now(),
  };
};

export const getTodayPhoto = async (userId: string): Promise<DailyPhoto | null> => {
  const today = new Date().toISOString().split('T')[0];
  const photosRef = collection(db, 'dailyPhotos');
  
  const q = query(
    photosRef,
    where('userId', '==', userId),
    where('uploadDate', '==', today)
  );
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const doc = querySnapshot.docs[0];
  return { id: doc.id, ...doc.data() } as DailyPhoto;
};

export const getAllPhotos = async (userId: string, partnerId?: string): Promise<DailyPhoto[]> => {
  const photosRef = collection(db, 'dailyPhotos');
  
  // Get user's photos
  const userQuery = query(
    photosRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const userSnapshot = await getDocs(userQuery);
  const photos: DailyPhoto[] = [];
  
  userSnapshot.forEach((doc) => {
    photos.push({ id: doc.id, ...doc.data() } as DailyPhoto);
  });
  
  // Get partner's photos if partnerId provided
  if (partnerId) {
    const partnerQuery = query(
      photosRef,
      where('userId', '==', partnerId),
      orderBy('createdAt', 'desc')
    );
    
    const partnerSnapshot = await getDocs(partnerQuery);
    partnerSnapshot.forEach((doc) => {
      photos.push({ id: doc.id, ...doc.data() } as DailyPhoto);
    });
  }
  
  // Sort by date
  photos.sort((a, b) => {
    const dateA = a.createdAt?.toMillis?.() || 0;
    const dateB = b.createdAt?.toMillis?.() || 0;
    return dateB - dateA;
  });
  
  return photos;
};
