import cp from 'child_process';
import chalk from 'chalk';
import _ from 'lodash';
import {
  join
} from 'path';
import async from 'async';
import yargs from 'yargs';

import bundleConfig from './config.init.js';

const args = yargs(process.argv).argv;

let DEPENDENCY_TYPE;
let SAVE_FLG;

const initPkgLink = async () => {
 let npmCmd = args.switch === 'install' ? 'npm install' : 'npm uninstall';
 npmCmd += ' ' + args.package + ' ' + SAVE_FLG;

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
  let msg = args.switch === 'install' ? 'Installing...' : 'Uninstalling...';
  console.log(chalk.green(msg, args.package + ' ' + SAVE_FLG));

  const child = cp.exec(npmCmd, (err) => {
    if (err) {
      console.log(chalk.red(err));
      return cb(true);
    }

    msg = args.switch === 'install' ? 'Installed...' : 'Uninstalled...';
    console.log(chalk.green(msg, args.package + ' ' + SAVE_FLG));

    return cb();
  });

  child.stdout.on('data', (data) => {
    console.log(chalk.cyan(data));
  });
};

const backupPkg = async (cb) => {
  const basePkgPath = args.mod === '%npm_config_mod%' ? bundleConfig.CORE_PKG : `./modules/${args.mod}/mod.package.json`;

  let version;
  let pkg = args.package;

  // Need to check if the version number was included in the package parameter...
  // Always skip the first instance of @ to exclude pkg names (i.e. @angular)
  if(pkg.includes('@', 1)){
    pkg = args.package.substring(0, args.package.indexOf('@', 1));
    version = args.package.substring(args.package.indexOf('@', 1)).replace('@', '');
  } else if (args.switch === 'install') {
    bundleConfig.readFilePromise(join(process.cwd(), './package.json')).then((pkgStr) => {
      let pkgData;
      try {
        pkgData = JSON.parse(pkgStr);
      } catch {
        pkgData = {};
      }

      version = pkgData[DEPENDENCY_TYPE][pkg];
    }).catch((err) => {
      return cb(err);
    });
  }

  bundleConfig.readFilePromise(basePkgPath).then(async (pkgStr) => {
    let pkgData;
    try {
      pkgData = JSON.parse(pkgStr);
    } catch {
      pkgData = {};
    }

    if (args.switch === 'install') {

      // Default to compatible with version if not provided
      if(!version.includes('^') && !version.includes('~')){
        version = '^' + version;
      }

      pkgData[DEPENDENCY_TYPE][pkg] = version;

      const sorted = {};
      Object.keys(pkgData[DEPENDENCY_TYPE]).sort().forEach((key) => {
        sorted[key] = pkgData[DEPENDENCY_TYPE][key];
      });

      const dupeKeys = (l, r) => r;
      pkgData[DEPENDENCY_TYPE] = _.mergeWith(sorted, pkgData[DEPENDENCY_TYPE], dupeKeys);
    } else {
      delete pkgData[DEPENDENCY_TYPE][pkg]
    }

    await bundleConfig.writeFilePromise(basePkgPath, bundleConfig.stringify(pkgData), 'utf-8').then(() => {
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
  if (args.package === '%npm_config_pkg%') {
    console.log(chalk.red('You need to pass a package name!'));
    return 1;
  }

  if (args.depType === 'dev' || args.depType === 'devDependencies') {
    DEPENDENCY_TYPE = 'devDependencies';
    SAVE_FLG = '--save-dev';
  } else if (args.depType === 'dependencies' || args.depType === 'dep' || args.depType === '%npm_config_type%') {
    DEPENDENCY_TYPE = 'dependencies';
    SAVE_FLG = '--save';
  } else {
    console.log(chalk.red('Invalid dependency type!...', args.depType));
    return 1;
  }

  if (args.mod !== '%npm_config_mod%' && !bundleConfig.ALL_MODULES.some(e => e.APP_NAME === args.mod)) {
    console.log(chalk.red('Module does not exist!'))
    return 1;
  }

  initPkgLink();
});
