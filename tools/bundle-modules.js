import {
  join,
  basename
} from 'path';
import fse from 'fs-extra';
import _ from 'lodash';
import async from 'async';
import chalk from 'chalk';

import {
  clean
} from './utils/clean.js';

import config from './config.js';

import 'dotenv/config.js';

const blackList = ['tsconfig.json', 'tsconfig.app.json', 'tslint.json'];

const bundleModules = async (done) => {
  async.series([
    async () => {
        await cleanOnce();
      },
      async () => {
          console.log(chalk.green('Copying Core'));
          await copyCore();
        },
        async () => {
          await Promise.all(config.ALL_MODULES.map(async (mod) => {

            await config.mergeObject(config, mod);

            console.log(chalk.green('==================================='));
            console.log(chalk.green('Bundling: ' + config.APP_NAME));
            console.log(chalk.green('==================================='));

            await copyModule(config);
          }));
        }
  ], (err) => {
    if (err) {
      console.log(err);
    }

    done();
  })
};

// Clean dev/coverage that will only run once
// this prevents karma watchers from being broken when directories are deleted
let firstRun = true;
const cleanOnce = async () => {
  if (firstRun) {
    firstRun = false;
    await cleanAll();
  } else {
    console.log('Skipping clean on rebuild');
    return;
  }
}

const cleanAll = async () => {
  await clean([config.TMP_DIR, config.COVERAGE_DIR]);
}

const copyCore = async () => {
  // copy client directory
  await copyFolderRecursiveSync(join(config.CORE_SRC, 'client'), join(config.PROJECT_ROOT, config.TMP_DIR));
  // copy e2e directory
  await copyFolderRecursiveSync(join(config.CORE_SRC, 'e2e'), join(config.PROJECT_ROOT, config.TMP_DIR));
}

const copyModule = async () => {
  // copy client directory
  await copyFolderRecursiveSync(join(config.MODULE_SRC, 'client'), join(config.PROJECT_ROOT, config.TMP_DIR), blackList);
  // copy e2e directory
  await copyFolderRecursiveSync(join(config.MODULE_SRC, 'e2e'), join(config.PROJECT_ROOT, config.TMP_DIR));
}

async function copyFileSync(source, target) {

  var targetFile = target;

  //if target is a directory a new file with the same name will be created
  if (fse.existsSync(target)) {
    if (fse.lstatSync(target).isDirectory()) {
      targetFile = join(target, basename(source));
    }
  }

  fse.writeFileSync(targetFile, fse.readFileSync(source));
}

async function copyFolderRecursiveSync(source, target, blackList = []) {
  let files = [];

  // check if folder needs to be created or integrated
  let targetFolder = join(target, basename(source));
  if (config.APP_TAG_NAME !== 'core') {
    // modules don't need the client directory
    targetFolder = targetFolder.replace(`${config.APP_TAG_NAME}` + '\\client', `${config.APP_TAG_NAME}`);
  }

  if (!fse.existsSync(targetFolder)) {
    await fse.ensureDir(targetFolder);
  }

  // copy
  if (fse.lstatSync(source).isDirectory()) {
    files = fse.readdirSync(source);

    files = _.difference(files, blackList);

    await Promise.all(files.map(async (file) => {
      var curSource = join(source, file);
      if (fse.lstatSync(curSource).isDirectory()) {
        await copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        await copyFileSync(curSource, targetFolder);
      }
    }));
  }
}

config.init(() => {
  //console.log('config', config);
  console.log(chalk.cyan('Bundling started...'));
  bundleModules(() => {
    console.log(chalk.cyan('Bundling complete!'));
  });
})
