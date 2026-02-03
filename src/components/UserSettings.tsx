import { useState } from "react";
import { User, Bell, Mic, MapPin, Clock, Palette, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUserPreferences, useUpdateUserPreferences } from "@/hooks/useUserPreferences";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const UserSettings = () => {
  const { data: preferences, isLoading: prefsLoading } = useUserPreferences();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updatePreferences = useUpdateUserPreferences();
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState({
    // Profile data
    name: profile?.name || "",
    bio: profile?.bio || "",
    partner_nickname: profile?.partner_nickname || "",
    
    // Preferences
    notification_enabled: preferences?.notification_enabled ?? true,
    voice_notes_enabled: preferences?.voice_notes_enabled ?? true,
    location_sharing_enabled: preferences?.location_sharing_enabled ?? true,
    daily_reminder_time: preferences?.daily_reminder_time || "20:00:00",
    theme: preferences?.theme || "dark",
    language: preferences?.language || "en",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        name: formData.name,
        bio: formData.bio,
        partner_nickname: formData.partner_nickname,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleSavePreferences = async () => {
    try {
      await updatePreferences.mutateAsync({
        notification_enabled: formData.notification_enabled,
        voice_notes_enabled: formData.voice_notes_enabled,
        location_sharing_enabled: formData.location_sharing_enabled,
        daily_reminder_time: formData.daily_reminder_time,
        theme: formData.theme as 'light' | 'dark' | 'auto',
        language: formData.language,
      });
      toast.success("Preferences updated successfully!");
    } catch (error) {
      toast.error("Failed to update preferences");
    }
  };

  if (prefsLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
          <User className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your profile and preferences
          </p>
        </div>
      </div>

      {/* Profile Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and relationship details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell something about yourself"
              maxLength={150}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner_nickname">Partner's Nickname</Label>
            <Input
              id="partner_nickname"
              value={formData.partner_nickname}
              onChange={(e) => handleInputChange("partner_nickname", e.target.value)}
              placeholder="What do you call your partner?"
            />
          </div>

          <Button 
            onClick={handleSaveProfile}
            disabled={updateProfile.isPending}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {updateProfile.isPending ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Control how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications for messages and activities
              </p>
            </div>
            <Switch
              checked={formData.notification_enabled}
              onCheckedChange={(checked) => handleInputChange("notification_enabled", checked)}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="reminder_time">Daily Reminder Time</Label>
            <Input
              id="reminder_time"
              type="time"
              value={formData.daily_reminder_time.slice(0, 5)}
              onChange={(e) => handleInputChange("daily_reminder_time", e.target.value + ":00")}
            />
            <p className="text-xs text-muted-foreground">
              When to remind you about daily activities
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Privacy & Features
          </CardTitle>
          <CardDescription>
            Control your privacy and feature preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Voice Messages
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable sending and receiving voice notes
              </p>
            </div>
            <Switch
              checked={formData.voice_notes_enabled}
              onCheckedChange={(checked) => handleInputChange("voice_notes_enabled", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location Sharing
              </Label>
              <p className="text-sm text-muted-foreground">
                Share your location with your partner
              </p>
            </div>
            <Switch
              checked={formData.location_sharing_enabled}
              onCheckedChange={(checked) => handleInputChange("location_sharing_enabled", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={formData.theme}
              onValueChange={(value) => handleInputChange("theme", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => handleInputChange("language", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Preferences */}
      <Button 
        onClick={handleSavePreferences}
        disabled={updatePreferences.isPending}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        size="lg"
      >
        <Save className="h-4 w-4 mr-2" />
        {updatePreferences.isPending ? "Saving..." : "Save All Preferences"}
      </Button>
    </div>
  );
};

export default UserSettings;