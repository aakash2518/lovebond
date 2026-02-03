import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Calendar, Zap, Settings } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionModal } from './SubscriptionModal';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription/plans';

export const SubscriptionStatus = () => {
  const { subscription, isPremium } = useSubscription();
  const [showModal, setShowModal] = useState(false);

  const currentPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === subscription.plan);
  const isExpired = subscription.expiresAt && subscription.expiresAt < new Date();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysLeft = () => {
    if (!subscription.expiresAt) return null;
    const now = new Date();
    const diffTime = subscription.expiresAt.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <>
      <Card className={`${isPremium() ? 'border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20' : ''}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isPremium() ? (
                <Crown className="h-5 w-5 text-yellow-500" />
              ) : (
                <Zap className="h-5 w-5 text-gray-500" />
              )}
              <span>Subscription</span>
            </div>
            <Badge 
              variant={isPremium() ? "default" : "secondary"}
              className={isPremium() ? "bg-yellow-500 text-white" : ""}
            >
              {currentPlan?.name || 'Free'}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isPremium() && subscription.expiresAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {isExpired ? 'Expired on' : 'Expires on'} {formatDate(subscription.expiresAt)}
                {!isExpired && getDaysLeft() && (
                  <span className="ml-1 text-orange-600 font-medium">
                    ({getDaysLeft()} days left)
                  </span>
                )}
              </span>
            </div>
          )}

          {isPremium() && (
            <div className="text-sm">
              <p className="font-medium text-green-700 dark:text-green-400 mb-2">
                ✨ Premium Features Active:
              </p>
              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <div>🎮 Scratch Love Game</div>
                <div>🍻 Truth or Drink</div>
                <div>📸 Unlimited Photos</div>
                <div>🎨 Premium Themes</div>
              </div>
            </div>
          )}

          {!isPremium() && (
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Unlock premium features:</p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div>🎮 Exclusive Games</div>
                <div>📸 Unlimited Photos</div>
                <div>🎨 Premium Themes</div>
                <div>⚡ Priority Support</div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {!isPremium() ? (
              <Button
                onClick={() => setShowModal(true)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowModal(true)}
                className="flex-1"
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            )}
          </div>

          {isExpired && (
            <div className="p-3 bg-orange-100 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                ⚠️ Your premium subscription has expired. Renew to continue enjoying premium features!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <SubscriptionModal
        open={showModal}
        onOpenChange={setShowModal}
      />
    </>
  );
};