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

const blackList = ['tsconfig.json', 'tsconfig.app.json', 'tsconfig.spec.json', 'tslint.json', 'tsconfig.e2e.json'];

const bundleModules = async (done) => {
  async.series([
    async () => {
        await cleanOnce();
      },
      async () => {
          await Promise.all(config.ALL_MODULES.map(async (mod) => {
            await config.mergeObject(config, mod);

            console.log(chalk.green('==================================='));
            console.log(chalk.green('Bundling: ' + config.APP_NAME));
            console.log(chalk.green('==================================='));

            console.log(chalk.green('Copying Core'));

            await copyCore();

            await copyModule();
          }));
        },
        async () => {
          await buildAngularJson();
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
  await copyFolderRecursiveSync(config.CORE_CLIENT_SRC, config.TMP_DIR);
  // copy e2e directory
  await copyFolderRecursiveSync(config.CORE_E2E_SRC, config.TMP_DIR);
}

const copyModule = async () => {
  // copy client directory
  if (fse.existsSync(config.MODULE_CLIENT_SRC)) {
    await copyFolderRecursiveSync(config.MODULE_CLIENT_SRC, config.TMP_DIR, blackList);
  }
  // copy e2e directory
  if (fse.existsSync(config.MODULE_E2E_SRC)) {
    await copyFolderRecursiveSync(config.MODULE_E2E_SRC, config.TMP_DIR, blackList);
  }
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

// Create the bundles Angular.json file
async function buildAngularJson() {
  const baseJsonStr = fse.readFileSync(config.BASE_NG_JSON);
  let baseJsonData = JSON.parse(baseJsonStr);

  baseJsonData.defaultProject = config.DEFAULT_PROJECT;

  for (const mod of config.ALL_MODULES) {
    const childJsonStr = fse.readFileSync(config.CHILD_NG_JSON)

    let childJsonData = JSON.parse(childJsonStr);

    await renameKeys(childJsonData, mod);

    childJsonData = await replacePropertyValues(childJsonData, mod);

    baseJsonData.projects = _.mergeWith({}, baseJsonData.projects, childJsonData, (objValue, srcValue) => {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    });

    if(baseJsonData.defaultProject.length <= 0){
      baseJsonData.defaultProject = mod.APP_TAG_NAME;
    }
  }

  baseJsonData = JSON.stringify(baseJsonData);

  fse.writeFile(config.NG_OUTPUT, baseJsonData, (err) => {
    if (err) {
      throw console.error(err);
    } else {
      console.log(chalk.cyan(`Angular.json file generated correctly at ${config.NG_OUTPUT} \n`));
    }
  });
}

async function renameKeys(obj, mod) {
  obj[mod.APP_TAG_NAME] = obj['{{child}}'];
  delete obj['{{child}}'];
  obj[mod.APP_TAG_NAME + '-e2e'] = obj['{{child}}-e2e'];
  delete obj['{{child}}-e2e'];
}

async function replacePropertyValues(obj, mod) {
  const newObject = _.clone(obj);

  await _.each(obj, async (val, key) => {
    if (typeof (val) === 'object') {
      newObject[key] = await replacePropertyValues(val, mod);
    } else if (_.includes(val, '{{child}}')) {
      newObject[key] = _.replace(val, new RegExp("{{child}}", "g"), mod.APP_TAG_NAME);
    }
  })

  return newObject
}

config.init(() => {
  console.log(chalk.cyan('Bundling started...'));
  bundleModules(() => {
    console.log(chalk.cyan('Bundling complete!'));
  });
})
