import { useState, useRef } from "react";
import { User, Camera, Heart, Calendar, Edit2, LogOut, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useLoveStreak } from "@/hooks/useLoveStreak";
import { useCoupleData } from "@/hooks/useCouple";
import { SubscriptionStatus } from "./SubscriptionStatus";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { format } from "date-fns";

const ProfileView = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, signOut } = useFirebaseAuth();
  const { data: profile, isLoading } = useProfile();
  const { data: streak } = useLoveStreak();
  const { data: couple } = useCoupleData();
  const updateProfile = useUpdateProfile();

  const startEditing = () => {
    setEditName(profile?.name || "");
    setEditBio(profile?.bio || "");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditName("");
    setEditBio("");
  };

  const saveChanges = async () => {
    try {
      await updateProfile.mutateAsync({
        name: editName,
        bio: editBio,
      });
      setIsEditing(false);
      toast.success("Profile updated! 💕");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatars/${user.uid}/avatar.${fileExt}`;

      // Upload to Firebase Storage
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, file);
      const photoUrl = await getDownloadURL(storageRef);

      await updateProfile.mutateAsync({
        profile_photo_url: photoUrl,
      });
      toast.success("Profile photo updated! 📸");
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("See you soon! 💕");
  };

  const daysTogether = profile?.created_at
    ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-primary">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
        aria-label="Upload profile photo"
        title="Upload profile photo"
      />

      {/* Header */}
      <div className="px-4 py-4 border-b border-border/30 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Profile</h2>
        {!isEditing ? (
          <Button variant="ghost" size="icon" onClick={startEditing}>
            <Edit2 className="w-5 h-5" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={cancelEditing}>
              <X className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={saveChanges} disabled={updateProfile.isPending}>
              <Check className="w-5 h-5 text-primary" />
            </Button>
          </div>
        )}
      </div>

      {/* Profile content */}
      <div className="px-4 py-6">
        {/* Avatar section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-primary/30">
              <AvatarImage src={profile?.profile_photo_url || undefined} />
              <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                {profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="secondary"
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          {isEditing ? (
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your name"
              className="mt-4 text-center max-w-[200px]"
            />
          ) : (
            <h3 className="text-xl font-semibold text-foreground mt-4">
              {profile?.name || user?.email?.split('@')[0]}
            </h3>
          )}

          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        {/* Bio section */}
        <div className="glass-card rounded-xl p-4 mb-4 border border-border/30">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">About</h4>
          {isEditing ? (
            <Textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              placeholder="Tell your partner something sweet..."
              rows={3}
            />
          ) : (
            <p className="text-foreground">
              {profile?.bio || "No bio yet. Tell your partner something sweet! 💕"}
            </p>
          )}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="glass-card rounded-xl p-4 border border-border/30 text-center">
            <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{daysTogether}</p>
            <p className="text-xs text-muted-foreground">Days Together</p>
          </div>
          <div className="glass-card rounded-xl p-4 border border-border/30 text-center">
            <Heart className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{streak?.current_streak || 0}</p>
            <p className="text-xs text-muted-foreground">Love Streak</p>
          </div>
        </div>

        {/* Couple info */}
        {couple && (
          <div className="glass-card rounded-xl p-4 mb-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-medium text-foreground">Couple Connection</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Connected since {couple.createdAt ? format(couple.createdAt.toDate(), "MMM d, yyyy") : "recently"}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Code: {couple.coupleCode}
            </p>
          </div>
        )}

        {/* Subscription Status */}
        <div className="mb-4">
          <SubscriptionStatus />
        </div>

        {/* Sign out button */}
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ProfileView;
