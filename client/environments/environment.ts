// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { VERSION } from './version';

// Define menu config as:
// MENU_CONFIG { menus: [{ label: string; route: string; permission: string[]; visible: boolean; }]; }

export const environment = {
  production: false,
  version: VERSION.version + '-dev',
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
