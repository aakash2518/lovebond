import { Heart, Camera } from "lucide-react";
import { Button } from "./ui/button";

interface LoveStreakCardProps {
  streakDays: number;
  onSendPhoto?: () => void;
  hasUploadedToday?: boolean;
}

const LoveStreakCard = ({ streakDays, onSendPhoto, hasUploadedToday }: LoveStreakCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-5 gradient-border">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-foreground font-semibold text-lg flex items-center gap-2">
            Love Streak
            <Heart className="w-5 h-5 text-primary fill-primary animate-heartbeat" />
          </h3>
          <p className="text-muted-foreground text-sm">Maintain your daily photo streak</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary glow-text">{streakDays} Days</p>
        </div>
      </div>
      
      <Button 
        variant={hasUploadedToday ? "glass" : "romantic"} 
        className="w-full" 
        onClick={onSendPhoto}
        disabled={hasUploadedToday}
      >
        <Camera className="w-4 h-4 mr-2" />
        {hasUploadedToday ? "Photo Shared Today ✓" : "Send Today Photo"}
      </Button>
    </div>
  );
};

export default LoveStreakCard;
