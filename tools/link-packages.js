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
  let npmCmd = args.place === 'install' ? 'npm install' : 'npm uninstall';
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
      console.log(chalk.red(err));
      return 1;
    }

    return 0;
  });
};

// Install the package in the current package.json
const execNpmCommand = (npmCmd, cb) => {
  let msg = args.place === 'install' ? 'Installing...' : 'Uninstalling...';
  console.log(chalk.green(msg, args.package + ' ' + SAVE_FLG));
  const child = cp.exec(npmCmd, (err) => {
    if (err) {
      return cb(err);
    }
  });
  child.stderr.on('data', (data) => {
    console.log(chalk.bold.yellow(data));
  });
  child.stdout.on('data', (data) => {
    console.log(chalk.cyan(data));
  });
  child.on('close', () => {
    msg = args.place === 'install' ? 'Installed...' : 'Uninstalled...';
    console.log(chalk.green(msg, args.package + ' ' + SAVE_FLG));
    cb();
  });
};

const backupPkg = async (cb) => {
  const basePkgPath = args.mod === '%npm_config_mod%' ? bundleConfig.CORE_PKG : `./modules/${args.mod}/mod.package.json`;
  console.log('basePkgPath', basePkgPath);

  const output = join(process.cwd(), basePkgPath);
  let version;

  if (args.place === 'install') {
    bundleConfig.readFilePromise(join(process.cwd(), './package.json')).then((pkgStr) => {
      let pkgData;
      try {
        pkgData = JSON.parse(pkgStr);
      } catch {
        pkgData = {};
      }

      version = pkgData[DEPENDENCY_TYPE][args.package];
    }).catch((err) => {
      return cb(err);
    });
  }

  bundleConfig.readFilePromise(output).then(async (pkgStr) => {
    let pkgData;
    try {
      pkgData = JSON.parse(pkgStr);
    } catch {
      pkgData = {};
    }

    if (args.place === 'install') {
      pkgData[DEPENDENCY_TYPE][args.package] = version;

      const sorted = {};
      Object.keys(pkgData[DEPENDENCY_TYPE]).sort().forEach((key) => {
        sorted[key] = pkgData[DEPENDENCY_TYPE][key];
      });

      const dupeKeys = (l, r) => r;
      pkgData[DEPENDENCY_TYPE] = _.mergeWith(sorted, pkgData[DEPENDENCY_TYPE], dupeKeys);
    } else {
      delete pkgData[DEPENDENCY_TYPE][args.package]
    }

    await bundleConfig.writeFilePromise(output, bundleConfig.stringify(pkgData), 'utf-8').then(() => {
      console.log(chalk.cyan(`mods package.json file backed up successfully at ${output} \n`));
      return cb();
    }).catch((err) => {
      return cb(err);
    });
  }).catch((err) => {
    return cb(err);
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
  } else if (args.depType === 'dependencies' || args.depType === '%npm_config_dep_type%') {
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
