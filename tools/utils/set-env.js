// Configure Angular `environment.ts` file path
import fs from 'fs';
import util from 'util';
import {
  join
} from 'path';
import chalk from 'chalk';

export const createAngularEnv = async (modConfig) => {
  const pkgData = fs.readFileSync(modConfig.LINK_CORE_PKG);
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
      googleAnalyticsID: '${modConfig.GOOGLE_ANALYTICS_ID}',
      recaptchaSiteKey: '${modConfig.RECAPTCHA_SITE_KEY}',
      twitterHandle: '${modConfig.TWITTER_HANDLE}',
      metaTitleSuffix: '${modConfig.META_TITLE_SUFFIX}',
      scriptStore: ` + util.inspect(modConfig.SCRIPT_STORE) + `,
      owaspConfig: ` + util.inspect(modConfig.OWASP_CONFIG) + `
};
`;

  console.log(chalk.cyan('The file `environment.ts` will be written with the following content: \n'));
  console.log(chalk.grey(envConfigFile));

  let writePromises = [
    fs.promises.writeFile(targetPath, envConfigFile, 'utf-8')
  ]

  if (!process.env.PRODUCTION) {
    writePromises.push(fs.promises.writeFile(coreDevEnvPath, envConfigFile, 'utf-8'))
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
