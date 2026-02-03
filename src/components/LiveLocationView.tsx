import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Heart, Navigation, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useMyLocation, usePartnerLocation, useLocationWatcher, calculateDistance } from '@/hooks/useLocation';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

interface LiveLocationViewProps {
  onBack: () => void;
}

const LiveLocationView = ({ onBack }: LiveLocationViewProps) => {
  const { data: myLocation, isLoading: myLoading } = useMyLocation();
  const { data: partnerLocation, isLoading: partnerLoading } = usePartnerLocation();
  const { data: profile } = useProfile();
  const { isWatching, startWatching, stopWatching } = useLocationWatcher();
  const [showHearts, setShowHearts] = useState(false);

  useEffect(() => {
    // Auto-start location watching
    startWatching();
    return () => stopWatching();
  }, []);

  // Calculate distance between partners
  const distance = myLocation && partnerLocation 
    ? calculateDistance(
        myLocation.latitude, 
        myLocation.longitude, 
        partnerLocation.latitude, 
        partnerLocation.longitude
      )
    : null;

  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)} meters`;
    }
    return `${km.toFixed(1)} km`;
  };

  const getLastUpdateText = (updatedAt: string) => {
    const diff = Date.now() - new Date(updatedAt).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  };

  const handleSendLove = () => {
    setShowHearts(true);
    toast.success('Sending love to your partner! 💕');
    setTimeout(() => setShowHearts(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Live Location 📍
        </h1>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Distance Card - Main attraction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 border border-primary/30 text-center relative overflow-hidden"
        >
          {/* Animated background hearts */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity 
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/20 rounded-full blur-2xl"
            />
          </div>

          <div className="relative z-10">
            {/* Hearts connecting animation */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center"
              >
                <Heart className="w-8 h-8 text-primary" fill="currentColor" />
              </motion.div>
              
              {/* Animated connection line */}
              <div className="flex-1 relative h-1">
                <div className="absolute inset-0 bg-primary/20 rounded-full" />
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
                />
              </div>
              
              <motion.div
                animate={{ scale: [1.1, 1, 1.1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center"
              >
                <Heart className="w-8 h-8 text-secondary" fill="currentColor" />
              </motion.div>
            </div>

            {/* Distance display */}
            {distance !== null ? (
              <>
                <motion.p
                  key={distance}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-bold text-foreground mb-2"
                >
                  {formatDistance(distance)}
                </motion.p>
                <p className="text-muted-foreground">apart from your love</p>
                
                {distance < 0.1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-primary font-medium"
                  >
                    ✨ You're together! Enjoy your moment! ✨
                  </motion.div>
                )}
              </>
            ) : (
              <div className="text-muted-foreground">
                {partnerLoading ? 'Finding your partner...' : 'Waiting for partner location...'}
              </div>
            )}
          </div>
        </motion.div>

        {/* Location Cards */}
        <div className="grid grid-cols-1 gap-4">
          {/* My Location */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-5 border border-border/50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Navigation className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Your Location</h3>
                {myLoading ? (
                  <p className="text-sm text-muted-foreground">Getting location...</p>
                ) : myLocation ? (
                  <p className="text-sm text-muted-foreground">
                    Updated {getLastUpdateText(myLocation.updated_at)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Location not available</p>
                )}
              </div>
              <div className={`w-3 h-3 rounded-full ${isWatching ? 'bg-green-500 animate-pulse' : 'bg-muted'}`} />
            </div>
          </motion.div>

          {/* Partner Location */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-5 border border-border/50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  {profile?.partner_nickname || 'Partner'}'s Location
                </h3>
                {partnerLoading ? (
                  <p className="text-sm text-muted-foreground">Finding partner...</p>
                ) : partnerLocation ? (
                  <p className="text-sm text-muted-foreground">
                    Updated {getLastUpdateText(partnerLocation.updated_at)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Partner hasn't shared location</p>
                )}
              </div>
              <div className={`w-3 h-3 rounded-full ${partnerLocation ? 'bg-green-500' : 'bg-muted'}`} />
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            variant="romantic"
            className="flex-1 h-14 text-lg"
            onClick={handleSendLove}
          >
            <Heart className="w-5 h-5 mr-2" fill="currentColor" />
            Send Love
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14"
            onClick={() => {
              if (isWatching) {
                stopWatching();
                toast.info('Location sharing paused');
              } else {
                startWatching();
                toast.success('Location sharing resumed');
              }
            }}
          >
            <RefreshCw className={`w-5 h-5 ${isWatching ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Privacy Note */}
        <p className="text-center text-xs text-muted-foreground">
          🔒 Your location is only shared with your partner
        </p>
      </div>

      {/* Floating Hearts Animation */}
      <AnimatePresence>
        {showHearts && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  opacity: 1, 
                  y: '100vh', 
                  x: `${Math.random() * 100}vw`,
                  scale: 0.5 + Math.random() * 0.5
                }}
                animate={{ 
                  y: '-20vh',
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 2 + Math.random(),
                  delay: Math.random() * 0.5
                }}
                className="absolute text-4xl"
              >
                💕
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveLocationView;
