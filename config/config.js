/**
 * Module dependencies.
 */
import _ from 'lodash';
import chalk from 'chalk';
import glob from 'glob';
import fse from 'fs-extra';
import {
  resolve,
  join
} from 'path';

// Get the default assets
import * as defaultAssets from './assets/default.js';
// Get the current assets
import * as environmentAssets from './assets/index.js';
// Get the default config
import * as defaultConfig from './env/default.js';
// Get the current config
import * as environmentConfig from './env/index.js';

/**
 * Get files by glob patterns
 */
function getGlobbedPaths(globPatterns, excludes) {
  // URL paths regex
  let urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');

  // The output array
  let output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map(function (file) {
          if (_.isArray(excludes)) {
            Object.keys(excludes).forEach(function (i) {
              file = file.replace(excludes[i], '');
            });
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
}

/**
 * Validate NODE_ENV existence
 */
function validateEnvironment() {
  let environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
  console.log();
  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red('+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead'));
    } else {
      console.error(chalk.red('+ Error: NODE_ENV is not defined! Using default development environment'));
    }
    process.env.NODE_ENV = 'development';
  }
  // Reset console color
  console.log(chalk.white(''));
}

/**
 * Validate Secure=true parameter can actually be turned on
 * because it requires certs and key files to be available
 */
function validateSecureMode(config) {

  if (!config.secure || !config.secure.ssl) {
    return true;
  }

  let privateKey = fse.existsSync(resolve(config.secure.privateKey));
  let certificate = fse.existsSync(resolve(config.secure.certificate));

  if (!privateKey || !certificate) {
    console.log(chalk.red('+ Error: Certificate file or key file is missing, falling back to non-SSL mode'));
    console.log(chalk.red('  To create them, simply run the following from your shell: sh ./tools/generate-ssl-certs.sh'));
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

  if (config.sessionSecret === 'MEANcore') {
    if (!testing) {
      console.log(chalk.red('+ WARNING: It is strongly recommended that you change sessionSecret config while running in production!'));
      console.log(chalk.red('  Please add `sessionSecret: process.env.SESSION_SECRET || \'super amazing secret\'` to '));
      console.log(chalk.red('  `config/env/production.js` or `config/env/local.js`'));
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

  // Setting Globbed submodules base path
  config.submodules = [];
  const modulePath = getGlobbedPaths(assets.submodules.basePath);
  modulePath.forEach((path) => {
    config.submodules.push({
      basePath: path,
      appConfig: path + '/env/default.js'
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
  let assets = _.merge(Object.assign({}, defaultAssets), Object.assign({}, environmentAssets[process.env.NODE_ENV]));

  // Merge config files
  let config = _.merge(Object.assign({}, defaultConfig), Object.assign({}, environmentConfig[process.env.NODE_ENV]));

  // Extend the config object with the local-NODE_ENV.js custom/local environment. This will override any settings present in the local configuration.
  const localConfig = join(process.cwd(), 'config/env/local-' + process.env.NODE_ENV + '.js');
  if (fse.existsSync(localConfig)) {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    config = _.merge(config, import(localConfig));
  }

  // Initialize global globbed files
  initGlobalConfigFiles(config, assets);

  // Validate Secure SSL mode can be used
  validateSecureMode(config);

  // Validate session secret
  validateSessionSecret(config);

  // Print a warning if config.domain is not set
  // validateDomainIsSet(config);

  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths: getGlobbedPaths,
    validateSessionSecret: validateSessionSecret
  };

  return config;
}

/**
 * Set configuration object
 */
export default initGlobalConfig();
