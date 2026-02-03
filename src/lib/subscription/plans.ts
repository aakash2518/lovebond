export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'INR',
    interval: 'month',
    features: [
      'Basic messaging',
      'Send hugs',
      'Location sharing',
      'Basic profile',
      '5 photos per day'
    ]
  },
  {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    price: 199,
    currency: 'INR',
    interval: 'month',
    popular: true,
    features: [
      'All Free features',
      '🎮 Scratch Love Game',
      '🍻 Truth or Drink Game',
      'Unlimited photos',
      'Premium themes',
      'Advanced games',
      'Priority support'
    ]
  },
  {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    price: 1999,
    currency: 'INR',
    interval: 'year',
    features: [
      'All Premium features',
      '2 months FREE',
      'Exclusive couple challenges',
      'Anniversary reminders',
      'Custom themes',
      'Early access to new features'
    ]
  }
];

export const PREMIUM_FEATURES = {
  SCRATCH_LOVE_GAME: 'scratch_love_game',
  TRUTH_OR_DRINK: 'truth_or_drink',
  UNLIMITED_PHOTOS: 'unlimited_photos',
  PREMIUM_THEMES: 'premium_themes',
  ADVANCED_GAMES: 'advanced_games'
} as const;

export type PremiumFeature = typeof PREMIUM_FEATURES[keyof typeof PREMIUM_FEATURES];