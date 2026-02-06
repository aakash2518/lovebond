import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { initiateRazorpayPayment } from '@/lib/razorpay';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import type { SubscriptionPlan } from '@/lib/subscription/plans';

interface PaymentGatewayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: SubscriptionPlan;
  onSuccess: (paymentId: string) => void;
}

export const PaymentGateway = ({ open, onOpenChange, plan, onSuccess }: PaymentGatewayProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useFirebaseAuth();

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to continue');
      return;
    }

    setLoading(true);
    
    try {
      await initiateRazorpayPayment(
        plan.price,
        plan.name,
        user.email || 'user@lovebond.app',
        user.displayName || 'LoveBond User',
        (paymentId) => {
          toast.success('Payment successful! 🎉');
          onSuccess(paymentId);
          onOpenChange(false);
        },
        (error) => {
          toast.error(`Payment failed: ${error}`);
          setLoading(false);
        }
      );
    } catch (error) {
      toast.error('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Payment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Plan Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span>Amount:</span>
                <span className="text-2xl font-bold">₹{plan.price}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Billed {plan.interval}ly
              </p>
            </CardContent>
          </Card>

          {/* Razorpay Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                Secure Payment via Razorpay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You'll be redirected to Razorpay's secure payment gateway to complete your purchase.
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>✓ All major cards accepted (Visa, Mastercard, RuPay)</p>
                <p>✓ UPI, Net Banking, Wallets supported</p>
                <p>✓ 100% secure and encrypted</p>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <Lock className="h-4 w-4" />
            <span>Your payment information is encrypted and secure</span>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            size="lg"
          >
            {loading ? 'Opening Razorpay...' : `Pay ₹${plan.price}`}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By completing this purchase, you agree to our Terms of Service and Privacy Policy.
            Cancel anytime from your profile settings.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};