import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { 
  uploadDailyPhoto, 
  getTodayPhoto, 
  getAllPhotos,
  DailyPhoto as FirestoreDailyPhoto 
} from '@/lib/firestore/photos';

export interface DailyPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  upload_date: string;
  caption: string | null;
  created_at: string;
  signedUrl?: string;
}

// Convert Firestore photo to app format
const toAppPhoto = (firestorePhoto: FirestoreDailyPhoto): DailyPhoto => {
  return {
    id: firestorePhoto.id,
    user_id: firestorePhoto.userId,
    photo_url: firestorePhoto.photoUrl,
    upload_date: firestorePhoto.uploadDate,
    caption: firestorePhoto.caption,
    created_at: firestorePhoto.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    signedUrl: firestorePhoto.photoUrl, // Firebase Storage URLs are already accessible
  };
};

export const getSignedPhotoUrl = async (path: string): Promise<string | null> => {
  // Firebase Storage URLs are already signed/accessible
  return path;
};

export const useTodayPhoto = () => {
  const { user } = useFirebaseAuth();
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['daily-photo', user?.uid, today],
    queryFn: async () => {
      if (!user) return null;
      
      const photo = await getTodayPhoto(user.uid);
      return photo ? toAppPhoto(photo) : null;
    },
    enabled: !!user,
  });
};

export const useUploadDailyPhoto = () => {
  const queryClient = useQueryClient();
  const { user } = useFirebaseAuth();

  return useMutation({
    mutationFn: async ({ file, caption }: { file: File; caption?: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const photo = await uploadDailyPhoto(user.uid, file, caption);
      return toAppPhoto(photo);
    },
    onSuccess: () => {
      const today = new Date().toISOString().split('T')[0];
      queryClient.invalidateQueries({ queryKey: ['daily-photo', user?.uid, today] });
      queryClient.invalidateQueries({ queryKey: ['all-photos', user?.uid] });
    },
  });
};

export const useAllPhotos = (partnerId?: string | null) => {
  const { user } = useFirebaseAuth();

  return useQuery({
    queryKey: ['all-photos', user?.uid, partnerId],
    queryFn: async () => {
      if (!user) return [];
      
      const photos = await getAllPhotos(user.uid, partnerId || undefined);
      return photos.map(toAppPhoto);
    },
    enabled: !!user,
  });
};
