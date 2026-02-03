import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Copy, Check, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { useCouple } from '@/hooks/useCouple';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

const CoupleSetup = () => {
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [coupleCode, setCoupleCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { user, loading: authLoading, signOut } = useFirebaseAuth();
  const { createCouple, joinCouple, loading } = useCouple();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success("See you soon! 💕");
    navigate('/auth');
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!profileLoading && profile?.couple_id) {
      navigate('/');
    }
  }, [profile, profileLoading, navigate]);

  const handleCreateCouple = async () => {
    const { data, error } = await createCouple();
    if (error) {
      toast.error('Failed to create couple: ' + error.message);
    } else if (data) {
      setGeneratedCode(data.couple_code);
      setMode('create');
      toast.success('Couple created! Share your code with your partner 💕');
    }
  };

  const handleJoinCouple = async () => {
    const trimmedCode = coupleCode.trim();
    
    if (!trimmedCode) {
      toast.error('Please enter a couple code');
      return;
    }

    if (trimmedCode.length !== 8) {
      toast.error('Couple code must be exactly 8 characters');
      return;
    }

    console.log('Attempting to join couple with code:', trimmedCode);
    const { error } = await joinCouple(trimmedCode);
    
    if (error) {
      console.error('Join couple error:', error);
      if (error.message.includes('Invalid couple code')) {
        toast.error('Invalid couple code. Please check and try again.');
      } else if (error.message.includes('already has two members')) {
        toast.error('This couple already has two members.');
      } else if (error.message.includes('cannot join your own couple')) {
        toast.error('You cannot join your own couple code.');
      } else {
        toast.error('Failed to join couple: ' + error.message);
      }
    } else {
      console.log('Successfully joined couple');
      toast.success('Successfully joined your partner! 💕');
      navigate('/');
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Sign out button */}
      <div className="fixed top-4 right-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Connect with Partner</h1>
          <p className="text-muted-foreground mt-2">
            {mode === 'choose' && 'Create a new couple or join your partner'}
            {mode === 'create' && 'Share this code with your partner'}
            {mode === 'join' && 'Enter your partner\'s couple code'}
          </p>
        </div>

        {/* Content Card */}
        <div className="glass-card rounded-3xl p-6 border border-border/50">
          {mode === 'choose' && (
            <div className="space-y-4">
              <Button
                onClick={handleCreateCouple}
                className="w-full h-16 text-lg"
                variant="romantic"
                disabled={loading}
              >
                <Heart className="w-5 h-5 mr-2" />
                I'm the first partner
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                onClick={() => setMode('join')}
                className="w-full h-16 text-lg"
                variant="outline"
              >
                <Users className="w-5 h-5 mr-2" />
                I have a couple code
              </Button>
            </div>
          )}

          {mode === 'create' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-3">Your couple code:</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="text-3xl font-mono font-bold text-primary tracking-wider bg-primary/10 px-4 py-2 rounded-lg">
                    {generatedCode.toUpperCase()}
                  </code>
                  <Button
                    onClick={copyCode}
                    size="icon"
                    variant="ghost"
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p>Share this code with your partner. Once they join, you'll be connected!</p>
              </div>

              <Button
                onClick={() => navigate('/')}
                className="w-full"
                variant="romantic"
              >
                Continue to App
              </Button>
            </div>
          )}

          {mode === 'join' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Enter 8-character code (e.g., ABC123XY)"
                  value={coupleCode}
                  onChange={(e) => setCoupleCode(e.target.value.toUpperCase())}
                  className="text-center text-xl font-mono tracking-wider bg-background/50 border-border/50"
                  maxLength={8}
                />
                <p className="text-xs text-muted-foreground text-center">
                  Enter the 8-character code your partner shared with you
                </p>
              </div>

              <Button
                onClick={handleJoinCouple}
                className="w-full"
                variant="romantic"
                disabled={loading || !coupleCode.trim()}
              >
                {loading ? 'Joining...' : 'Join Partner'}
              </Button>

              <Button
                onClick={() => setMode('choose')}
                variant="ghost"
                className="w-full"
              >
                Back
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoupleSetup;
