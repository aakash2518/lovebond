@echo off
echo ========================================
echo LoveBond - Play Store Setup Script
echo ========================================
echo.

echo Step 1: Installing Capacitor for Android...
call npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/camera @capacitor/device @capacitor/geolocation @capacitor/haptics @capacitor/keyboard @capacitor/network @capacitor/splash-screen @capacitor/status-bar

echo.
echo Step 2: Adding Android platform...
call npx cap add android

echo.
echo Step 3: Building production web assets...
call npm run build:production

echo.
echo Step 4: Syncing with Android...
call npx cap sync android

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Generate signing key (see PLAYSTORE_SUBMISSION_GUIDE.md)
echo 2. Configure signing in android/app/build.gradle
echo 3. Open Android Studio: npx cap open android
echo 4. Build signed AAB: Build ^> Generate Signed Bundle/APK
echo 5. Upload to Play Console
echo.
echo For detailed instructions, read: PLAYSTORE_SUBMISSION_GUIDE.md
echo.
pause
