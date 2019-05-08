const fs = require('fs');

// Configure Angular `environment.ts` file path
const targetPath = `./client/environments/environment.ts`;

// Load node modules
const colors = require('colors');
require('dotenv').config();

// Debug environment variables

// `environment.ts` file structure that uses the environment variables
const envConfigFile = `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
import { VERSION } from './version';

export const environment = {
    production: '${process.env.PRODUCTION}',
    version: VERSION.version + '-' + '${process.env.NODE_ENV}',
    appName: '${process.env.APP_NAME}',
    appLogo: '${process.env.APP_LOGO}',
    appDefaultRoute: '${process.env.APP_DEFAULT_ROUTE}',
    appBaseUrl: '${process.env.APP_BASE_URL}',
    apiBaseUrl: '${process.env.API_BASE_URL}',
    imageBaseUrl: '${process.env.IMAGE_BASE_URL}',
    googleAnalyticsID: '${process.env.GOOGLE_ANALYTICS_ID}',
    recaptchaSiteKey: '${process.env.RECAPTCHA_SITE_KEY}',
    twitterHandle: '${process.env.TWITTER_HANDLE}',
    metaTitleSuffix: '${process.env.META_TITLE_SUFFIX}'
};
/* tslint:enable */
`;

console.log(colors.magenta('The file `environment.ts` will be written with the following content: \n'));
console.log(colors.grey(envConfigFile));

fs.writeFile(targetPath, envConfigFile, (err) => {
    if (err) {
        throw console.error(err);
    } else {
        console.log(colors.magenta(`Angular environment.ts file generated correctly at ${targetPath} \n`));
    }
});
