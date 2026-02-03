import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { PremiumFeature } from '@/lib/subscription/plans';

export interface UserSubscription {
  userId: string;
  plan: 'free' | 'premium_monthly' | 'premium_yearly';
  status: 'active' | 'expired' | 'cancelled';
  features: PremiumFeature[];
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  paymentId?: string;
  transactionId?: string;
}

export const createSubscription = async (
  userId: string, 
  subscription: Partial<UserSubscription>
): Promise<void> => {
  const subscriptionRef = doc(db, 'subscriptions', userId);
  
  await setDoc(subscriptionRef, {
    userId,
    plan: 'free',
    status: 'active',
    features: [],
    expiresAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...subscription
  });
};

export const getSubscription = async (userId: string): Promise<UserSubscription | null> => {
  const subscriptionRef = doc(db, 'subscriptions', userId);
  const subscriptionSnap = await getDoc(subscriptionRef);
  
  if (subscriptionSnap.exists()) {
    const data = subscriptionSnap.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      expiresAt: data.expiresAt?.toDate() || null
    } as UserSubscription;
  }
  
  return null;
};

export const updateSubscription = async (
  userId: string, 
  updates: Partial<UserSubscription>
): Promise<void> => {
  const subscriptionRef = doc(db, 'subscriptions', userId);
  
  await updateDoc(subscriptionRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const upgradeSubscription = async (
  userId: string,
  planId: string,
  paymentId?: string,
  transactionId?: string
): Promise<void> => {
  const expiresAt = new Date();
  let features: PremiumFeature[] = [];
  
  if (planId === 'premium_monthly') {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    features = ['scratch_love_game', 'truth_or_drink', 'unlimited_photos', 'premium_themes', 'advanced_games'];
  } else if (planId === 'premium_yearly') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    features = ['scratch_love_game', 'truth_or_drink', 'unlimited_photos', 'premium_themes', 'advanced_games'];
  }

  await updateSubscription(userId, {
    plan: planId as any,
    status: 'active',
    features,
    expiresAt,
    paymentId,
    transactionId
  });
};

export const cancelSubscription = async (userId: string): Promise<void> => {
  await updateSubscription(userId, {
    status: 'cancelled'
  });
};

export const checkExpiredSubscriptions = async (): Promise<void> => {
  const subscriptionsRef = collection(db, 'subscriptions');
  const q = query(
    subscriptionsRef,
    where('status', '==', 'active'),
    where('expiresAt', '<=', new Date())
  );
  
  const querySnapshot = await getDocs(q);
  
  const updatePromises = querySnapshot.docs.map(doc => 
    updateDoc(doc.ref, {
      status: 'expired',
      updatedAt: serverTimestamp()
    })
  );
  
  await Promise.all(updatePromises);
};