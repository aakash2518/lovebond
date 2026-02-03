import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { getLoveStreak, updateLoveStreak, createLoveStreak, LoveStreak as FirestoreLoveStreak } from '@/lib/firestore/streaks';

export interface LoveStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

// Convert Firestore streak to app format
const toAppStreak = (firestoreStreak: FirestoreLoveStreak | null): LoveStreak | null => {
  if (!firestoreStreak) return null;
  
  return {
    id: firestoreStreak.uid,
    user_id: firestoreStreak.uid,
    current_streak: firestoreStreak.currentStreak,
    longest_streak: firestoreStreak.longestStreak,
    last_activity_date: firestoreStreak.lastActivityDate,
    created_at: firestoreStreak.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updated_at: firestoreStreak.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
};

export const useLoveStreak = () => {
  const { user } = useFirebaseAuth();

  return useQuery({
    queryKey: ['love-streak', user?.uid],
    queryFn: async () => {
      if (!user) return null;
      
      let streak = await getLoveStreak(user.uid);
      
      // Create streak if it doesn't exist
      if (!streak) {
        await createLoveStreak(user.uid);
        streak = await getLoveStreak(user.uid);
      }
      
      return toAppStreak(streak);
    },
    enabled: !!user,
  });
};

export const useUpdateStreak = () => {
  const queryClient = useQueryClient();
  const { user } = useFirebaseAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      
      const updatedStreak = await updateLoveStreak(user.uid);
      return toAppStreak(updatedStreak);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['love-streak', user?.uid] });
    },
  });
};
