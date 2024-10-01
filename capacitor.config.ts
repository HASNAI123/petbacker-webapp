import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.petbacker.com',
  appName: 'app.petbacker.com',
  "webDir": "dist/spa",  // Ensure this points to your build directory
  "bundledWebRuntime": false
};

export default config;
