import {
  relative,
  normalize
} from 'path';
import fse from 'fs-extra';
import chalk from 'chalk';

import projectConfig from '../config.init.js';

/**
 * Cleans the given path(s) using `remove`.
 * @param paths - The path or list of paths to clean.
 */
export async function clean(paths) {
  let pathsToClean = [];
  if (paths instanceof Array) {
    pathsToClean = paths;
  } else {
    pathsToClean = [paths];
  }

  const promises = pathsToClean.map(p => {
    return new Promise((resolve, reject) => {
      const relativePath = relative(projectConfig.PROJECT_ROOT, p);
      if (relativePath.startsWith('..')) {
        console.log(chalk.red(`Cannot remove files outside the project root but tried "${normalize(p)}"`));
        reject();
      } else {
        fse.remove(p, (e) => {
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
