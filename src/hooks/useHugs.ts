import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { useCoupleData } from './useCouple';
import { useProfile } from './useProfile';
import { sendHug, getCoupleHugs, getTodayHugsReceived, getTodayHugsSent, subscribeToHugs } from '@/lib/firestore/hugs';
import { useNotifications } from './useNotifications';
import { useMobile } from './useMobile';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export const useHugs = () => {
  const { user } = useFirebaseAuth();
  const { data: couple } = useCoupleData();
  const { data: profile } = useProfile();
  const { sendHugNotification } = useNotifications();
  const { hapticFeedback } = useMobile();
  const queryClient = useQueryClient();
  const [incomingHugs, setIncomingHugs] = useState<any[]>([]);

  // Subscribe to incoming hugs for real-time notifications
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeToHugs(user.uid, (newHug) => {
      // Only show notification if it's a hug received (not sent)
      if (newHug.receiver_id === user.uid && newHug.sender_id !== user.uid) {
        // Trigger haptic feedback
        hapticFeedback('HEAVY');
        
        // Show notification
        const senderName = profile?.partner_nickname || 'Your partner';
        toast.success(`🤗 ${senderName} sent you a hug!`, {
          description: newHug.message || "You received a warm virtual hug 💕",
          duration: 5000,
          action: {
            label: "Send back",
            onClick: () => sendHugMutation.mutate("Hugging you back! 💕")
          }
        });

        // Browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`🤗 Hug from ${senderName}`, {
            body: newHug.message || "You received a warm virtual hug 💕",
            icon: '/favicon.ico',
            tag: 'hug-notification'
          });
          
          // Trigger vibration separately if supported
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
        }

        // Update incoming hugs state
        setIncomingHugs(prev => [newHug, ...prev]);
        
        // Invalidate queries to refresh counters
        queryClient.invalidateQueries({ queryKey: ['hugs-received-today'] });
      }
    });

    return () => unsubscribe();
  }, [user?.uid, profile?.partner_nickname, hapticFeedback, queryClient]);

  // Get couple's hug history
  const { data: hugHistory, isLoading: hugHistoryLoading } = useQuery({
    queryKey: ['hugs', couple?.id],
    queryFn: () => couple?.id ? getCoupleHugs(couple.id) : Promise.resolve([]),
    enabled: !!couple?.id,
  });

  // Get today's hugs received
  const { data: todayHugsReceived } = useQuery({
    queryKey: ['hugs-received-today', user?.uid],
    queryFn: () => user?.uid ? getTodayHugsReceived(user.uid) : Promise.resolve(0),
    enabled: !!user?.uid,
  });

  // Get today's hugs sent
  const { data: todayHugsSent } = useQuery({
    queryKey: ['hugs-sent-today', user?.uid],
    queryFn: () => user?.uid ? getTodayHugsSent(user.uid) : Promise.resolve(0),
    enabled: !!user?.uid,
  });

  // Send hug mutation
  const sendHugMutation = useMutation({
    mutationFn: async (message?: string) => {
      if (!user?.uid || !profile?.partner_id || !couple?.id) {
        throw new Error('Missing required data for sending hug');
      }

      return await sendHug(user.uid, profile.partner_id, couple.id, message);
    },
    onSuccess: () => {
      // Haptic feedback for sender
      hapticFeedback('MEDIUM');
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['hugs'] });
      queryClient.invalidateQueries({ queryKey: ['hugs-sent-today'] });

      // Show success message
      const partnerName = profile?.partner_nickname || 'Your partner';
      toast.success("Hug sent! 🤗💕", {
        description: `${partnerName} will feel your warm hug!`,
        duration: 3000
      });
    },
    onError: (error) => {
      console.error('Failed to send hug:', error);
      toast.error('Failed to send hug. Please try again.');
    },
  });

  return {
    hugHistory,
    hugHistoryLoading,
    todayHugsReceived: todayHugsReceived || 0,
    todayHugsSent: todayHugsSent || 0,
    incomingHugs,
    sendHug: sendHugMutation.mutate,
    sendHugAsync: sendHugMutation.mutateAsync,
    isSendingHug: sendHugMutation.isPending,
  };
};