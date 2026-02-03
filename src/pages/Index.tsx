import { useState, useRef } from "react";
import { Wine, Sparkles, Heart, LogOut, MapPin } from "lucide-react";
import { toast } from "sonner";
import WelcomeHeader from "@/components/WelcomeHeader";
import StatsCard from "@/components/StatsCard";
import DaysTogetherCard from "@/components/DaysTogetherCard";
import FeatureCard from "@/components/FeatureCard";
import ActionCard from "@/components/ActionCard";
import HugButton from "@/components/HugButton";
import LoveStreakCard from "@/components/LoveStreakCard";
import BottomNavigation from "@/components/BottomNavigation";
import ChatView from "@/components/ChatView";
import TruthOrDrinkGame from "@/components/TruthOrDrinkGame";
import ScratchLoveGame from "@/components/ScratchLoveGame";
import StreakGalleryView from "@/components/StreakGalleryView";
import ProfileView from "@/components/ProfileView";
import LiveLocationView from "@/components/LiveLocationView";
import { Button } from "@/components/ui/button";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useLoveStreak, useUpdateStreak } from "@/hooks/useLoveStreak";
import { useTodayPhoto, useUploadDailyPhoto } from "@/hooks/useDailyPhotos";
import { useDailyLoveMessage } from "@/hooks/useDailyLoveMessage";
import { useHugs } from "@/hooks/useHugs";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { signOut, user } = useFirebaseAuth();
  const { data: profile } = useProfile();
  const { data: streak } = useLoveStreak();
  const { data: todayPhoto } = useTodayPhoto();
  const { data: dailyMessage } = useDailyLoveMessage();
  const { todayHugsSent, todayHugsReceived } = useHugs();
  const uploadPhoto = useUploadDailyPhoto();
  const updateStreak = useUpdateStreak();

  // Get relationship start date (or fallback to profile created_at)
  const relationshipStartDate = profile?.relationship_start_date || null;
  const createdAt = profile?.created_at || new Date().toISOString();

  const handleTruthOrDrink = () => {
    setActiveTab("truthordrink");
  };

  const handleScratchGame = () => {
    setActiveTab("scratchgame");
  };

  const handleLiveLocation = () => {
    setActiveTab("livelocation");
  };

  const handleSendPhoto = () => {
    if (todayPhoto) {
      toast.info("You've already shared a photo today! 📸", {
        description: "Come back tomorrow for another moment"
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadPhoto.mutateAsync({ file });
      await updateStreak.mutateAsync();
      toast.success("Photo uploaded! 📸", {
        description: "Your streak continues! Keep the love going!"
      });
    } catch (error) {
      toast.error("Failed to upload photo. Please try again.");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("See you soon! 💕");
  };

  // Render different views based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <ChatView />;
      case "love":
        return <StreakGalleryView onBack={() => setActiveTab("home")} />;
      case "profile":
        return <ProfileView />;
      case "truthordrink":
        return <TruthOrDrinkGame onBack={() => setActiveTab("home")} />;
      case "scratchgame":
        return <ScratchLoveGame onBack={() => setActiveTab("home")} />;
      case "livelocation":
        return <LiveLocationView onBack={() => setActiveTab("home")} />;
      default:
        return (
          <>
            {/* Sign out button */}
            <div className="flex justify-end pt-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>

            <WelcomeHeader name={profile?.name || user?.email?.split('@')[0] || 'Love'} />

            {/* Daily Love Message */}
            {dailyMessage && (
              <div className="mb-4 p-4 glass-card rounded-2xl border border-primary/20 text-center">
                <p className="text-foreground/80 italic">{dailyMessage.message}</p>
              </div>
            )}

            {/* Stats Grid */}
            <section className="grid grid-cols-2 gap-4 mb-4">
              <DaysTogetherCard 
                relationshipStartDate={relationshipStartDate} 
                createdAt={createdAt} 
              />
              <StatsCard title="Love Streak" value={`${streak?.current_streak || 0} 🔥`} />
            </section>



            {/* Features Grid */}
            <section className="grid grid-cols-2 gap-4 mb-4">
              <FeatureCard 
                title="Truth or Drink" 
                icon={Wine} 
                onClick={handleTruthOrDrink}
              />
              <FeatureCard 
                title="Scratch Love Game" 
                icon={Sparkles} 
                onClick={handleScratchGame}
              />
            </section>

            {/* Action Cards */}
            <section className="space-y-4 mb-4">
              <ActionCard
                title="Live Location"
                subtitle="See where your partner is right now"
                icon={MapPin}
                onClick={handleLiveLocation}
              />
              <HugButton variant="card" />
            </section>

            {/* Love Streak */}
            <section className="mb-6">
              <LoveStreakCard 
                streakDays={streak?.current_streak || 0} 
                onSendPhoto={handleSendPhoto}
                hasUploadedToday={!!todayPhoto}
              />
            </section>

            {/* Today's Photo Preview */}
            {todayPhoto && (
              <section className="mb-6">
                <div className="glass-card rounded-2xl p-4 border border-border/50">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Today's Moment</h3>
                  {todayPhoto.signedUrl && (
                    <img 
                      src={todayPhoto.signedUrl} 
                      alt="Today's photo" 
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  )}
                </div>
              </section>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hidden file input - opens camera directly */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload photo"
        title="Upload photo"
      />

      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 max-w-md mx-auto h-[calc(100vh-6rem)]">
        {activeTab === "home" ? (
          <div className="px-4 h-full overflow-y-auto">
            {renderContent()}
          </div>
        ) : (
          renderContent()
        )}
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
