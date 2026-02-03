import { 
  doc, 
  getDoc, 
  setDoc,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase';

export interface UserLocation {
  uid: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  updatedAt: Timestamp;
}

export const updateUserLocation = async (
  uid: string,
  latitude: number,
  longitude: number,
  accuracy?: number
): Promise<void> => {
  const locationRef = doc(db, 'locations', uid);
  
  await setDoc(locationRef, {
    uid,
    latitude,
    longitude,
    accuracy: accuracy || null,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

export const getUserLocation = async (uid: string): Promise<UserLocation | null> => {
  const locationRef = doc(db, 'locations', uid);
  const locationSnap = await getDoc(locationRef);
  
  if (locationSnap.exists()) {
    return locationSnap.data() as UserLocation;
  }
  return null;
};

// Get partner ID from profiles collection
const getPartnerId = async (userId: string): Promise<string | null> => {
  try {
    // First check user's profile for couple_id
    const userProfileRef = doc(db, 'profiles', userId);
    const userProfileSnap = await getDoc(userProfileRef);
    
    if (!userProfileSnap.exists()) {
      return null;
    }
    
    const userProfile = userProfileSnap.data();
    const coupleId = userProfile.couple_id;
    
    if (!coupleId) {
      return null;
    }
    
    // Find the other user in the same couple
    const profilesQuery = query(
      collection(db, 'profiles'),
      where('couple_id', '==', coupleId)
    );
    
    const profilesSnap = await getDocs(profilesQuery);
    
    for (const profileDoc of profilesSnap.docs) {
      const profile = profileDoc.data();
      if (profile.user_id !== userId) {
        return profile.user_id;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting partner ID:', error);
    return null;
  }
};

export const subscribeToPartnerLocation = (
  userId: string,
  callback: (location: UserLocation | null) => void
) => {
  let unsubscribe: (() => void) | null = null;
  
  const setupSubscription = async () => {
    try {
      const partnerId = await getPartnerId(userId);
      
      if (!partnerId) {
        callback(null);
        return;
      }
      
      const locationRef = doc(db, 'locations', partnerId);
      
      unsubscribe = onSnapshot(locationRef, (doc) => {
        if (doc.exists()) {
          callback(doc.data() as UserLocation);
        } else {
          callback(null);
        }
      }, (error) => {
        console.error('Error subscribing to partner location:', error);
        callback(null);
      });
    } catch (error) {
      console.error('Error setting up partner location subscription:', error);
      callback(null);
    }
  };
  
  setupSubscription();
  
  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
};

// Calculate distance between two points in km
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Get both user and partner locations
export const getCoupleLocations = async (userId: string): Promise<{
  userLocation: UserLocation | null;
  partnerLocation: UserLocation | null;
  distance: number | null;
}> => {
  try {
    const [userLocation, partnerId] = await Promise.all([
      getUserLocation(userId),
      getPartnerId(userId)
    ]);
    
    if (!partnerId) {
      return {
        userLocation,
        partnerLocation: null,
        distance: null
      };
    }
    
    const partnerLocation = await getUserLocation(partnerId);
    
    let distance: number | null = null;
    if (userLocation && partnerLocation) {
      distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        partnerLocation.latitude,
        partnerLocation.longitude
      );
    }
    
    return {
      userLocation,
      partnerLocation,
      distance
    };
  } catch (error) {
    console.error('Error getting couple locations:', error);
    return {
      userLocation: null,
      partnerLocation: null,
      distance: null
    };
  }
};
