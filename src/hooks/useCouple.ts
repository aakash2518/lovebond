import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { 
  createCouple, 
  joinCouple as joinCoupleFirestore, 
  getCoupleById,
  getUserCoupleCode,
  Couple 
} from '@/lib/firestore/couples';
import { getUserProfile } from '@/lib/firestore/users';

export type { Couple };

export const useCoupleData = () => {
  const { user } = useFirebaseAuth();

  return useQuery({
    queryKey: ['couple', user?.uid],
    queryFn: async () => {
      if (!user) return null;

      const profile = await getUserProfile(user.uid);
      if (!profile?.coupleId) return null;

      const couple = await getCoupleById(profile.coupleId);
      return couple;
    },
    enabled: !!user,
  });
};

export const useCouple = () => {
  const { user } = useFirebaseAuth();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const createCoupleHandler = async () => {
    if (!user) return { data: null, error: new Error('Not authenticated') };
    
    setLoading(true);
    try {
      const { coupleId, coupleCode } = await createCouple(user.uid);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['profile', user.uid] });
      queryClient.invalidateQueries({ queryKey: ['couple', user.uid] });
      
      return { data: { id: coupleId, couple_code: coupleCode }, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const joinCoupleHandler = async (coupleCode: string) => {
    if (!user) return { data: null, error: new Error('Not authenticated') };
    
    setLoading(true);
    try {
      const coupleId = await joinCoupleFirestore(user.uid, coupleCode);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['profile', user.uid] });
      queryClient.invalidateQueries({ queryKey: ['couple', user.uid] });
      
      return { data: coupleId, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const getCoupleCode = async () => {
    if (!user) return { data: null, error: new Error('Not authenticated') };

    try {
      const code = await getUserCoupleCode(user.uid);
      return { data: code, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  };

  return {
    createCouple: createCoupleHandler,
    joinCouple: joinCoupleHandler,
    getCoupleCode,
    loading
  };
};
