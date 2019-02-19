import { VERSION } from './version';

// Define menu config as:
// MENU_CONFIG { menus: [{ label: string; route: string; permission: string[]; visible: boolean; }]; }

export const environment = {
  production: true,
  version: VERSION.version,
  appLogo: 'assets/images/logo.png',
  appDefaultRoute: 'home',
  appName: 'MEANcore',
  appBase: '/',
  appEndPoint: 'api',
  MENU_CONFIG: [],
  googleAnalyticsID: 'UA-XXXX-Y',
  recaptchaSiteKey: '',
  owasp: {
    allowPassphrases: true,
    maxLength: 128,
    minLength: 10,
    minPhraseLength: 20,
    minOptionalTestsToPass: 4
  },
  showLoginNav: true,
  showSearchNav: true,
  imageUploadApi: '',
  siteSearchRoute: '/',
  twitterHandle: ''
};
