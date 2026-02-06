# 💳 Payment Integration Guide - LoveBond App

## 🎯 Payment Gateway Options

### For Web App (Vercel):
**Recommended: Razorpay**
- Easy integration
- All Indian payment methods (UPI, Cards, Wallets, NetBanking)
- 2% transaction fee
- Instant settlements

### For Play Store App:
**Required: Google Play Billing**
- Mandatory for in-app purchases
- 15% commission (first $1M)
- 30% commission (after $1M)
- Automatic subscription management

---

## 📱 Option 1: Razorpay (Web + Android)

### Step 1: Create Razorpay Account
1. Go to https://razorpay.com
2. Sign up with business details
3. Complete KYC verification
4. Get API keys from Dashboard

### Step 2: Get API Keys
```
Dashboard > Settings > API Keys
- Key ID: rzp_test_xxxxx (for testing)
- Key Secret: xxxxx (keep secret!)
```

### Step 3: Add to Environment Variables
```env
# .env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
VITE_RAZORPAY_KEY_SECRET=your_secret_key_here

# .env.production
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
VITE_RAZORPAY_KEY_SECRET=your_live_secret_key
```

### Step 4: Install Razorpay SDK
```bash
npm install razorpay
```

### Step 5: Implementation (Already in your app!)
Your app already has payment gateway UI in:
- `src/components/PaymentGateway.tsx`
- `src/components/SubscriptionModal.tsx`

Just need to add real Razorpay integration!

---

## 🔧 Implementation Code

### Frontend Integration (React)

```typescript
// src/lib/razorpay.ts
export const initiateRazorpayPayment = async (
  amount: number,
  planName: string,
  userEmail: string,
  userName: string
) => {
  // Load Razorpay script
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  document.body.appendChild(script);

  await new Promise((resolve) => {
    script.onload = resolve;
  });

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: amount * 100, // Convert to paise
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
    handler: function (response: any) {
      // Payment successful
      console.log('Payment ID:', response.razorpay_payment_id);
      console.log('Order ID:', response.razorpay_order_id);
      console.log('Signature:', response.razorpay_signature);
      
      // Update subscription in Firestore
      return response;
    },
    modal: {
      ondismiss: function () {
        console.log('Payment cancelled');
      },
    },
  };

  const razorpay = new (window as any).Razorpay(options);
  razorpay.open();
};
```

### Backend Verification (Firebase Functions)

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Razorpay from 'razorpay';
import crypto from 'crypto';

admin.initializeApp();

const razorpay = new Razorpay({
  key_id: functions.config().razorpay.key_id,
  key_secret: functions.config().razorpay.key_secret,
});

export const verifyPayment = functions.https.onCall(async (data, context) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
  
  // Verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', functions.config().razorpay.key_secret)
    .update(body.toString())
    .digest('hex');
  
  if (expectedSignature === razorpay_signature) {
    // Payment verified - Update user subscription
    const userId = context.auth?.uid;
    if (!userId) throw new Error('Not authenticated');
    
    await admin.firestore().collection('subscriptions').doc(userId).set({
      plan: 'premium',
      status: 'active',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      startDate: admin.firestore.FieldValue.serverTimestamp(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });
    
    return { success: true };
  } else {
    throw new Error('Invalid signature');
  }
});
```

---

## 📱 Option 2: Google Play Billing (Play Store)

### Step 1: Setup in Google Play Console
1. Go to Play Console > Your App > Monetization
2. Create subscription products
3. Set pricing (₹199/month)
4. Configure billing period

### Step 2: Install Google Play Billing
```bash
npm install @capacitor-community/in-app-purchases
```

### Step 3: Implementation
```typescript
// src/lib/playBilling.ts
import { InAppPurchase2 } from '@capacitor-community/in-app-purchases';

export const initializePlayBilling = async () => {
  await InAppPurchase2.initialize();
  
  // Register products
  InAppPurchase2.register({
    id: 'premium_monthly',
    type: 'subscription',
  });
  
  // Listen for updates
  InAppPurchase2.addListener('purchaseUpdated', (purchase) => {
    if (purchase.state === 'approved') {
      // Update Firestore
      updateSubscription(purchase);
    }
  });
};

export const purchasePremium = async () => {
  await InAppPurchase2.order('premium_monthly');
};
```

---

## 💰 Pricing Comparison

| Gateway | Transaction Fee | Setup Fee | Settlement Time |
|---------|----------------|-----------|-----------------|
| **Razorpay** | 2% | Free | T+2 days |
| **Paytm** | 2-3% | Free | T+3 days |
| **Stripe** | 2.9% + ₹2 | Free | T+7 days |
| **Play Billing** | 15-30% | Free | Monthly |

---

## 🎯 Recommended Setup

### For Your LoveBond App:

**Phase 1: Web Launch (Vercel)**
- Use **Razorpay** for web payments
- Quick setup, low fees
- All Indian payment methods

**Phase 2: Play Store Launch**
- Use **Google Play Billing** (mandatory)
- Higher fees but required by Google
- Automatic subscription management

**Best Practice:**
- Offer web subscription at ₹199/month (via Razorpay)
- Offer Play Store subscription at ₹249/month (to cover 30% fee)
- Users save money by subscribing on web!

---

## 🔐 Security Checklist

- [ ] Never expose API secrets in frontend
- [ ] Always verify payments on backend
- [ ] Use HTTPS for all transactions
- [ ] Store payment IDs in Firestore
- [ ] Implement webhook for payment updates
- [ ] Add retry logic for failed payments
- [ ] Log all transactions
- [ ] Comply with PCI DSS standards

---

## 📝 Required Documents for Razorpay

1. **Business Details**
   - Business name
   - Business type (Proprietorship/Partnership/Company)
   - Business address

2. **KYC Documents**
   - PAN Card
   - Aadhaar Card
   - Bank account details
   - Cancelled cheque

3. **Website/App Details**
   - Live website URL
   - App store link (if available)
   - Business description

---

## 🚀 Quick Start Steps

### 1. Create Razorpay Account
```
1. Visit https://razorpay.com
2. Sign up
3. Complete KYC
4. Get API keys
```

### 2. Add Keys to Your App
```bash
# Add to .env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

### 3. Test Payment
```
Use test cards:
Card: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

### 4. Go Live
```
1. Complete KYC verification
2. Switch to live keys
3. Update .env.production
4. Deploy to Vercel
```

---

## 💡 Pro Tips

1. **Start with Test Mode**
   - Use test API keys first
   - Test all payment flows
   - Check error handling

2. **Add Webhooks**
   - Get real-time payment updates
   - Handle subscription renewals
   - Manage failed payments

3. **User Experience**
   - Show clear pricing
   - Multiple payment options
   - Easy cancellation process
   - Email receipts

4. **Compliance**
   - Display refund policy
   - Show terms clearly
   - Secure payment data
   - Follow RBI guidelines

---

## 📞 Support

**Razorpay Support:**
- Email: support@razorpay.com
- Phone: 1800-102-0555
- Docs: https://razorpay.com/docs

**Google Play Billing:**
- Docs: https://developer.android.com/google/play/billing

---

## ✅ Next Steps

1. [ ] Create Razorpay account
2. [ ] Get API keys
3. [ ] Add keys to .env
4. [ ] Test payment flow
5. [ ] Complete KYC
6. [ ] Go live with real keys
7. [ ] Set up webhooks
8. [ ] Monitor transactions

---

**Ready to accept payments! 💰🚀**
