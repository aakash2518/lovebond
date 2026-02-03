#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🚀 Deployment Readiness Check\n');

const checks = [
  {
    name: 'Environment Variables',
    check: () => {
      const envProd = fs.existsSync('.env.production');
      const envFile = fs.existsSync('.env');
      return envProd || envFile;
    }
  },
  {
    name: 'Build Configuration',
    check: () => {
      const viteConfig = fs.existsSync('vite.config.ts');
      const vercelConfig = fs.existsSync('vercel.json');
      return viteConfig && vercelConfig;
    }
  },
  {
    name: 'Package Dependencies',
    check: () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return packageJson.dependencies && Object.keys(packageJson.dependencies).length > 0;
    }
  },
  {
    name: 'TypeScript Configuration',
    check: () => {
      return fs.existsSync('tsconfig.json');
    }
  },
  {
    name: 'Firebase Configuration',
    check: () => {
      return fs.existsSync('src/lib/firebase.ts');
    }
  },
  {
    name: 'Capacitor Configuration',
    check: () => {
      return fs.existsSync('capacitor.config.ts');
    }
  },
  {
    name: 'Android Build Files',
    check: () => {
      return fs.existsSync('android/app/build.gradle');
    }
  },
  {
    name: 'Subscription System',
    check: () => {
      return fs.existsSync('src/hooks/useSubscription.ts') && 
             fs.existsSync('src/lib/subscription/plans.ts');
    }
  },
  {
    name: 'Error Handling',
    check: () => {
      return fs.existsSync('src/components/ErrorBoundary.tsx');
    }
  },
  {
    name: 'Build Output',
    check: () => {
      return fs.existsSync('dist/index.html');
    }
  }
];

let passed = 0;
let total = checks.length;

checks.forEach(({ name, check }) => {
  const result = check();
  console.log(`${result ? '✅' : '❌'} ${name}`);
  if (result) passed++;
});

console.log(`\n📊 Score: ${passed}/${total} checks passed`);

if (passed === total) {
  console.log('🎉 Your app is 100% ready for deployment!');
  console.log('🚀 You can deploy to Vercel, Netlify, or any hosting platform.');
} else if (passed >= total * 0.8) {
  console.log('⚠️ Your app is mostly ready, but has some minor issues.');
  console.log('🔧 Fix the failing checks for optimal deployment.');
} else {
  console.log('❌ Your app needs more work before deployment.');
  console.log('🔧 Please fix the failing checks first.');
}

console.log('\n📝 Deployment Commands:');
console.log('Web: npm run build:production');
console.log('Android: npm run android:release');
console.log('Vercel: vercel --prod');