import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.clikclok.ui',
  appName: 'clikclock-ui',
  webDir: 'dist',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      androidClientId: '277006726082-fp7gnbsf2pv4pcih78kjf9on9sdss8fp.apps.googleusercontent.com',
      serverClientId: '277006726082-fp7gnbsf2pv4pcih78kjf9on9sdss8fp.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  }
};

export default config;
