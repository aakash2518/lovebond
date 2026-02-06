// Razorpay Payment Integration for LoveBond

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id?: string;
  prefill: {
    name: string;
    email: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Load Razorpay script dynamically
 */
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Initiate Razorpay payment
 */
export const initiateRazorpayPayment = async (
  amount: number,
  planName: string,
  userEmail: string,
  userName: string,
  onSuccess: (paymentId: string) => void,
  onFailure: (error: string) => void
): Promise<void> => {
  try {
    // Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error('Failed to load Razorpay SDK');
    }

    // Get Razorpay key from environment
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      throw new Error('Razorpay key not configured');
    }

    const options: RazorpayOptions = {
      key: razorpayKey,
      amount: amount * 100, // Convert to paise (₹199 = 19900 paise)
      currency: 'INR',
      name: 'LoveBond',
      description: `${planName} Subscription`,
      image: '/logo.svg',
      prefill: {
        name: userName,
        email: userEmail,
      },
      theme: {
        color: '#E91E63',
      },
      handler: function (response: RazorpayResponse) {
        // Payment successful
        console.log('Payment successful:', response);
        onSuccess(response.razorpay_payment_id);
      },
      modal: {
        ondismiss: function () {
          console.log('Payment cancelled by user');
          onFailure('Payment cancelled');
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('Razorpay payment error:', error);
    onFailure(error instanceof Error ? error.message : 'Payment failed');
  }
};

/**
 * Test payment with Razorpay test mode
 * Use these test cards:
 * - Card: 4111 1111 1111 1111
 * - CVV: Any 3 digits
 * - Expiry: Any future date
 */
export const testRazorpayPayment = async (
  onSuccess: (paymentId: string) => void,
  onFailure: (error: string) => void
): Promise<void> => {
  await initiateRazorpayPayment(
    1, // ₹1 for testing
    'Test Plan',
    'test@example.com',
    'Test User',
    onSuccess,
    onFailure
  );
};

/**
 * Verify payment signature (should be done on backend)
 * This is just for reference - actual verification must happen on server
 */
export const verifyPaymentSignature = async (
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> => {
  // This should be done on your backend/Firebase Functions
  // Never expose your Razorpay secret key in frontend!
  
  console.warn('Payment verification should be done on backend');
  
  // Call your backend API to verify
  // Example:
  // const response = await fetch('/api/verify-payment', {
  //   method: 'POST',
  //   body: JSON.stringify({ orderId, paymentId, signature })
  // });
  // return response.ok;
  
  return true; // Placeholder
};
