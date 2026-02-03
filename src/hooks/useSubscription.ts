import { useState, useEffect } from 'react';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PREMIUM_FEATURES, type PremiumFeature } from '@/lib/subscription/plans';

export interface UserSubscription {
  plan: 'free' | 'premium_monthly' | 'premium_yearly';
  status: 'active' | 'expired' | 'cancelled';
  expiresAt: Date | null;
  features: PremiumFeature[];
}

export const useSubscription = () => {
  const { user } = useFirebaseAuth();
  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: 'free',
    status: 'active',
    expiresAt: null,
    features: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription({
        plan: 'free',
        status: 'active',
        expiresAt: null,
        features: []
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'subscriptions', user.uid),
      (doc) => {
        try {
          if (doc.exists()) {
            const data = doc.data();
            setSubscription({
              plan: data.plan || 'free',
              status: data.status || 'active',
              expiresAt: data.expiresAt?.toDate() || null,
              features: data.features || []
            });
          } else {
            // Create default free subscription
            const defaultSubscription = {
              plan: 'free',
              status: 'active',
              expiresAt: null,
              features: []
            };
            setSubscription(defaultSubscription);
            
            // Create the document in Firestore
            setDoc(doc(db, 'subscriptions', user.uid), {
              ...defaultSubscription,
              userId: user.uid,
              createdAt: new Date(),
              updatedAt: new Date()
            }).catch(error => {
              console.error('Error creating subscription document:', error);
            });
          }
        } catch (error) {
          console.error('Error processing subscription data:', error);
          setSubscription({
            plan: 'free',
            status: 'active',
            expiresAt: null,
            features: []
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching subscription:', error);
        setSubscription({
          plan: 'free',
          status: 'active',
          expiresAt: null,
          features: []
        });
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const hasFeature = (feature: PremiumFeature): boolean => {
    try {
      if (subscription.status !== 'active') return false;
      if (subscription.plan === 'free') return false;
      
      // Check if subscription is expired
      if (subscription.expiresAt && subscription.expiresAt < new Date()) {
        return false;
      }

      return subscription.features.includes(feature);
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  };

  const isPremium = (): boolean => {
    try {
      return subscription.plan !== 'free' && subscription.status === 'active';
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  };

  const upgradeSubscription = async (planId: string) => {
    if (!user) return false;

    try {
      const expiresAt = new Date();
      if (planId === 'premium_monthly') {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      } else if (planId === 'premium_yearly') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }

      const features = [
        PREMIUM_FEATURES.SCRATCH_LOVE_GAME,
        PREMIUM_FEATURES.TRUTH_OR_DRINK,
        PREMIUM_FEATURES.UNLIMITED_PHOTOS,
        PREMIUM_FEATURES.PREMIUM_THEMES,
        PREMIUM_FEATURES.ADVANCED_GAMES
      ];

      await updateDoc(doc(db, 'subscriptions', user.uid), {
        plan: planId,
        status: 'active',
        expiresAt,
        features,
        updatedAt: new Date()
      });

      return true;
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      return false;
    }
  };

  return {
    subscription,
    loading,
    hasFeature,
    isPremium,
    upgradeSubscription
  };
};