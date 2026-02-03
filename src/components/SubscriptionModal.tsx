import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription/plans';
import { useSubscription } from '@/hooks/useSubscription';
import { PaymentGateway } from './PaymentGateway';
import { toast } from 'sonner';

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

export const SubscriptionModal = ({ open, onOpenChange, feature }: SubscriptionModalProps) => {
  const { upgradeSubscription } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof SUBSCRIPTION_PLANS[0] | null>(null);

  const handleUpgrade = async (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    if (plan.id === 'free') return;
    
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    if (!selectedPlan) return;
    
    setLoading(selectedPlan.id);
    
    try {
      const success = await upgradeSubscription(selectedPlan.id);
      
      if (success) {
        toast.success('🎉 Premium activated! Enjoy all features!');
        onOpenChange(false);
      } else {
        toast.error('Failed to upgrade. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
      setShowPayment(false);
      setSelectedPlan(null);
    }
  };

  const getFeatureMessage = () => {
    switch (feature) {
      case 'scratch_love_game':
        return '🎮 Unlock Scratch Love Game with Premium!';
      case 'truth_or_drink':
        return '🍻 Unlock Truth or Drink Game with Premium!';
      default:
        return '✨ Upgrade to Premium for amazing features!';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            {getFeatureMessage()}
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.popular ? 'border-2 border-purple-500 shadow-lg' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-500">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  ₹{plan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{plan.interval}
                  </span>
                </div>
                {plan.id === 'premium_yearly' && (
                  <Badge variant="secondary" className="text-green-600">
                    Save ₹390 per year!
                  </Badge>
                )}
              </CardHeader>

              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.id === 'free' ? (
                  <Button disabled className="w-full">
                    Current Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleUpgrade(plan)}
                    disabled={loading === plan.id}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {loading === plan.id ? 'Processing...' : 'Upgrade Now'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">🔒 What you get with Premium:</h3>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>• 🎮 Exclusive Scratch Love Game</div>
            <div>• 🍻 Truth or Drink Game</div>
            <div>• 📸 Unlimited photo sharing</div>
            <div>• 🎨 Premium themes & customization</div>
            <div>• 🎯 Advanced relationship games</div>
            <div>• 💝 Priority customer support</div>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Cancel anytime. No hidden fees. 30-day money-back guarantee.
        </p>
      </DialogContent>

      {/* Payment Gateway */}
      {selectedPlan && (
        <PaymentGateway
          open={showPayment}
          onOpenChange={setShowPayment}
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </Dialog>
  );
};