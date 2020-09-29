import {
  join,
  dirname,
  basename,
  resolve
} from 'path';
import url from 'url';
import glob from 'glob';
import _ from 'lodash';

/*
 * Configuration for bundling modules
 */

export class ProjectConfig {


  constructor() {
    /*
     * The root folder of the project (up two levels from the current directory).
     */
    this.__dirname = dirname(url.fileURLToPath(
      import.meta.url));
    this.PROJECT_ROOT = join(this.__dirname, '../..');

    /*
     * The path to the coverage output
     * NB: this must match what is configured in ./karma.conf.js
     */
    this.COVERAGE_DIR = 'coverage/meancore';

    /*
     * The path for the base of the application at runtime.
     * The default path is based on the environment '/',
     */
    this.APP_BASE = '/';


    this.APP_DEFAULT_ROUTE = '/home';

    this.APP_TAG_NAME = 'core';

    /*
     * Name of the Application which name of the directory under dist.
     */
    this.APP_NAME = 'MEANCore';

    /*
     *  All the modules for which build needs to run
     */
    this.ALL_MODULES = [];

    /*
     *  Module's directory
     */
    this.MODULE_SRC = 'modules';

    /*
     *  Common core directory
     */
    this.CORE_SRC = 'modules/core';

    this.CORE_CLIENT_SRC = join(this.CORE_SRC, '/client');

    this.CORE_E2E_SRC = join(this.CORE_SRC, '/e2e');

    /**
     * The folder for temporary staging before running ng build.
     */
    this.TMP_DIR = 'projects';

    this.BOOTSTRAP_CORE = join(this.TMP_DIR, '/client/app/app.module.ts');

    this.CORE_PKG = './base.package.json';

    this.BASE_NG_JSON = join(this.PROJECT_ROOT, '/tools/templates/base.angular.json');

    this.CHILD_NG_JSON = join(this.PROJECT_ROOT, '/tools/templates/child.angular.json');

    this.NG_OUTPUT = join(this.PROJECT_ROOT, '/angular.json');

    /**
     * The default project that angular-cli will build for.
     */
    this.DEFAULT_PROJECT = "";
  }

  init(done) {
    this.setModules(() => {
      done.bind(this)();
    });
  }

  async setModules(done) {
    // glob all non core modules
    const clientDirs = glob.sync(`${this.MODULE_SRC}/*`, {
      ignore: '**/core'
    });

    await Promise.all(clientDirs.map(async (dir) => {
      const modConfigPath = url.pathToFileURL(resolve(join(dir, 'config.js'))).href;
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      const modConfig = await import(modConfigPath);
      const moduleDirName = basename(dir);
      const module = {
        MODULE_SRC: dir,
        MODULE_CLIENT_SRC: dir + '/client',
        MODULE_E2E_SRC: dir + '/e2e',
        APP_TITLE: modConfig.APP_TITLE,
        APP_BASE: modConfig.APP_BASE || this.APP_BASE,
        APP_TAG_NAME: moduleDirName,
        APP_NAME: modConfig.APP_NAME,
        APP_DEFAULT_ROUTE: modConfig.APP_DEFAULT_ROUTE || this.APP_DEFAULT_ROUTE,
        TMP_DIR: join(this.PROJECT_ROOT, '/' + this.TMP_DIR, '/' + moduleDirName),
        BOOSTRAP_MODULE: dir + '/client/base.module.ts',
        CHILD_PKG: this.MODULE_SRC + '/' + moduleDirName + '/child.package.json'
      };

      this.ALL_MODULES.push(module);
    }));

    // await this.setModulePaths();
    done();
  }

  // async setModulePaths() {
  //   await Promise.all(this.ALL_MODULES.map(async (mod) => {
  //     await this.mergeObject(this, mod);
  //   }));
  // }

  /**
   * Recursively merge source onto target.
   * @param target The target object (to receive values from source)
   * @param source The source object (to be merged onto target)
   */
  async mergeObject(target, source) {
    _.extend(target, source);
  }
}
