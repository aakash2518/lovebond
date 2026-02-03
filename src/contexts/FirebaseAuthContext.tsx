import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile } from '@/lib/firestore/users';
import { createLoveStreak as createStreak } from '@/lib/firestore/streaks';

interface FirebaseAuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error('useFirebaseAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};

// Sync Firebase user to Firestore
const syncUserToFirestore = async (firebaseUser: User) => {
  try {
    await createUserProfile(
      firebaseUser.uid,
      firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      firebaseUser.email
    );
    await createStreak(firebaseUser.uid);
  } catch (error) {
    console.error('Error syncing user to Firestore:', error);
  }
};

export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Sync to Firestore in background
        setTimeout(() => {
          syncUserToFirestore(firebaseUser);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Add scopes for better user data access
      provider.addScope('email');
      provider.addScope('profile');
      
      // Configure custom parameters
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      await signInWithPopup(auth, provider);
      return { error: null };
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Handle specific Google auth errors
      if (error.code === 'auth/popup-closed-by-user') {
        return { error: new Error('Sign-in cancelled by user') };
      } else if (error.code === 'auth/popup-blocked') {
        return { error: new Error('Popup blocked. Please allow popups and try again.') };
      } else if (error.code === 'auth/cancelled-popup-request') {
        return { error: new Error('Another sign-in popup is already open') };
      }
      
      return { error: error as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Attempting to send password reset email to:', email);
      
      // Configure action code settings for better email delivery
      const actionCodeSettings = {
        url: window.location.origin + '/reset-password',
        handleCodeInApp: true,
      };
      
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      console.log('Password reset email sent successfully');
      return { error: null };
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Handle specific errors
      if (error.code === 'auth/user-not-found') {
        return { error: new Error('No account found with this email address') };
      } else if (error.code === 'auth/invalid-email') {
        return { error: new Error('Please enter a valid email address') };
      } else if (error.code === 'auth/too-many-requests') {
        return { error: new Error('Too many password reset attempts. Please try again later.') };
      } else if (error.code === 'auth/network-request-failed') {
        return { error: new Error('Network error. Please check your connection and try again.') };
      }
      
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <FirebaseAuthContext.Provider value={{ 
      user, 
      loading, 
      signUp, 
      signIn, 
      signInWithGoogle,
      resetPassword,
      signOut
    }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};