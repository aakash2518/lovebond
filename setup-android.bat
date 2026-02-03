@echo off
echo Setting up Android development environment...

REM Check if Android Studio is installed
if exist "C:\Program Files\Android\Android Studio\bin\studio64.exe" (
    echo Android Studio found at: C:\Program Files\Android\Android Studio
    set ANDROID_STUDIO_PATH=C:\Program Files\Android\Android Studio
) else if exist "C:\Users\%USERNAME%\AppData\Local\Android\Sdk" (
    echo Android SDK found at: C:\Users\%USERNAME%\AppData\Local\Android\Sdk
    set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
) else (
    echo Android SDK not found. Please install Android Studio first.
    echo Download from: https://developer.android.com/studio
    pause
    exit /b 1
)

REM Set environment variables for current session
set ANDROID_HOME=C:\Users\%USERNAME%\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%
set PATH=%PATH%;%ANDROID_HOME%\tools;%ANDROID_HOME%\platform-tools

echo.
echo Environment variables set:
echo ANDROID_HOME=%ANDROID_HOME%
echo ANDROID_SDK_ROOT=%ANDROID_SDK_ROOT%
echo.

REM Update local.properties
echo sdk.dir=%ANDROID_HOME:\=\\% > android\local.properties
echo Created android\local.properties with SDK path

echo.
echo Setup complete! You can now run:
echo npm run android:dev
echo npm run android:release
echo.
pause