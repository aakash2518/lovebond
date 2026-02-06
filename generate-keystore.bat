@echo off
echo ========================================
echo LoveBond - Keystore Generation
echo ========================================
echo.
echo IMPORTANT: This will create your app signing key
echo Keep this file SAFE - you'll need it for ALL future updates!
echo.
echo You will be asked for:
echo - Keystore password (remember this!)
echo - Key password (can be same as keystore password)
echo - Your name
echo - Organization name (can be your name)
echo - City
echo - State
echo - Country code (IN for India)
echo.
pause

echo.
echo Generating keystore...
echo.

keytool -genkey -v -keystore lovebond-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias lovebond

echo.
echo ========================================
echo Keystore Generated Successfully!
echo ========================================
echo.
echo File created: lovebond-release-key.jks
echo.
echo CRITICAL REMINDERS:
echo 1. BACKUP this file to multiple safe locations
echo 2. NEVER share this file or password with anyone
echo 3. If you lose this, you can NEVER update your app on Play Store
echo 4. Store password in a password manager
echo.
echo Next Steps:
echo 1. Move lovebond-release-key.jks to android/app/ folder
echo 2. Update android/app/build.gradle with signing config
echo 3. See PLAYSTORE_SUBMISSION_GUIDE.md for details
echo.
pause
