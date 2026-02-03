import { useState, useEffect, useRef } from 'react';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { useProfile } from './useProfile';
import { CallManager } from '@/lib/webrtc/callManager';
import { 
  createCallOffer, 
  answerCall, 
  rejectCall, 
  endCall,
  subscribeToIncomingCalls,
  subscribeToCallAnswers,
  CallOffer 
} from '@/lib/firestore/calls';
import { toast } from 'sonner';

export type CallState = 'idle' | 'calling' | 'incoming' | 'connected' | 'ended';

export const useCalls = () => {
  const { user } = useFirebaseAuth();
  const { data: profile } = useProfile();
  const [callState, setCallState] = useState<CallState>('idle');
  const [currentCall, setCurrentCall] = useState<CallOffer | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  
  const callManagerRef = useRef<CallManager | null>(null);
  const currentCallIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!callManagerRef.current) {
      callManagerRef.current = new CallManager();
      
      // Setup callbacks
      callManagerRef.current.onRemoteStream((stream) => {
        setRemoteStream(stream);
      });

      callManagerRef.current.onCallEnd(() => {
        setCallState('ended');
        setLocalStream(null);
        setRemoteStream(null);
        setCurrentCall(null);
        currentCallIdRef.current = null;
      });
    }

    return () => {
      if (callManagerRef.current) {
        callManagerRef.current.endCall();
      }
    };
  }, []);

  // Listen for incoming calls
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToIncomingCalls(user.uid, (call) => {
      if (callState === 'idle') {
        setCurrentCall(call);
        setCallState('incoming');
        
        // Show notification
        toast.info(`Incoming ${call.type} call!`, {
          description: 'Tap to answer or decline',
          duration: 30000,
        });
      }
    });

    return unsubscribe;
  }, [user, callState]);

  // Start a voice call
  const startVoiceCall = async () => {
    if (!user || !profile?.partner_id || !callManagerRef.current) {
      toast.error('Unable to start call');
      return;
    }

    try {
      setCallState('calling');
      
      const callOffer = await callManagerRef.current.startCall('voice', profile.partner_id);
      const callId = await createCallOffer(
        user.uid,
        profile.partner_id,
        'voice',
        callOffer.offer
      );
      
      currentCallIdRef.current = callId;
      setLocalStream(callManagerRef.current.getLocalStream());
      
      // Listen for answer
      const unsubscribe = subscribeToCallAnswers(callId, async (answer) => {
        if (callManagerRef.current) {
          await callManagerRef.current.handleAnswer(answer);
          setCallState('connected');
          unsubscribe();
        }
      });

      toast.success('Calling your partner... 📞');
    } catch (error) {
      console.error('Error starting voice call:', error);
      toast.error('Failed to start call');
      setCallState('idle');
    }
  };

  // Start a video call
  const startVideoCall = async () => {
    if (!user || !profile?.partner_id || !callManagerRef.current) {
      toast.error('Unable to start call');
      return;
    }

    try {
      setCallState('calling');
      
      const callOffer = await callManagerRef.current.startCall('video', profile.partner_id);
      const callId = await createCallOffer(
        user.uid,
        profile.partner_id,
        'video',
        callOffer.offer
      );
      
      currentCallIdRef.current = callId;
      setLocalStream(callManagerRef.current.getLocalStream());
      
      // Listen for answer
      const unsubscribe = subscribeToCallAnswers(callId, async (answer) => {
        if (callManagerRef.current) {
          await callManagerRef.current.handleAnswer(answer);
          setCallState('connected');
          unsubscribe();
        }
      });

      toast.success('Video calling your partner... 📹');
    } catch (error) {
      console.error('Error starting video call:', error);
      toast.error('Failed to start video call');
      setCallState('idle');
    }
  };

  // Answer incoming call
  const answerIncomingCall = async () => {
    if (!currentCall || !callManagerRef.current) return;

    try {
      const answer = await callManagerRef.current.answerCall(currentCall);
      await answerCall(currentCall.id, answer.answer);
      
      setCallState('connected');
      setLocalStream(callManagerRef.current.getLocalStream());
      currentCallIdRef.current = currentCall.id;
      
      toast.success('Call connected! 💕');
    } catch (error) {
      console.error('Error answering call:', error);
      toast.error('Failed to answer call');
      setCallState('idle');
    }
  };

  // Reject incoming call
  const rejectIncomingCall = async () => {
    if (!currentCall) return;

    try {
      await rejectCall(currentCall.id);
      setCallState('idle');
      setCurrentCall(null);
      toast.info('Call declined');
    } catch (error) {
      console.error('Error rejecting call:', error);
    }
  };

  // End current call
  const endCurrentCall = async () => {
    if (!currentCallIdRef.current) return;

    try {
      await endCall(currentCallIdRef.current);
      
      if (callManagerRef.current) {
        callManagerRef.current.endCall();
      }
      
      setCallState('idle');
      setCurrentCall(null);
      setLocalStream(null);
      setRemoteStream(null);
      currentCallIdRef.current = null;
      
      toast.info('Call ended');
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  // Toggle video during call
  const toggleVideo = () => {
    if (callManagerRef.current) {
      const newState = !isVideoEnabled;
      callManagerRef.current.toggleVideo(newState);
      setIsVideoEnabled(newState);
    }
  };

  // Toggle audio during call
  const toggleAudio = () => {
    if (callManagerRef.current) {
      const newState = !isAudioEnabled;
      callManagerRef.current.toggleAudio(newState);
      setIsAudioEnabled(newState);
    }
  };

  return {
    callState,
    currentCall,
    localStream,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    startVoiceCall,
    startVideoCall,
    answerIncomingCall,
    rejectIncomingCall,
    endCurrentCall,
    toggleVideo,
    toggleAudio,
  };
};