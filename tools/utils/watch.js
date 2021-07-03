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
  copyFile
} from './copy-recursive.js';

import bundleConfig from '../config.init.js';

function checkDestination(filename) {
  const coreRelative = relative(bundleConfig.CORE_CLIENT_SRC, filename);
  return new Promise(async (resolve) => {
    // if file in module then first chart should not be . // for outside of module paths, path starts with ../../
    if (coreRelative.charAt(0) !== '.') {
      // if core change copy to all bundled modules that utilize this file
      for await (const mod of bundleConfig.ALL_MODULES) {
        const dest = join(mod.TMP_DIR, '/client/', coreRelative);

        await copyToTemp(dest, filename, mod.APP_NAME);
      }

      resolve();
    } else {
      // if mod change copy to bundled module from source
      bundleConfig.ALL_MODULES.some(async (mod) => {
        const modRelative = relative(mod.MODULE_CLIENT_SRC, filename);

        if (modRelative.charAt(0) !== '.') {
          const dest = join(mod.TMP_DIR, '/client/', modRelative);

          await copyToTemp(dest, filename, mod.APP_NAME)
          return;
        }
      });

      resolve();
    }
  });
}

function copyToTemp(dest, filename, modName) {
  new Promise(async (resolve) => {
    try {
      if (bundleConfig.BLACK_LIST.indexOf(filename) > -1) {
        console.log(chalk.cyan('Skipping, file is black-listed in config: ' + filename));
        return resolve();
      }

      await fs.promises.access(dest);

      console.log(chalk.green('==================================='));
      console.log(chalk.green('Bundling change for: ' + modName));
      console.log(chalk.green('    + ' + filename));
      console.log(chalk.green('==================================='));

      await copyFile(filename, dest);

      return resolve();
    } catch {
      console.log(chalk.cyan('Skipping, file does not exist for: ' + modName));
      console.log(chalk.cyan('Consider rebundling if this is a new file or copy/paste'));

      return resolve();
    }
  })
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

  paths.map(async (path) => {
    try {
      // test if path exists
      await fs.promises.access(path);

      watch(path, {
        recursive: true
      }, async (event, filename) => {
        if (!filename) {
          console.log(chalk.red('filename not provided for client watcher!'))
          return;
        }

        if (!(await fs.promises.lstat(filename)).isDirectory() && event === 'update') {
          changeFileManager.addFile(filename);
        }

        // Resolves issue in IntelliJ and other IDEs/text editors which
        // save multiple files at once.
        // https://github.com/mgechev/angular-seed/issues/1615 for more details.
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(async () => {
          for (const file of changeFileManager.lastChangedFiles) {
            await checkDestination(file);
          }

          changeFileManager.clear();
        }, 100);
      })
    } catch {
      return;
    }
  });
}

bundleConfig.init(() => {
  watchTask();
});
