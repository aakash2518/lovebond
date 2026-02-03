import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';

export interface UserPreferences {
  id: string;
  user_id: string;
  notification_enabled: boolean;
  voice_notes_enabled: boolean;
  location_sharing_enabled: boolean;
  daily_reminder_time: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = () => {
  const { user } = useFirebaseAuth();

  return useQuery({
    queryKey: ['user-preferences', user?.uid],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.uid)
        .maybeSingle();
      
      if (error) throw error;
      
      // If no preferences exist, create default ones
      if (!data) {
        const { data: newPrefs, error: insertError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.uid,
            notification_enabled: true,
            voice_notes_enabled: true,
            location_sharing_enabled: true,
            daily_reminder_time: '20:00:00',
            theme: 'dark',
            language: 'en',
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        return newPrefs as UserPreferences;
      }
      
      return data as UserPreferences;
    },
    enabled: !!user,
  });
};

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();
  const { user } = useFirebaseAuth();

  return useMutation({
    mutationFn: async (preferences: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_preferences')
        .update({
          ...preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.uid)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences', user?.uid] });
    },
  });
};