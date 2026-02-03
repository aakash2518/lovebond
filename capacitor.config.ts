import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovebond.coupleapp',
  appName: 'LoveBond',
  webDir: 'dist',
  server: {
    cleartext: false, // HTTPS only for production
    allowNavigation: [
      'https://*.supabase.co',
      'https://*.firebase.com',
      'https://*.googleapis.com'
    ]
  },
  android: {
    allowMixedContent: false, // Security: No mixed content
    webContentsDebuggingEnabled: false, // Disable in production
    minWebViewVersion: 60, // Minimum WebView version
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      keystorePassword: undefined,
      releaseType: 'AAB', // Android App Bundle for Play Store
      signingType: 'apksigner'
    }
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0a0a1a",
      showSpinner: false,
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      iosSpinnerStyle: "small",
      spinnerColor: "#ffffff",
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: "dark",
      backgroundColor: "#0a0a1a"
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true
    },
    // Privacy and permissions
    Permissions: {
      camera: "This app needs camera access to take photos for your profile",
      location: "This app needs location access to share your location with your partner",
      notifications: "This app sends notifications to keep you connected with your partner"
    }
  }
};

export default config;
