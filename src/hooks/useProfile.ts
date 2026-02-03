import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { getUserProfile, updateUserProfile, UserProfile } from '@/lib/firestore/users';

export type { UserProfile };

export interface Profile {
  id: string;
  user_id: string;
  name: string | null;
  bio: string | null;
  profile_photo_url: string | null;
  partner_id: string | null;
  couple_id: string | null;
  partner_nickname: string | null;
  relationship_start_date: string | null;
  created_at: string;
  updated_at: string;
}

// Convert Firestore profile to app profile format
const toAppProfile = (firestoreProfile: UserProfile | null): Profile | null => {
  if (!firestoreProfile) return null;
  
  return {
    id: firestoreProfile.uid,
    user_id: firestoreProfile.uid,
    name: firestoreProfile.name,
    bio: firestoreProfile.bio,
    profile_photo_url: firestoreProfile.profilePhotoUrl,
    partner_id: firestoreProfile.partnerId,
    couple_id: firestoreProfile.coupleId,
    partner_nickname: firestoreProfile.partnerNickname,
    relationship_start_date: firestoreProfile.relationshipStartDate,
    created_at: firestoreProfile.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updated_at: firestoreProfile.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
};

export const useProfile = () => {
  const { user } = useFirebaseAuth();

  return useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: async () => {
      if (!user) return null;
      
      const firestoreProfile = await getUserProfile(user.uid);
      return toAppProfile(firestoreProfile);
    },
    enabled: !!user,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useFirebaseAuth();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('Not authenticated');
      
      // Convert app format to Firestore format
      const firestoreUpdates: Partial<UserProfile> = {};
      
      if (updates.name !== undefined) firestoreUpdates.name = updates.name || '';
      if (updates.bio !== undefined) firestoreUpdates.bio = updates.bio;
      if (updates.profile_photo_url !== undefined) firestoreUpdates.profilePhotoUrl = updates.profile_photo_url;
      if (updates.partner_nickname !== undefined) firestoreUpdates.partnerNickname = updates.partner_nickname;
      if (updates.relationship_start_date !== undefined) firestoreUpdates.relationshipStartDate = updates.relationship_start_date;
      
      await updateUserProfile(user.uid, firestoreUpdates);
      
      return updates;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.uid] });
    },
  });
};
