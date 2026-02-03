import { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useHugs } from '@/hooks/useHugs';
import { useProfile } from '@/hooks/useProfile';
import { useMobile } from '@/hooks/useMobile';

interface HugButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card';
}

const HugButton = ({ className = '', size = 'md', variant = 'default' }: HugButtonProps) => {
  const { sendHug, isSendingHug } = useHugs();
  const { data: profile } = useProfile();
  const { hapticFeedback } = useMobile();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSendHug = async () => {
    if (!profile?.partner_id || isSendingHug) return;

    // Trigger haptic feedback
    hapticFeedback('MEDIUM');
    
    // Start animation
    setIsAnimating(true);
    
    try {
      // Send hug
      sendHug("Sending you a warm hug! 🤗💕");
      
      // Keep animation for a bit longer
      setTimeout(() => setIsAnimating(false), 2000);
    } catch (error) {
      setIsAnimating(false);
    }
  };

  if (variant === 'card') {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSendHug}
        disabled={isSendingHug || !profile?.partner_id}
        className={`glass-card rounded-2xl p-4 w-full text-left flex items-center justify-between transition-all duration-300 group ${
          isSendingHug || !profile?.partner_id
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:scale-[1.02]'
        } ${className}`}
      >
        <div>
          <h3 className="text-foreground font-semibold text-lg">Send a Hug</h3>
          <p className="text-muted-foreground text-sm">
            {profile?.partner_nickname ? `Give ${profile.partner_nickname} a warm hug` : 'Send love to your partner'}
          </p>
        </div>
        
        <div className="relative w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center transition-colors duration-300 group-hover:bg-primary/30">
          <AnimatePresence mode="wait">
            {isSendingHug ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key="heart"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: 1, 
                  scale: isAnimating ? [1, 1.3, 1] : 1,
                  rotate: isAnimating ? [0, 10, -10, 0] : 0
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ 
                  duration: isAnimating ? 0.6 : 0.3,
                  repeat: isAnimating ? 2 : 0
                }}
              >
                <Heart className={`w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110 ${
                  isAnimating ? 'fill-primary' : ''
                }`} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Floating hearts animation */}
          <AnimatePresence>
            {isAnimating && (
              <>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{ 
                      opacity: 0, 
                      scale: 0,
                      x: 0,
                      y: 0
                    }}
                    animate={{ 
                      opacity: [0, 1, 0], 
                      scale: [0, 1, 0.5],
                      x: (i - 1) * 20,
                      y: -30 - (i * 10)
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 1.5,
                      delay: i * 0.2,
                      ease: "easeOut"
                    }}
                  >
                    <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    );
  }

  // Default button variant
  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg'
  };

  return (
    <Button
      onClick={handleSendHug}
      disabled={isSendingHug || !profile?.partner_id}
      className={`relative overflow-hidden ${sizeClasses[size]} ${className}`}
      variant="default"
    >
      <AnimatePresence mode="wait">
        {isSendingHug ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </motion.div>
        ) : (
          <motion.div
            key="send"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={isAnimating ? { 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{ duration: 0.6, repeat: isAnimating ? 2 : 0 }}
            >
              <Heart className={`w-4 h-4 ${isAnimating ? 'fill-current' : ''}`} />
            </motion.div>
            Send Hug
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating hearts animation */}
      <AnimatePresence>
        {isAnimating && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2"
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: -8,
                  y: -8
                }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0, 1, 0.5],
                  x: -8 + (Math.random() - 0.5) * 40,
                  y: -8 - Math.random() * 40
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              >
                <Heart className="w-3 h-3 text-pink-300 fill-pink-300" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </Button>
  );
};

export default HugButton;