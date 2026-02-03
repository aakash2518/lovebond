import { Heart } from "lucide-react";

interface HugStatsCardProps {
  hugsSent: number;
  hugsReceived: number;
}

const HugStatsCard = ({ hugsSent, hugsReceived }: HugStatsCardProps) => {
  return (
    <div className="glass-card rounded-xl p-4 border border-border/30">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-5 h-5 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Today's Hugs</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{hugsSent}</p>
          <p className="text-xs text-muted-foreground">Sent</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-secondary">{hugsReceived}</p>
          <p className="text-xs text-muted-foreground">Received</p>
        </div>
      </div>
      
      {hugsSent === 0 && hugsReceived === 0 && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Send your first hug today! 🤗
        </p>
      )}
    </div>
  );
};

export default HugStatsCard;