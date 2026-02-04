# 💕 LoveBond - Couple Connection App

A beautiful relationship app designed to strengthen bonds between couples through real-time communication, location sharing, and interactive features.

## ✨ Features

- 💬 **Real-time Messaging** - Stay connected with your partner instantly
- 🤗 **Send Hugs** - Express love with virtual hugs and haptic feedback
- 📍 **Location Sharing** - Share your location safely with your partner
- 🎮 **Interactive Games** - Play scratch love games together
- 📸 **Photo Sharing** - Share memories with your loved one
- 🔔 **Push Notifications** - Never miss a message from your partner
- 📱 **Mobile App** - Available as PWA and native Android app

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Mobile**: Capacitor (iOS/Android)
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Additional**: Supabase for extended features
- **Animations**: Framer Motion
- **State Management**: TanStack Query

## 📱 Deployment Status

✅ **PRODUCTION READY** - App is fully tested and ready for deployment!

### Web Deployment
```bash
# Build for production
npm run build:production

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify/Firebase
```

### Mobile Deployment
```bash
# Android App Bundle for Play Store
npm run android:release

# iOS build
npm run ios:build
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or bun
- Android Studio (for mobile development)
- Xcode (for iOS development)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/lovebond-app.git
cd lovebond-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Firebase credentials (and Supabase if you use those features)

# Start development server
npm run dev
```

### Mobile Development

```bash
# Build and run on Android
npm run android:dev

# Build and run on iOS
npm run ios:dev

# Sync mobile assets
npm run mobile:sync
```

## 🔧 Configuration

### Environment Variables
Create `.env` file with:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

### Firebase Setup
1. Create Firebase project
2. Enable Authentication, Firestore, Storage
3. Configure security rules
4. Add your config to `.env`

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build:production` - Build for production
- `npm run typecheck` - TypeScript type-check (no emit)
- `npm run android:release` - Build Android release
- `npm run ios:build` - Build iOS app
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🎯 Features in Detail

### Real-time Communication
- Instant messaging with Firebase Firestore
- Online/offline status tracking
- Message delivery confirmations

### Location Features
- Safe location sharing between partners
- Privacy-focused with consent-based sharing
- Real-time location updates

### Interactive Elements
- Haptic feedback for hugs
- Scratch-off love games
- Photo sharing with compression
- Push notifications

### Security & Privacy
- End-to-end secure communication
- Privacy policy and terms of service included
- Secure authentication with Firebase Auth
- Data encryption and secure storage

## 📱 Mobile App Features

- Native Android app with Capacitor
- PWA support for iOS
- Offline functionality
- Native device features (camera, location, haptics)
- App store ready with proper icons and metadata

## 🚀 Deployment Guide

The app includes comprehensive deployment documentation:
- `DEPLOYMENT_CHECKLIST.md` - Complete deployment guide
- `PHONE_INSTALLATION_GUIDE.md` - Mobile installation steps
- Ready-to-use build scripts
- App store assets and metadata

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 Made with Love

Built with ❤️ for couples who want to stay connected and strengthen their relationships through technology.

---

**Ready to deploy and make couples happy! 🚀💕**
