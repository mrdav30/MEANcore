/**
 * Module dependencies.
 */

import fs from 'fs';
import url from 'url';
import {
  resolve,
  join,
} from 'path';

import {
  getGlobbedPaths
} from '../tools/utils/glob-paths.js';

import * as objectHelpers from '../tools/utils/object-helpers.js';

// Get the default assets
import * as defaultAssets from './assets/default.js';
// Get the current assets
import * as environmentAssets from './assets/index.js';
// Get the default config
import * as defaultConfig from './env/default.js';
// Get the current config
import * as environmentConfig from './env/index.js';

let config = {};

/**
 * Validate NODE_ENV existence
 */
function validateEnvironment() {
  if (!fs.existsSync('./config/env/' + process.env.NODE_ENV + '.js')) {
    if (process.env.NODE_ENV) {
      console.error('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead');
    } else {
      console.error('+ Error: NODE_ENV is not defined! Using default development environment');
    }
    process.env.NODE_ENV = 'development';
  }
}

/**
 * Validate Secure=true parameter can actually be turned on
 * because it requires certs and key files to be available
 */
function validateSecureMode(config) {

  if (!config.secure || !config.secure.ssl) {
    return true;
  }

  let privateKey = fs.existsSync(resolve(config.secure.privateKey));
  let certificate = fs.existsSync(resolve(config.secure.certificate));

  if (!privateKey || !certificate) {
    console.error('+ Error: Certificate file or key file is missing, falling back to non-SSL mode');
    console.error('  To create them, simply run the following from your shell: sh ./tools/generate-ssl-certs.sh');
    console.log();
    config.secure.ssl = false;
  }
}

/**
 * Validate Session Secret parameter is not set to default in production
 */
function validateSessionSecret(config, testing) {

  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  if (config.sessionSecret === 'MEANcore' || config.sessionSecret === '') {
    if (!testing) {
      console.error('+ WARNING: It is strongly recommended that you change sessionSecret config while running in production!');
      console.error('  Please add `sessionSecret: process.env.SESSION_SECRET || \'super amazing secret\'` to ');
      console.error('  `config/env/production.js` or `config/env/local.js`');
      console.log();
    }
    return false;
  } else {
    return true;
  }
}

/**
 * Initialize global configuration files
 */
function initGlobalConfigFiles(config, assets) {
  // Appending files
  config.files = {};

  // Setting Globbed route files
  config.files.routes = getGlobbedPaths(assets.server.routes);

  // Setting Globbed config files
  config.files.configs = getGlobbedPaths(assets.server.config);

  // Setting Globbed mongo db models
  config.files.models = getGlobbedPaths(assets.server.models)

  // Setting Globbed socket files
  config.files.sockets = getGlobbedPaths(assets.server.sockets);

  // Setting Globbed policies files
  config.files.policies = getGlobbedPaths(assets.server.policies);

  // Setting Globbed services files
  config.files.services = getGlobbedPaths(assets.server.services);

  // Setting Globbed helpers files
  config.files.helpers = getGlobbedPaths(assets.server.helpers);

  // Setting Globbed shared modules files
  config.files.sharedModules = getGlobbedPaths(assets.server.sharedModules);

  config.files.views = getGlobbedPaths(assets.server.views);

  // Setting Globbed submodules base path
  config.submodules = [];
  const modulePath = getGlobbedPaths(assets.submodules.basePath);

  modulePath.forEach((path) => {
    config.submodules.push({
      basePath: path,
      appDefaultConfig: join(path, '/config/env/default.js')
    });
  })
}

/**
 * Initialize global configuration
 */
function initGlobalConfig() {
  // Validate NODE_ENV existence
  validateEnvironment();

  // Merge assets
  let assets = objectHelpers.merge(null, Object.assign({}, defaultAssets), Object.assign({}, environmentAssets[process.env.NODE_ENV]));

  // Merge config files
  config = objectHelpers.merge(null, Object.assign({}, defaultConfig), Object.assign({}, environmentConfig[process.env.NODE_ENV]));

  let rootPath = process.env.npm_config_core_prj_root ? process.env.npm_config_core_prj_root : process.cwd();
  // Extend the config object with the local-NODE_ENV.js custom/local environment. This will override any settings present in the local configuration.
  const localConfig = join(rootPath, 'config/env/local-' + process.env.NODE_ENV + '.js');
  if (fs.existsSync(localConfig)) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    config = objectHelpers.merge(null, config, import(localConfig));
  }

  // Initialize global globbed files
  initGlobalConfigFiles(config, assets);

  // Validate Secure SSL mode can be used
  validateSecureMode(config);

  // Validate session secret
  validateSessionSecret(config);

  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths: getGlobbedPaths,
    validateSessionSecret: validateSessionSecret,
    retrieveModuleConfigs: retrieveModuleConfigs
  };

  return config;
}

const retrieveModuleConfigs = async () => {
  let moduleConfigs = [];

  await Promise.all(config.submodules.map(async (module) => {
    const originalConfig = objectHelpers.merge(null, {}, config);
    let rootPath = process.env.npm_config_core_prj_root ? process.env.npm_config_core_prj_root : process.cwd();

    const appConfigPath = url.pathToFileURL(join(rootPath, module.appDefaultConfig)).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let appConfig = await import(appConfigPath);
    const newConfig = objectHelpers.merge((objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
      } else {
        return srcValue;
      }
    }, originalConfig, appConfig);



    const moduleEnvConfigPath = url.pathToFileURL(join(rootPath, module.basePath + '/config/env', process.env.NODE_ENV + '.js')).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const moduleEnvConfig = await import(moduleEnvConfigPath);

    // Extend the config object with the local-NODE_ENV.js custom/local environment. This will override any settings present in the local configuration.
    const modLocalConfig = url.pathToFileURL(join(rootPath, module.basePath + 'config/env/local-' + process.env.NODE_ENV + '.js')).href;
    if (fs.existsSync(modLocalConfig)) {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      appConfig = objectHelpers.merge(null, appConfig, import(modLocalConfig));
    }

    // Merge default core config with submodules specific config
    appConfig = objectHelpers.merge((objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
      } else {
        return srcValue;
      }
    }, newConfig, moduleEnvConfig);

    moduleConfigs.push(appConfig);
  }));

  return moduleConfigs;
}

/**
 * Set configuration object
 */
export default initGlobalConfig();
