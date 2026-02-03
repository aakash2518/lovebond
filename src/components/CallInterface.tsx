import { useEffect, useRef } from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalls } from '@/hooks/useCalls';
import { useProfile } from '@/hooks/useProfile';

const CallInterface = () => {
  const {
    callState,
    currentCall,
    localStream,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    answerIncomingCall,
    rejectIncomingCall,
    endCurrentCall,
    toggleVideo,
    toggleAudio,
  } = useCalls();

  const { data: profile } = useProfile();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Setup video streams
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (callState === 'idle') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background"
      >
        {/* Incoming Call Screen */}
        {callState === 'incoming' && currentCall && (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-center mb-8"
            >
              <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto">
                <div className="w-24 h-24 rounded-full bg-primary/40 flex items-center justify-center">
                  {currentCall.type === 'video' ? (
                    <Video className="w-12 h-12 text-primary" />
                  ) : (
                    <Phone className="w-12 h-12 text-primary" />
                  )}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {profile?.partner_nickname || 'Your Partner'}
              </h2>
              <p className="text-muted-foreground">
                Incoming {currentCall.type} call...
              </p>
            </motion.div>

            <div className="flex gap-8">
              <Button
                size="lg"
                variant="destructive"
                className="w-16 h-16 rounded-full"
                onClick={rejectIncomingCall}
              >
                <PhoneOff className="w-8 h-8" />
              </Button>
              <Button
                size="lg"
                variant="default"
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600"
                onClick={answerIncomingCall}
              >
                <Phone className="w-8 h-8" />
              </Button>
            </div>
          </div>
        )}

        {/* Calling Screen */}
        {callState === 'calling' && (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto"
              >
                <div className="w-24 h-24 rounded-full bg-primary/40 flex items-center justify-center">
                  <Phone className="w-12 h-12 text-primary" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {profile?.partner_nickname || 'Your Partner'}
              </h2>
              <p className="text-muted-foreground">Calling...</p>
            </motion.div>

            <Button
              size="lg"
              variant="destructive"
              className="w-16 h-16 rounded-full"
              onClick={endCurrentCall}
            >
              <PhoneOff className="w-8 h-8" />
            </Button>
          </div>
        )}

        {/* Active Call Screen */}
        {callState === 'connected' && (
          <div className="relative h-full">
            {/* Remote Video (Full Screen) */}
            {currentCall?.type === 'video' && (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover bg-gray-900"
              />
            )}

            {/* Voice Call Background */}
            {currentCall?.type === 'voice' && (
              <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="w-48 h-48 rounded-full bg-primary/30 flex items-center justify-center mb-8">
                  <div className="w-32 h-32 rounded-full bg-primary/50 flex items-center justify-center">
                    <Phone className="w-16 h-16 text-primary" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {profile?.partner_nickname || 'Your Partner'}
                </h2>
                <p className="text-muted-foreground">Connected</p>
              </div>
            )}

            {/* Local Video (Picture in Picture) */}
            {currentCall?.type === 'video' && localStream && (
              <div className="absolute top-4 right-4 w-32 h-48 rounded-xl overflow-hidden border-2 border-white/20">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Call Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-4 items-center bg-black/50 backdrop-blur-sm rounded-full px-6 py-4">
                {/* Audio Toggle */}
                <Button
                  size="lg"
                  variant={isAudioEnabled ? "secondary" : "destructive"}
                  className="w-12 h-12 rounded-full"
                  onClick={toggleAudio}
                >
                  {isAudioEnabled ? (
                    <Mic className="w-6 h-6" />
                  ) : (
                    <MicOff className="w-6 h-6" />
                  )}
                </Button>

                {/* End Call */}
                <Button
                  size="lg"
                  variant="destructive"
                  className="w-16 h-16 rounded-full"
                  onClick={endCurrentCall}
                >
                  <PhoneOff className="w-8 h-8" />
                </Button>

                {/* Video Toggle (only for video calls) */}
                {currentCall?.type === 'video' && (
                  <Button
                    size="lg"
                    variant={isVideoEnabled ? "secondary" : "destructive"}
                    className="w-12 h-12 rounded-full"
                    onClick={toggleVideo}
                  >
                    {isVideoEnabled ? (
                      <Video className="w-6 h-6" />
                    ) : (
                      <VideoOff className="w-6 h-6" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CallInterface;