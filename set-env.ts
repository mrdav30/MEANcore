const fs = require('fs');

// Configure Angular `environment.ts` file path
const targetPath = `./client/environments/environment.ts`;

// Load node modules
const colors = require('colors');
require('dotenv').load();

// Debug environment variables

// `environment.ts` file structure that uses the environment variables
const envConfigFile = `import { VERSION } from './version';

export const environment = {
    production: '${process.env.PRODUCTION}',
    version: VERSION.version + '-' + '${process.env.NODE_ENV}',
    appDefaultRoute: '${process.env.APP_DEFAULT_ROUTE}',
    apiBaseUrl: '${process.env.API_BASE_URL}',
    googleAnalyticsID: '${process.env.GOOGLE_ANALYTICS_ID}',
    recaptchaSiteKey: '${process.env.RECAPTCHA_SITE_KEY}',
    appName: '${process.env.APP_NAME}',
    appBaseUrl: '${process.env.APP_BASE_URL}',
    imageUploadUrl: '${process.env.IMAGE_UPLOAD_URL}',
    twitterHandle: '${process.env.TWITTER_HANDLE}',
    disqusShortname: '${process.env.DISQUS_SHORT_NAME}'
};
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
