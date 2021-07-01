import cp from 'child_process';
import chalk from 'chalk';
import _ from 'lodash';
import fs from 'fs';
import {
  join
} from 'path';
import async from 'async';

import bundleConfig from './config.init.js';

let FLAG;
let PKG;
let DEPENDENCY_TYPE;
let TARGET_MOD;

//let DEPENDENCY_TYPE;
let SAVE_FLG;

const initPkgLink = async () => {
 let npmCmd = FLAG === 'install' ? 'npm install' : 'npm uninstall';
 npmCmd += ' ' + PKG + ' ' + SAVE_FLG;

  async.series([
    (callback) => {
      execNpmCommand(npmCmd, callback);
    },
    (callback) => {
      backupPkg(callback);
    }
  ], (err) => {
    if (err) {
      return 1;
    }

    return 0;
  });
};

//Install the package in the current package.json
const execNpmCommand = (npmCmd, cb) => {
  let msg = FLAG === 'install' ? 'Installing...' : 'Uninstalling...';
  console.log(chalk.green(msg, PKG + ' ' + SAVE_FLG));

  const child = cp.exec(npmCmd, (err) => {
    if (err) {
      console.log(chalk.red(err));
      return cb(true);
    }

    msg = FLAG === 'install' ? 'Installed...' : 'Uninstalled...';
    console.log(chalk.green(msg, PKG + ' ' + SAVE_FLG));

    return cb();
  });

  child.stdout.on('data', (data) => {
    console.log(chalk.cyan(data));
  });
};

const backupPkg = async (cb) => {
  const basePkgPath = TARGET_MOD == null ? bundleConfig.CORE_PKG_BKP : `./modules/${TARGET_MOD}/mod.package.json`;

  let version;
  let strippedPackage = PKG;

  // Need to check if the version number was included in the package parameter...
  // Always skip the first instance of @ to exclude pkg names (i.e. @angular)
  if(PKG.includes('@', 1)){
    if(PKG.includes('/@')){
      //Need to check if the package name contains an additional instance of @
      const test2 = PKG.indexOf('@', PKG.indexOf('/@') + 2);
      if(test2 > -1){
        strippedPackage = PKG.substring(0, PKG.indexOf('@', test2));
        console.log("version ", version);
      }else{
        strippedPackage = PKG;
        version = null;
      }
    }else{
      strippedPackage = PKG.substring(0, PKG.indexOf('@', 1));
      version = PKG.substring(PKG.indexOf('@', 1)).replace('@', '');
    }
  } else if (FLAG === 'install') {
    fs.promises.readFile(join(process.cwd(), './package.json')).then((pkgStr) => {
      let pkgData;
      try {
        pkgData = JSON.parse(pkgStr);
      } catch {
        pkgData = {};
      }

      version = pkgData[DEPENDENCY_TYPE][strippedPackage];
    }).catch((err) => {
      return cb(err);
    });
  }

  fs.promises.readFile(basePkgPath).then(async (pkgStr) => {
    let pkgData;
    try {
      pkgData = JSON.parse(pkgStr);
    } catch {
      pkgData = {};
    }

    if (FLAG === 'install') {

      // Default to compatible with version if not provided
      if(version && !version.includes('^') && !version.includes('~')){
        version = '^' + version;
      }

      pkgData[DEPENDENCY_TYPE][strippedPackage] = version;

      const sorted = {};
      Object.keys(pkgData[DEPENDENCY_TYPE]).sort().forEach((key) => {
        sorted[key] = pkgData[DEPENDENCY_TYPE][key];
      });

      const dupeKeys = (l, r) => r;
      pkgData[DEPENDENCY_TYPE] = _.mergeWith(sorted, pkgData[DEPENDENCY_TYPE], dupeKeys);
    } else {
      delete pkgData[DEPENDENCY_TYPE][strippedPackage];
    }

    await fs.promises.writeFile(basePkgPath, bundleConfig.stringify(pkgData), 'utf-8').then(() => {
      console.log(chalk.cyan(`package.json file backed up successfully at ${basePkgPath} \n`));
      return cb();
    }).catch((err) => {
      console.log(chalk.red(err));
      return cb(true);
    });
  }).catch((err) => {
    console.log(chalk.red(err));
    return cb(true);
  });
};

bundleConfig.init(() => {

  FLAG = process.argv[3];
  PKG = process.env.npm_config_pkg ? process.env.npm_config_pkg : null;
  DEPENDENCY_TYPE = process.env.npm_config_type ? process.env.npm_config_type : null;
  TARGET_MOD = process.env.npm_config_mod ? process.env.npm_config_mod : null;
   
  if (PKG == null) {
    console.log(chalk.red('You need to pass a package name! ex: --pkg=lodash'));
    return 1;
  }

  if (DEPENDENCY_TYPE === 'dev' || DEPENDENCY_TYPE === 'devDependencies') {
    DEPENDENCY_TYPE = 'devDependencies';
    SAVE_FLG = '--save-dev';
  } else if (DEPENDENCY_TYPE === 'dependencies' || DEPENDENCY_TYPE === 'dep' || DEPENDENCY_TYPE === null) {
    DEPENDENCY_TYPE = 'dependencies';
    SAVE_FLG = '--save';
  } else {
    console.log(chalk.red('Invalid dependency type!...', DEPENDENCY_TYPE));
    console.log(chalk.red('Valid options include dev, devDependencies, dep, dependencies'));
    return 1;
  }

  if (TARGET_MOD !== null && !bundleConfig.ALL_MODULES.some(e => e.APP_NAME === TARGET_MOD)) {
    console.log(chalk.red('Module does not exist!', TARGET_MOD))
    return 1;
  }

  initPkgLink();
});
