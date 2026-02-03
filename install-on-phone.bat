@echo off
echo 📱 LoveBond App - Phone Installation Guide
echo ==========================================
echo.

echo Step 1: Building the app...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Syncing with Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Sync failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Building APK...
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo ❌ APK build failed!
    pause
    exit /b 1
)

echo.
echo ✅ APK created successfully!
echo 📍 Location: android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 📱 Phone mein install karne ke liye:
echo 1. APK file ko phone mein copy kariye
echo 2. Phone mein "Unknown Sources" allow kariye
echo 3. APK file tap karke install kariye
echo.
pause