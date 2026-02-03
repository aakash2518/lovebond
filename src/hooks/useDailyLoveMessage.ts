import { useQuery } from '@tanstack/react-query';
import { getDailyLoveMessage, DailyLoveMessage as FirestoreLoveMessage } from '@/lib/firestore/loveMessages';

export interface DailyLoveMessage {
  id: string;
  message: string;
  category: string | null;
  created_at: string;
}

const toAppMessage = (firestoreMessage: FirestoreLoveMessage | null): DailyLoveMessage | null => {
  if (!firestoreMessage) return null;
  
  return {
    id: firestoreMessage.id,
    message: firestoreMessage.message,
    category: firestoreMessage.category,
    created_at: firestoreMessage.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
};

export const useDailyLoveMessage = () => {
  return useQuery({
    queryKey: ['daily-love-message'],
    queryFn: async () => {
      const message = await getDailyLoveMessage();
      return toAppMessage(message);
    },
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });
};
