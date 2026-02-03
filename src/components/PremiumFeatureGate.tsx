import { ReactNode, useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { SubscriptionModal } from './SubscriptionModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import type { PremiumFeature } from '@/lib/subscription/plans';

interface PremiumFeatureGateProps {
  feature: PremiumFeature;
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
  description?: string;
}

export const PremiumFeatureGate = ({ 
  feature, 
  children, 
  fallback,
  title,
  description 
}: PremiumFeatureGateProps) => {
  const { hasFeature } = useSubscription();
  const [showModal, setShowModal] = useState(false);

  if (hasFeature(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const getFeatureTitle = () => {
    switch (feature) {
      case 'scratch_love_game':
        return title || '🎮 Scratch Love Game';
      case 'truth_or_drink':
        return title || '🍻 Truth or Drink Game';
      default:
        return title || '✨ Premium Feature';
    }
  };

  const getFeatureDescription = () => {
    switch (feature) {
      case 'scratch_love_game':
        return description || 'Discover intimate positions and spice up your relationship with our exclusive scratch game!';
      case 'truth_or_drink':
        return description || 'Play fun truth or drink questions designed for couples to know each other better!';
      default:
        return description || 'This premium feature is available with our subscription plans.';
    }
  };

  return (
    <>
      <Card className="relative overflow-hidden border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="absolute top-2 right-2">
          <Crown className="h-6 w-6 text-yellow-500" />
        </div>
        
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <Lock className="h-12 w-12 text-purple-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-purple-700">
              {getFeatureTitle()}
            </h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            {getFeatureDescription()}
          </p>
          
          <Button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-2"
          >
            <Crown className="h-4 w-4 mr-2" />
            Unlock Premium
          </Button>
          
          <p className="text-xs text-gray-500 mt-3">
            Starting from ₹199/month • Cancel anytime
          </p>
        </CardContent>
      </Card>

      <SubscriptionModal
        open={showModal}
        onOpenChange={setShowModal}
        feature={feature}
      />
    </>
  );
};