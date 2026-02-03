import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FirebaseAuthProvider, useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useMobile } from "@/hooks/useMobile";
import SplashScreen from "@/components/SplashScreen";
import LoadingSpinner from "@/components/LoadingSpinner";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import RelationshipOnboarding from "./pages/RelationshipOnboarding";
import CoupleSetup from "./pages/CoupleSetup";
import NotFound from "./pages/NotFound";
import CallInterface from "./components/CallInterface";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useFirebaseAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your love story..." />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to relationship onboarding if no relationship details
  if (!profile?.relationship_start_date) {
    return <Navigate to="/relationship-onboarding" replace />;
  }

  // Redirect to couple setup if not connected to a couple
  if (!profile?.couple_id) {
    return <Navigate to="/couple-setup" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { loading } = useFirebaseAuth();
  const { isNative, keyboardHeight, isKeyboardOpen } = useMobile();

  useEffect(() => {
    // Show splash screen for at least 2 seconds or until auth loads
    const timer = setTimeout(() => {
      if (!loading) {
        setShowSplash(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    // Hide splash once auth finishes loading (after minimum time)
    if (!loading && showSplash) {
      const timer = setTimeout(() => setShowSplash(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loading, showSplash]);

  // Apply mobile-specific styles
  useEffect(() => {
    if (isNative) {
      document.body.classList.add('mobile-app');
    }
    
    // Adjust for keyboard
    if (isKeyboardOpen && keyboardHeight > 0) {
      document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
      document.body.classList.add('keyboard-open');
    } else {
      document.documentElement.style.removeProperty('--keyboard-height');
      document.body.classList.remove('keyboard-open');
    }
  }, [isNative, isKeyboardOpen, keyboardHeight]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className={`min-h-screen ${isNative ? 'safe-top safe-bottom' : ''}`}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/relationship-onboarding" element={<RelationshipOnboarding />} />
          <Route path="/couple-setup" element={<CoupleSetup />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FirebaseAuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
        <CallInterface />
      </TooltipProvider>
    </FirebaseAuthProvider>
  </QueryClientProvider>
);

export default App;
