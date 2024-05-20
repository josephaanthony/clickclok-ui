import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'clickclock-ui',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    hostname: "io.clickclok.ui",
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '277006726082-fp7gnbsf2pv4pcih78kjf9on9sdss8fp.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  }
};

export default config;
