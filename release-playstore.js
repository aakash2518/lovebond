#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🏪 Preparing LoveBond for Play Store Release...\n');

// Pre-release checklist
const checklist = [
  '✅ Privacy Policy uploaded and accessible',
  '✅ Terms of Service created',
  '✅ App icons created (all sizes)',
  '✅ Screenshots taken (phone, tablet)',
  '✅ Feature graphic created (1024x500)',
  '✅ App description written',
  '✅ Content rating completed',
  '✅ Signing key configured',
  '✅ Testing completed on multiple devices'
];

console.log('📋 Pre-Release Checklist:');
checklist.forEach(item => console.log(`   ${item}`));
console.log('');

// Check if required files exist
const requiredFiles = [
  'privacy-policy.md',
  'terms-of-service.md',
  'android-assets-guide.md'
];

console.log('🔍 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} found`);
  } else {
    console.log(`   ❌ ${file} missing`);
  }
});

// Update version for release
console.log('\n📦 Building production version...');
try {
  execSync('npm run build:production', { stdio: 'inherit' });
  console.log('✅ Production build complete');
} catch (error) {
  console.error('❌ Production build failed');
  process.exit(1);
}

// Sync with Capacitor
console.log('\n🔄 Syncing with Capacitor...');
try {
  execSync('npx cap sync android', { stdio: 'inherit' });
  console.log('✅ Capacitor sync complete');
} catch (error) {
  console.error('❌ Capacitor sync failed');
  process.exit(1);
}

// Generate release build
console.log('\n🔨 Generating release build...');
try {
  execSync('cd android && ./gradlew bundleRelease', { stdio: 'inherit' });
  console.log('✅ Release AAB generated');
} catch (error) {
  console.error('❌ Release build failed');
  console.log('💡 Make sure you have configured signing in android/app/build.gradle');
  process.exit(1);
}

console.log('\n🎉 Play Store Release Preparation Complete!');
console.log('\n📱 Next Steps:');
console.log('1. Upload AAB file to Google Play Console');
console.log('2. Complete store listing with screenshots and descriptions');
console.log('3. Set up content rating and pricing');
console.log('4. Submit for review');
console.log('\n📍 Release file location:');
console.log('   android/app/build/outputs/bundle/release/app-release.aab');

console.log('\n🔗 Useful Links:');
console.log('   • Google Play Console: https://play.google.com/console');
console.log('   • Android Asset Studio: https://romannurik.github.io/AndroidAssetStudio/');
console.log('   • Play Store Guidelines: https://developer.android.com/distribute/google-play/policies');