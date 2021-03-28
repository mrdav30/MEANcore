import {
  join,
  relative
} from 'path';
import fs from 'fs';
import watch from 'node-watch';
import chalk from 'chalk';

import {
  changeFileManager
} from './code-change-tools.js';

import {
  copyFileSync
} from './copy-recursive.js';

import bundleConfig from '../config.init.js';

async function copyToTmp(filename) {
  const coreRelative = relative(bundleConfig.CORE_CLIENT_SRC, filename);
  // if file in module then first chart should not be . // for outside of module paths, path starts with ../../
  if (coreRelative.charAt(0) !== '.') {
    // if core change copy to all bundled modules that utilize this file
    return bundleConfig.ALL_MODULES.forEach((mod) => {
      const dest = join(mod.TMP_DIR, '/client/', coreRelative);

      if (fs.existsSync(dest)) {
        console.log(chalk.green('==================================='));
        console.log(chalk.green('Bundling Core change for: ' + mod.APP_NAME));
        console.log(chalk.green('    + ' + filename));
        console.log(chalk.green('==================================='));

        copyFileSync(filename, dest);
      } else {
        console.log(chalk.cyan('Skipping for: ' + mod.APP_NAME));
      }
    });
  } else {
    // if mod change copy to bundled module from source
    return bundleConfig.ALL_MODULES.some((mod) => {
      let modRelative = relative(mod.MODULE_CLIENT_SRC, filename);

      if (modRelative.charAt(0) !== '.') {

        const dest = join(mod.TMP_DIR, '/client/', modRelative);
        console.log(chalk.green('==================================='));
        console.log(chalk.green('Bundling Mod change for: ' + mod.APP_NAME));
        console.log(chalk.green('    + ' + filename));
        console.log(chalk.green('==================================='));

        copyFileSync(filename, dest);
        return true;
      }

      return false;
    });
  }
}

/**
 * Watches directories to push changes to staging for ng build.
 */
export function watchTask() {
  // gather all client directories to watch by default 
  let paths = [
    bundleConfig.CORE_CLIENT_SRC
  ];

  if (bundleConfig.ALL_MODULES) {
    bundleConfig.ALL_MODULES.forEach((mod) => {
      paths = paths.concat(mod.MODULE_CLIENT_SRC);
    })
  }

  let timer;

  paths.map((path) => {
    if (fs.existsSync(path)) {
      watch(path, {
        recursive: true
      }, (event, filename) => {
        if (!filename) {
          console.log(chalk.red('filename not provided for client watcher!'))
          return;
        }

        changeFileManager.addFile(filename);

        // Resolves issue in IntelliJ and other IDEs/text editors which
        // save multiple files at once.
        // https://github.com/mgechev/angular-seed/issues/1615 for more details.
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(async () => {
          for (const file of changeFileManager.lastChangedFiles) {
            await copyToTmp(file);
          }

          changeFileManager.clear();
        }, 100);
      })
    }
  });
}

bundleConfig.init(() => {
  watchTask();
});
