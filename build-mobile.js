#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building LoveBond for Mobile...\n');

// Check if Capacitor is initialized
if (!fs.existsSync('android') && !fs.existsSync('ios')) {
  console.log('📱 Initializing Capacitor platforms...');
  try {
    execSync('npx cap add android', { stdio: 'inherit' });
    console.log('✅ Android platform added');
  } catch (error) {
    console.log('⚠️  Android platform already exists or failed to add');
  }
  
  try {
    execSync('npx cap add ios', { stdio: 'inherit' });
    console.log('✅ iOS platform added');
  } catch (error) {
    console.log('⚠️  iOS platform already exists or failed to add');
  }
}

// Install mobile dependencies
console.log('\n📦 Installing mobile dependencies...');
try {
  execSync('npm install @capacitor/keyboard @capacitor/status-bar @capacitor/splash-screen @capacitor/haptics @capacitor/device @capacitor/network @capacitor/geolocation @capacitor/camera', { stdio: 'inherit' });
  console.log('✅ Mobile dependencies installed');
} catch (error) {
  console.log('⚠️  Some dependencies may already be installed');
}

// Build the web app
console.log('\n🔨 Building web app for production...');
execSync('npm run build:production', { stdio: 'inherit' });

// Sync with Capacitor
console.log('\n🔄 Syncing with Capacitor...');
execSync('npx cap sync', { stdio: 'inherit' });

console.log('\n✅ Mobile build complete!');
console.log('\n📱 Next steps:');
console.log('  • For Android: npm run android:build');
console.log('  • For iOS: npm run ios:build');
console.log('  • For development: npm run mobile:serve');