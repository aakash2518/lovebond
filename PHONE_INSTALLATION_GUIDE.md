# 📱 LoveBond App - Phone Installation Guide

## Method 1: Android Studio se Direct Install (Recommended)

### Prerequisites:
1. **Android Studio** installed hona chahiye
2. **USB Cable** phone ke liye
3. **Developer Options** phone mein enable

### Steps:

#### 1. Phone Setup:
```
Settings → About Phone → Build Number (7 baar tap kariye)
Settings → Developer Options → USB Debugging ✅
```

#### 2. Android Studio mein:
1. Android Studio open kariye
2. Project import kariye: `android` folder
3. Phone USB se connect kariye
4. Green **Play button (▶️)** click kariye
5. Device list mein apna phone select kariye
6. App automatically install ho jayega!

---

## Method 2: APK File banayiye

### Terminal/Command Prompt mein:

```bash
# 1. Build the web app
npm run build

# 2. Sync with Android
npx cap sync android

# 3. Android folder mein jaiye
cd android

# 4. APK build kariye (Windows)
gradlew.bat assembleDebug

# 5. APK build kariye (Mac/Linux)
./gradlew assembleDebug
```

### APK Location:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Phone mein Install:
1. **APK file** phone mein copy kariye
2. **Settings → Security → Unknown Sources** allow kariye
3. **File Manager** se APK tap kariye
4. **Install** button press kariye

---

## Method 3: Development Server (Testing ke liye)

```bash
# Development server start kariye
npm run dev

# Browser mein open kariye
http://localhost:5173

# Phone browser mein open kariye (same WiFi network)
http://YOUR_COMPUTER_IP:5173
```

---

## 🔧 Troubleshooting

### Common Issues:

1. **"Developer Options not visible"**
   - Settings → About Phone → Build Number (7+ times tap)

2. **"Device not detected"**
   - USB Debugging enable kariye
   - USB cable change kariye
   - Different USB port try kariye

3. **"Build failed"**
   - Java/Android SDK properly installed check kariye
   - Android Studio latest version use kariye

4. **"App crashes on phone"**
   - Firebase config check kariye (.env files)
   - Internet connection check kariye

---

## 📋 App Features Test Kariye:

### After Installation:
1. **Account create** kariye
2. **Partner ke saath connect** kariye (couple code)
3. **Send Hug** feature test kariye
4. **Location sharing** test kariye
5. **Games** try kariye (Truth or Drink, Scratch Love)
6. **Daily photos** upload kariye

---

## 🚀 Production Build (Play Store ke liye):

```bash
# Release build
npm run build:release

# Signed APK
cd android
gradlew.bat assembleRelease
```

**Note:** Release build ke liye signing key chahiye hoga.

---

## 💡 Tips:

- **Two phones** use kariye testing ke liye
- **Same WiFi network** mein rakhiye dono phones
- **Notifications allow** kariye app install ke baad
- **Camera/Location permissions** allow kariye
- **Battery optimization disable** kariye app ke liye

---

## 🆘 Help:

Agar koi problem aaye to:
1. Android Studio logs check kariye
2. Browser console check kariye (F12)
3. Firebase console check kariye
4. Internet connection verify kariye

**Happy Coding! 💕**