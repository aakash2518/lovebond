import { 
  collection,
  doc, 
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';

export interface LoveActivity {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  createdAt: Timestamp;
}

export interface UserActivity {
  id: string;
  userId: string;
  activityId: string;
  notes: string | null;
  completedAt: Timestamp;
}

// Predefined love activities
const defaultActivities: Omit<LoveActivity, 'id' | 'createdAt'>[] = [
  { title: 'Send a good morning text', description: 'Start the day with love', category: 'daily', icon: '☀️' },
  { title: 'Share a compliment', description: 'Tell your partner something you love about them', category: 'daily', icon: '💕' },
  { title: 'Plan a date night', description: 'Schedule quality time together', category: 'weekly', icon: '🌙' },
  { title: 'Cook together', description: 'Make a meal as a team', category: 'weekly', icon: '👨‍🍳' },
  { title: 'Watch a movie together', description: 'Enjoy a film night', category: 'weekly', icon: '🎬' },
  { title: 'Take a walk together', description: 'Get some fresh air as a couple', category: 'daily', icon: '🚶' },
  { title: 'Write a love note', description: 'Express your feelings in writing', category: 'special', icon: '💌' },
  { title: 'Give a massage', description: 'Help your partner relax', category: 'weekly', icon: '💆' },
];

export const initializeActivities = async (): Promise<void> => {
  const activitiesRef = collection(db, 'loveActivities');
  const snapshot = await getDocs(activitiesRef);
  
  // Only seed if empty
  if (snapshot.empty) {
    for (const activity of defaultActivities) {
      await addDoc(activitiesRef, {
        ...activity,
        createdAt: serverTimestamp(),
      });
    }
  }
};

export const getLoveActivities = async (): Promise<LoveActivity[]> => {
  const activitiesRef = collection(db, 'loveActivities');
  const q = query(activitiesRef, orderBy('createdAt', 'asc'));
  const snapshot = await getDocs(q);
  
  const activities: LoveActivity[] = [];
  snapshot.forEach((doc) => {
    activities.push({ id: doc.id, ...doc.data() } as LoveActivity);
  });
  
  // If no activities exist, initialize them
  if (activities.length === 0) {
    await initializeActivities();
    return getLoveActivities();
  }
  
  return activities;
};

export const completeActivity = async (
  userId: string,
  activityId: string,
  notes?: string
): Promise<UserActivity> => {
  const userActivitiesRef = collection(db, 'userActivities');
  
  const docRef = await addDoc(userActivitiesRef, {
    userId,
    activityId,
    notes: notes || null,
    completedAt: serverTimestamp(),
  });
  
  return {
    id: docRef.id,
    userId,
    activityId,
    notes: notes || null,
    completedAt: Timestamp.now(),
  };
};

export const getUserActivities = async (userId: string): Promise<UserActivity[]> => {
  const userActivitiesRef = collection(db, 'userActivities');
  const q = query(
    userActivitiesRef,
    where('userId', '==', userId),
    orderBy('completedAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  
  const activities: UserActivity[] = [];
  snapshot.forEach((doc) => {
    activities.push({ id: doc.id, ...doc.data() } as UserActivity);
  });
  
  return activities;
};
