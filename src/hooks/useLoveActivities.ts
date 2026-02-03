import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { 
  getLoveActivities, 
  getUserActivities as getFirestoreUserActivities, 
  completeActivity,
  LoveActivity as FirestoreLoveActivity,
  UserActivity as FirestoreUserActivity
} from '@/lib/firestore/activities';

export interface LoveActivity {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_id: string;
  completed_at: string;
  notes: string | null;
}

// Convert Firestore activity to app format
const toAppActivity = (firestoreActivity: FirestoreLoveActivity): LoveActivity => {
  return {
    id: firestoreActivity.id,
    title: firestoreActivity.title,
    description: firestoreActivity.description,
    category: firestoreActivity.category,
    icon: firestoreActivity.icon,
    created_at: firestoreActivity.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
};

const toAppUserActivity = (firestoreActivity: FirestoreUserActivity): UserActivity => {
  return {
    id: firestoreActivity.id,
    user_id: firestoreActivity.userId,
    activity_id: firestoreActivity.activityId,
    completed_at: firestoreActivity.completedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    notes: firestoreActivity.notes,
  };
};

export const useLoveActivities = () => {
  return useQuery({
    queryKey: ['love-activities'],
    queryFn: async () => {
      const activities = await getLoveActivities();
      return activities.map(toAppActivity);
    },
  });
};

export const useUserActivities = () => {
  const { user } = useFirebaseAuth();

  return useQuery({
    queryKey: ['user-activities', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      
      const activities = await getFirestoreUserActivities(user.uid);
      return activities.map(toAppUserActivity);
    },
    enabled: !!user,
  });
};

export const useCompleteActivity = () => {
  const queryClient = useQueryClient();
  const { user } = useFirebaseAuth();

  return useMutation({
    mutationFn: async ({ activityId, notes }: { activityId: string; notes?: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const activity = await completeActivity(user.uid, activityId, notes);
      return toAppUserActivity(activity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-activities', user?.uid] });
    },
  });
};
