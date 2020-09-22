// Configure Angular `environment.ts` file path
import fse from 'fs-extra';
import chalk from 'chalk';
import 'dotenv/config.js';

fse.readFile('./package.json', (err, jsonStr) => {
  if (!err) {
    const data = JSON.parse(jsonStr);

    const targetPath = `./modules/core/client/environments/environment.ts`;
    // `environment.ts` file structure that uses the environment variables
    const envConfigFile = `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!

export const environment = {
    production: '${process.env.PRODUCTION}',
    version:  '${data.version}-${process.env.NODE_ENV}',
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
`;

    console.log(chalk.cyan('The file `environment.ts` will be written with the following content: \n'));
    console.log(chalk.grey(envConfigFile));

    fse.writeFile(targetPath, envConfigFile, (err) => {
      if (err) {
        throw console.error(err);
      } else {
        console.log(chalk.cyan(`Angular environment.ts file generated correctly at ${targetPath} \n`));
      }
    });
  } else {
    console.log(chalk.red('Unable to read package.json to set environment!'));
    throw console.error(err);
  }
});
