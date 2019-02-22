import { VERSION } from './version';

export const environment = {
    production: 'false',
    version: VERSION.version + '-' + 'development',
    appDefaultRoute: 'home',
    apiBaseUrl: 'api',
    googleAnalyticsID: '',
    recaptchaSiteKey: '',
    appName: 'MEANcore',
    appBaseUrl: '/',
    imageUploadUrl: '/admin/upload',
    twitterHandle: '',
    disqusShortname: 'meancore'
};
