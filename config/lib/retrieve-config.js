import _ from 'lodash';
import {
  join
} from 'path';
import url from 'url';
import fs from 'fs';

export const retrieveModuleConfigs = async (config) => {
  let moduleConfigs = [];
  await Promise.all(config.submodules.map(async (module) => {
    const originalConfig = _.cloneDeep(config);
    const appConfigPath = url.pathToFileURL(module.appDefaultConfig).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let appConfig = await import(appConfigPath);
    const newConfig = _.mergeWith({}, originalConfig, appConfig, (objValue, srcValue) => {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    });

    const moduleEnvConfigPath = url.pathToFileURL(join(process.cwd(), module.basePath + '/config/env', process.env.NODE_ENV + '.js')).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const moduleEnvConfig = await import(moduleEnvConfigPath);

    // Extend the config object with the local-NODE_ENV.js custom/local environment. This will override any settings present in the local configuration.
    const modLocalConfig = url.pathToFileURL(join(process.cwd(), module.basePath + 'config/env/local-' + process.env.NODE_ENV + '.js')).href;
    if (fs.existsSync(modLocalConfig)) {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      appConfig = _.merge(appConfig, import(modLocalConfig));
    }

    // Merge default core config with submodules specific config
    appConfig = _.mergeWith({}, newConfig, moduleEnvConfig, (objValue, srcValue) => {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    });

    moduleConfigs.push(appConfig);
  }));

  return moduleConfigs;
}
