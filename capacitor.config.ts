import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.gg.customer.app',
  appName: 'Get Glow Home Spa',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 2000,
      backgroundColor: "#ffffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    }, 
    // server: {
    //   androidScheme: 'https' // Ensure it’s https for compatibility
    // }  
    server: {
      androidScheme: 'https',
      iosScheme: 'https',
      customUrlScheme: 'getglowcustomer', // Add this line for custom URL scheme
    },
  },
};

export default config;
