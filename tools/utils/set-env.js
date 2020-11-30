// Configure Angular `environment.ts` file path
import fse from 'fs-extra';
import {
  join
} from 'path';
import chalk from 'chalk';

export const createAngularEnv = async (modConfig) => {
  const pkgData = fse.readFileSync(modConfig.DEFAULT_PKG);
  const data = JSON.parse(pkgData);

  const coreDevEnvPath = join(modConfig.CORE_SRC, '/client/environments/environment.ts');
  const targetPath = join(modConfig.TMP_DIR, '/client/environments/environment.ts');

  // `environment.ts` file structure that uses the environment variables
  const envConfigFile = `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!

  export const environment = {
      production: '${process.env.PRODUCTION}',
      version:  '${data.version}-${process.env.NODE_ENV}',
      appName: '${modConfig.APP_NAME}',
      appLogo: '${modConfig.APP_LOGO}',
      appDefaultRoute: '${modConfig.APP_DEFAULT_ROUTE}',
      appBaseUrl: '${modConfig.APP_BASE_URL}',
      apiBaseUrl: '${modConfig.API_BASE_URL}',
      imageBaseUrl: '${modConfig.IMAGE_BASE_URL}',
      googleAnalyticsID: '${process.env.GOOGLE_ANALYTICS_ID}',
      recaptchaSiteKey: '${process.env.RECAPTCHA_SITE_KEY}',
      twitterHandle: '${modConfig.TWITTER_HANDLE}',
      metaTitleSuffix: '${modConfig.META_TITLE_SUFFIX}'
};
`;

  console.log(chalk.cyan('The file `environment.ts` will be written with the following content: \n'));
  console.log(chalk.grey(envConfigFile));

  let writePromises = [
    modConfig.writeFilePromise(targetPath, envConfigFile, 'utf-8')
  ]

  if (!process.env.PRODUCTION) {
    writePromises.push(modConfig.writeFilePromise(coreDevEnvPath, envConfigFile, 'utf-8'))
  }

  return Promise.all(writePromises).then(() => {
    console.log(chalk.cyan(`Angular environment.ts file generated successfully at ${targetPath} \n`));
    if (!process.env.PRODUCTION) {
      console.log(chalk.cyan(`and for devevelopment IDEs at  ${coreDevEnvPath} \n`));
    }
  }).catch((err) => {
    console.error(err);
  });
}
