import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner = ({ size = 'md', message }: LoadingSpinnerProps) => {
  const sizes = {
    sm: { icon: 'w-4 h-4', container: 'w-8 h-8' },
    md: { icon: 'w-6 h-6', container: 'w-12 h-12' },
    lg: { icon: 'w-10 h-10', container: 'w-20 h-20' },
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear"
        }}
        className={`${sizes[size].container} rounded-full bg-primary/20 flex items-center justify-center`}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut"
          }}
        >
          <Heart className={`${sizes[size].icon} text-primary`} fill="currentColor" />
        </motion.div>
      </motion.div>
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
