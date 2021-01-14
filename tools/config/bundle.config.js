import {
  join,
  dirname
} from 'path';
import url from 'url';
import _ from 'lodash';
import fse from 'fs-extra';
import util from 'util';

import config from '../../config/config.js';

/*
 * Configuration for bundling modules
 */

export class BundleConfig {

  constructor() {
    /*
     * The root folder of the project (up two levels from the current directory).
     */
    this.__dirname = dirname(url.fileURLToPath(
      import.meta.url));
    this.PROJECT_ROOT = join(this.__dirname, '../..');

    this.APP_NAME = 'meancore';

    /*
     * The path to the coverage output
     * NB: this must match what is configured in ./karma.conf.js
     */
    this.COVERAGE_DIR = 'coverage/meancore';

    /*
     *  All the modules for which build needs to run
     */
    this.ALL_MODULES = [];

    /*
     *  Module's directory
     */
    this.MODULE_DIR = join(this.PROJECT_ROOT, 'modules');

    /*
     *  Common core directory
     */
    this.CORE_SRC = join(this.PROJECT_ROOT, 'modules/core');

    this.CORE_CLIENT_SRC = join(this.CORE_SRC, '/client');

    this.CORE_E2E_SRC = join(this.CORE_SRC, '/e2e');

    /**
     * The folder for temporary staging before running ng build.
     */
    this.TMP_DIR = 'projects';

    // Path to the bundled package.json
    this.LINK_PKG = join(this.PROJECT_ROOT, '/package.json');
    // Path to the backup of COREs specific package.json 
    this.CORE_PKG = join(this.CORE_SRC, '/core.package.json');

    this.CORE_NG_JSON = join(this.CORE_SRC, '/core.angular.template.json');
    this.MODULE_NG_JSON_NAME = 'mod.angular.template.json';

    this.NG_OUTPUT = join(this.PROJECT_ROOT, '/angular.json');

    /**
     * The default project that angular-cli will build for.
     */
    this.DEFAULT_PROJECT = "";

    // Files that will be ignored during the build process
    this.BLACK_LIST = ['tsconfig.json', 'tsconfig.app.json', 'tsconfig.spec.json', 'tslint.json', 'tsconfig.e2e.json'];

    /**
     * The list of editor temporary files to ignore in watcher and asset builder.
     */
    this.TEMP_FILES = [
      '**/*~',
    ];

    this.indentation = 2

    this.stringify = (dependencyMap) => JSON.stringify(dependencyMap, null, this.indentation);

    this.readFilePromise = util.promisify(fse.readFile);
    this.writeFilePromise = util.promisify(fse.writeFile);
  }

  async init(done) {
    this.setConfig(() => {
      done.bind(this)();
    });
  }

  // Retrive the mod specific env config 
  async setConfig(done) {
    const moduleConfigs = await config.utils.retrieveModuleConfigs(config);

    await moduleConfigs.map(async (modConfig) => {
      await this.setModules(modConfig);
    });

    done();
  }

  async setModules(modConfig) {
    const moduleDir = join(this.MODULE_DIR, modConfig.app.name);

    const module = {
      MODULE_SRC: moduleDir,
      MODULE_CLIENT_SRC: join(moduleDir, '/client'),
      MODULE_E2E_SRC: join(moduleDir, '/e2e'),
      APP_TITLE: modConfig.app.title || '',
      APP_BASE_URL: modConfig.app.appBaseUrl || '',
      API_BASE_URL: modConfig.app.apiBaseUrl || '',
      APP_NAME: modConfig.app.name || '',
      APP_LOGO: modConfig.app.logo || '',
      APP_DEFAULT_ROUTE: modConfig.app.defaultRoute || '',
      IMAGE_BASE_URL: modConfig.uploads.images.baseUrl || '',
      GOOGLE_ANALYTICS_ID: modConfig.GOOGLE_ANALYTICS_ID || '',
      RECAPTCHA_SITE_KEY: modConfig.RECAPTCHA_SITE_KEY || '',
      TWITTER_HANDLE: modConfig.TWITTER_HANDLE || '',
      META_TITLE_SUFFIX: modConfig.app.metaTitleSuffix || '',
      SCRIPT_STORE: modConfig.scriptStore || [],
      OWASP_CONFIG: modConfig.owaspConfig || {},
      TMP_DIR: join(this.PROJECT_ROOT, '/' + this.TMP_DIR, modConfig.app.name),
      MODULE_NG_JSON: join(moduleDir, this.MODULE_NG_JSON_NAME),
      LINK_MOD_PKG: join(moduleDir, '/mod.package.json'),
      MOD_PKG: join(moduleDir, '/package.json'),
      BLACK_LIST: modConfig.coreBlackList || []
    };

    this.ALL_MODULES.push(module);
  }

  /**
   * Recursively merge source onto target.
   * @param target The target object (to receive values from source)
   * @param source The source object (to be merged onto target)
   */
  async mergeObject(target, source) {
    _.extend(target, source);
  }
}
