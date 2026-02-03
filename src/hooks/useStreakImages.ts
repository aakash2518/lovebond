import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';

export interface StreakImage {
  id: string;
  user_id: string;
  streak_count: number;
  image_url: string;
  caption: string | null;
  created_at: string;
  signedUrl?: string;
}

export const useStreakImages = () => {
  const { user } = useFirebaseAuth();

  return useQuery({
    queryKey: ['streak-images', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      
      // Get both user's and partner's streak images
      const { data, error } = await supabase
        .from('streak_images')
        .select(`
          *,
          profiles!inner(name, profile_photo_url)
        `)
        .or(`user_id.eq.${user.uid},user_id.in.(select profiles.user_id from profiles where profiles.partner_id = (select profiles.id from profiles where profiles.user_id = '${user.uid}'))`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Get signed URLs for images
      const imagesWithSignedUrls = await Promise.all(
        data.map(async (image) => {
          if (image.image_url.startsWith('http')) {
            return { ...image, signedUrl: image.image_url };
          }
          
          const { data: urlData } = await supabase.storage
            .from('streak-images')
            .createSignedUrl(image.image_url, 3600 * 24); // 24 hours
          
          return {
            ...image,
            signedUrl: urlData?.signedUrl || image.image_url
          };
        })
      );
      
      return imagesWithSignedUrls as (StreakImage & { profiles: { name: string; profile_photo_url: string | null } })[];
    },
    enabled: !!user,
  });
};

export const useSaveStreakImage = () => {
  const queryClient = useQueryClient();
  const { user } = useFirebaseAuth();

  return useMutation({
    mutationFn: async ({ 
      imageFile, 
      streakCount, 
      caption 
    }: { 
      imageFile: File; 
      streakCount: number; 
      caption?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const fileName = `streak-${streakCount}-${Date.now()}.${imageFile.name.split('.').pop()}`;
      const filePath = `${user.uid}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('streak-images')
        .upload(filePath, imageFile, {
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Save to database
      const { data, error } = await supabase
        .from('streak_images')
        .insert({
          user_id: user.uid,
          streak_count: streakCount,
          image_url: filePath,
          caption: caption || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streak-images'] });
    },
  });
};

export const useDeleteStreakImage = () => {
  const queryClient = useQueryClient();
  const { user } = useFirebaseAuth();

  return useMutation({
    mutationFn: async (imageId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      // Get image details first
      const { data: image, error: fetchError } = await supabase
        .from('streak_images')
        .select('image_url')
        .eq('id', imageId)
        .eq('user_id', user.uid)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      if (image.image_url && !image.image_url.startsWith('http')) {
        await supabase.storage
          .from('streak-images')
          .remove([image.image_url]);
      }

      // Delete from database
      const { error } = await supabase
        .from('streak_images')
        .delete()
        .eq('id', imageId)
        .eq('user_id', user.uid);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streak-images'] });
    },
  });
};