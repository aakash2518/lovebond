@echo off
echo 🔨 Building LoveBond Release AAB...
echo.

echo 📦 Step 1: Building production web app...
call npm run build:production
if %errorlevel% neq 0 (
    echo ❌ Production build failed!
    pause
    exit /b 1
)

echo ✅ Production build complete!
echo.

echo 🔄 Step 2: Syncing with Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Capacitor sync failed!
    pause
    exit /b 1
)

echo ✅ Capacitor sync complete!
echo.

echo 🔨 Step 3: Building Android App Bundle...
cd android
call gradlew.bat bundleRelease
if %errorlevel% neq 0 (
    echo ❌ AAB build failed!
    echo 💡 Make sure you have configured signing in android/app/build.gradle
    pause
    exit /b 1
)

echo.
echo 🎉 Release AAB Build Complete!
echo.
echo 📍 Your release file is located at:
echo    android\app\build\outputs\bundle\release\app-release.aab
echo.
echo 📱 Next steps:
echo    1. Upload the AAB file to Google Play Console
echo    2. Complete store listing with screenshots and descriptions
echo    3. Submit for review
echo.
pause