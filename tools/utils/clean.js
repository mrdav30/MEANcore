import {
  relative,
  normalize
} from 'path';
import fs from 'fs';
import chalk from 'chalk';

import bundleConfig from '../config.init.js';

/**
 * Cleans the given path(s) using `remove`.
 * @param paths - The path or list of paths to clean.
 */
export async function cleanPaths(paths) {
  let pathsToClean = [];
  if (paths instanceof Array) {
    pathsToClean = paths;
  } else {
    pathsToClean = [paths];
  }

  const promises = pathsToClean.map(p => {
    return new Promise((resolve, reject) => {
      const relativePath = relative(bundleConfig.PROJECT_ROOT, p);
      if (relativePath.startsWith('..')) {
        console.log(chalk.red(`Cannot remove files outside the project root but tried "${normalize(p)}"`));
        reject();
      } else {
        fs.remove(p, (e) => {
          if (e) {
            console.log(chalk.red('Clean task failed with: ', e));
          } else {
            console.log(chalk.yellowBright('Removed - ', p));
          }

          resolve();
        });
      }
    });
  });

  await Promise.all(promises)
    .catch(e => console.log(chalk.red(`Error while removing files "${[].concat(paths).join(', ')}", ${e}`)));
}
