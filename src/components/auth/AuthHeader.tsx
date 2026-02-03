import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthHeaderProps {
  tagline: string;
}

const AuthHeader = ({ tagline }: AuthHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <Heart className="w-8 h-8 text-primary" fill="currentColor" />
        </motion.div>
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-display font-bold text-foreground"
      >
        Love Bond
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-muted-foreground mt-2"
      >
        {tagline}
      </motion.p>
    </div>
  );
};

export default AuthHeader;
