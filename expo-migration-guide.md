# 🔄 Expo Migration Guide for LoveBond

## Current Status
- **Current Tech:** React + Vite + Capacitor
- **Target Tech:** React Native + Expo
- **Effort:** Major refactoring required

## Migration Steps

### 1. Create New Expo Project
```bash
npx create-expo-app LoveBondExpo --template
cd LoveBondExpo
```

### 2. Install Dependencies
```bash
# Core dependencies
expo install expo-camera expo-location expo-notifications
expo install expo-av expo-file-system expo-image-picker
expo install @react-navigation/native @react-navigation/bottom-tabs
expo install react-native-screens react-native-safe-area-context

# Firebase
npm install firebase @react-native-firebase/app @react-native-firebase/auth
npm install @react-native-firebase/firestore @react-native-firebase/storage

# UI & State Management
npm install @tanstack/react-query react-hook-form
npm install react-native-paper react-native-vector-icons
```

### 3. Code Migration Required

#### Components to Migrate:
- ✅ React components (minimal changes)
- ⚠️ Capacitor plugins → Expo modules
- ⚠️ Web-specific code → React Native
- ⚠️ CSS → StyleSheet/NativeWind
- ⚠️ HTML elements → React Native components

#### Key Changes:
```javascript
// Before (Web/Capacitor)
import { Camera } from '@capacitor/camera';
<div className="container">
  <img src={photo} />
</div>

// After (Expo)
import * as ImagePicker from 'expo-image-picker';
import { View, Image } from 'react-native';
<View style={styles.container}>
  <Image source={{ uri: photo }} />
</View>
```

### 4. Feature Mapping

| Current (Capacitor) | Expo Equivalent |
|-------------------|-----------------|
| @capacitor/camera | expo-camera, expo-image-picker |
| @capacitor/geolocation | expo-location |
| @capacitor/haptics | expo-haptics |
| @capacitor/status-bar | expo-status-bar |
| @capacitor/splash-screen | expo-splash-screen |
| HTML/CSS | React Native components |
| Vite | Metro bundler |

### 5. Estimated Timeline
- **Setup:** 1-2 days
- **Component Migration:** 1-2 weeks
- **Testing & Debugging:** 1 week
- **Total:** 2-3 weeks

## Alternative: Expo Development Build

Instead of full migration, use Expo Development Build:

```bash
# Install Expo CLI
npm install -g @expo/cli

# Create development build
expo install expo-dev-client
expo run:android
```

This allows custom native code while using Expo tools.

## Recommendation

**For immediate testing:** Use Android Studio emulator
**For long-term:** Consider Expo migration for better development experience