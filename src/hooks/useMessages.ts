import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { 
  sendMessage as sendMessageFirestore, 
  getMessages, 
  subscribeToMessages,
  Message as FirestoreMessage 
} from '@/lib/firestore/messages';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

// Convert Firestore message to app format
const toAppMessage = (firestoreMessage: FirestoreMessage): Message => {
  return {
    id: firestoreMessage.id,
    sender_id: firestoreMessage.senderId,
    receiver_id: firestoreMessage.receiverId,
    content: firestoreMessage.content,
    is_read: firestoreMessage.isRead,
    created_at: firestoreMessage.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
};

export const useMessages = (partnerId: string | null) => {
  const { user } = useFirebaseAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !partnerId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Subscribe to realtime messages
    const unsubscribe = subscribeToMessages(user.uid, partnerId, (firestoreMessages) => {
      setMessages(firestoreMessages.map(toAppMessage));
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [user, partnerId]);

  return {
    data: messages,
    isLoading,
  };
};

export const useSendMessage = () => {
  const { user } = useFirebaseAuth();

  return useMutation({
    mutationFn: async ({ receiverId, content }: { receiverId: string; content: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const messageId = await sendMessageFirestore(user.uid, receiverId, content);
      return { id: messageId };
    },
  });
};
