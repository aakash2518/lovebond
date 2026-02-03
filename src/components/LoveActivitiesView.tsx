import { useState } from "react";
import { Heart, Check, Sparkles, Coffee, MessageCircle, Gift, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useLoveActivities, useUserActivities, useCompleteActivity } from "@/hooks/useLoveActivities";
import { format, isToday } from "date-fns";

const iconMap: Record<string, React.ElementType> = {
  heart: Heart,
  sparkles: Sparkles,
  coffee: Coffee,
  message: MessageCircle,
  gift: Gift,
  star: Star,
};

const LoveActivitiesView = () => {
  const { data: activities = [], isLoading: activitiesLoading } = useLoveActivities();
  const { data: userActivities = [], isLoading: userActivitiesLoading } = useUserActivities();
  const completeActivity = useCompleteActivity();

  // Check if activity was completed today
  const isCompletedToday = (activityId: string) => {
    return userActivities.some(
      (ua) => ua.activity_id === activityId && isToday(new Date(ua.completed_at))
    );
  };

  const handleComplete = async (activityId: string, title: string) => {
    if (isCompletedToday(activityId)) {
      toast.info("You've already completed this today! 💕");
      return;
    }

    try {
      await completeActivity.mutateAsync({ activityId });
      toast.success(`"${title}" completed! 🎉`, {
        description: "Keep spreading the love!"
      });
    } catch (error) {
      toast.error("Failed to complete activity");
    }
  };

  const completedTodayCount = activities.filter((a) => isCompletedToday(a.id)).length;
  const totalActivities = activities.length;

  if (activitiesLoading || userActivitiesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-primary">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border/30">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" />
          Love Activities
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Daily ways to show your love
        </p>
      </div>

      {/* Progress */}
      <div className="px-4 py-3 glass-card mx-4 mt-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Today's Progress</span>
          <span className="text-sm font-semibold text-primary">
            {completedTodayCount}/{totalActivities}
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${totalActivities > 0 ? (completedTodayCount / totalActivities) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles className="w-12 h-12 text-primary/30 mb-3" />
            <p className="text-muted-foreground">
              No activities available yet
            </p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = iconMap[activity.icon || 'heart'] || Heart;
            const completed = isCompletedToday(activity.id);

            return (
              <Card
                key={activity.id}
                className={`p-4 border transition-all duration-300 ${
                  completed 
                    ? "border-primary/50 bg-primary/5" 
                    : "border-border/30 glass-card hover:border-primary/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl ${
                    completed ? "bg-primary/20" : "bg-muted"
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      completed ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold ${
                      completed ? "text-primary" : "text-foreground"
                    }`}>
                      {activity.title}
                    </h3>
                    {activity.description && (
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {activity.description}
                      </p>
                    )}
                    {activity.category && (
                      <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-secondary/20 text-secondary">
                        {activity.category}
                      </span>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant={completed ? "outline" : "default"}
                    onClick={() => handleComplete(activity.id, activity.title)}
                    disabled={completeActivity.isPending}
                    className="shrink-0"
                  >
                    {completed ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Done
                      </>
                    ) : (
                      "Complete"
                    )}
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LoveActivitiesView;
