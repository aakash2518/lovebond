import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { toast } from 'sonner';
import AuthHeader from '@/components/auth/AuthHeader';
import EmailPasswordForm from '@/components/auth/EmailPasswordForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

type AuthMode = 'login' | 'signup' | 'forgot-password';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, resetPassword, user } = useFirebaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/couple-setup');
    }
  }, [user, navigate]);

  const handleEmailPasswordSubmit = async (email: string, password: string, name?: string) => {
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('auth/invalid-credential') || error.message.includes('auth/user-not-found')) {
            toast.error('Invalid email or password');
          } else if (error.message.includes('auth/wrong-password')) {
            toast.error('Incorrect password');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back! 💕');
          navigate('/couple-setup');
        }
      } else {
        const { error } = await signUp(email, password, name || '');
        if (error) {
          if (error.message.includes('auth/email-already-in-use')) {
            toast.error('This email is already registered. Please log in.');
          } else if (error.message.includes('auth/weak-password')) {
            toast.error('Password is too weak. Please use a stronger password.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Account created! Welcome to Love Bond 💕');
          navigate('/couple-setup');
        }
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    console.log('Attempting Google sign-in...');
    
    const { error } = await signInWithGoogle();

    if (error) {
      console.error('Google sign-in failed:', error);
      
      if (error.message.includes('popup-closed') || error.message.includes('cancelled')) {
        toast.info('Sign in cancelled');
      } else if (error.message.includes('popup-blocked')) {
        toast.error('Popup blocked. Please allow popups and try again.');
      } else if (error.message.includes('network')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(`Sign-in failed: ${error.message}`);
      }
    } else {
      console.log('Google sign-in successful');
      toast.success('Welcome! 💕');
    }
    
    setGoogleLoading(false);
  };

  const handleForgotPassword = async (email: string) => {
    setLoading(true);
    console.log('Sending password reset email to:', email);
    
    const { error } = await resetPassword(email);

    if (error) {
      console.error('Password reset failed:', error);
      if (error.message.includes('auth/user-not-found') || error.message.includes('No account found')) {
        toast.error('No account found with this email address');
      } else if (error.message.includes('auth/invalid-email') || error.message.includes('valid email')) {
        toast.error('Please enter a valid email address');
      } else if (error.message.includes('too-many-requests') || error.message.includes('Too many')) {
        toast.error('Too many attempts. Please wait before trying again.');
      } else {
        toast.error('Failed to send reset email: ' + error.message);
      }
    } else {
      console.log('Password reset email sent successfully');
      toast.success('Password reset link sent! Check your email 📧');
      toast.info('Check your spam folder if you don\'t see the email', { duration: 5000 });
      setMode('login');
    }

    setLoading(false);
  };

  const getTagline = () => {
    switch (mode) {
      case 'login': return 'Welcome back, lover!';
      case 'signup': return 'Start your love journey';
      case 'forgot-password': return 'Reset your password';
    }
  };

  const renderForm = () => {
    switch (mode) {
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            onBack={() => setMode('login')}
            loading={loading}
          />
        );
      default:
        return (
          <EmailPasswordForm
            mode={mode}
            onSubmit={handleEmailPasswordSubmit}
            onGoogleSignIn={handleGoogleSignIn}
            onForgotPassword={() => setMode('forgot-password')}
            onToggleMode={() => setMode(mode === 'login' ? 'signup' : 'login')}
            loading={loading}
            googleLoading={googleLoading}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <AuthHeader tagline={getTagline()} />

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="glass-card rounded-3xl p-6 border border-border/50"
        >
          {renderForm()}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;