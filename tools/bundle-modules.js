//  This script combines the core module with each mod listed inside the modules folder. 
//  **Note: Only the mod's client folder is merged. 
//  **Note: The purpose of these files is stricly for development/build purposes.  

import {
  join,
  basename
} from 'path';
import fse from 'fs-extra';
import _ from 'lodash';
import async from 'async';
import chalk from 'chalk';

import {
  createAngularEnv
} from './utils/set-env.js';

import {
  clean
} from './utils/clean.js';

import bundleConfig from './config.init.js';

const bundleModules = async (done) => {
  async.series([
    async () => {
        await cleanOnce();
      },
      async () => {
          await Promise.all(bundleConfig.ALL_MODULES.map(async (mod) => {
            await bundleConfig.mergeObject(bundleConfig, mod);

            console.log(chalk.green('==================================='));
            console.log(chalk.green('Bundling: ' + bundleConfig.APP_NAME));
            console.log(chalk.green('==================================='));

            console.log(chalk.green('Copying Core'));

            await copyCore();

            await copyModule();

            await createAngularEnv(bundleConfig);
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
  await clean([bundleConfig.TMP_DIR, bundleConfig.COVERAGE_DIR]);
}

const copyCore = async () => {
  // copy client directory
  await copyFolderRecursiveSync(bundleConfig.CORE_CLIENT_SRC, bundleConfig.TMP_DIR);
  // copy e2e directory
  await copyFolderRecursiveSync(bundleConfig.CORE_E2E_SRC, bundleConfig.TMP_DIR);
}

const copyModule = async () => {
  // copy client directory
  if (fse.existsSync(bundleConfig.MODULE_CLIENT_SRC)) {
    await copyFolderRecursiveSync(bundleConfig.MODULE_CLIENT_SRC, bundleConfig.TMP_DIR, bundleConfig.BLACK_LIST);
  }
  // copy e2e directory
  if (fse.existsSync(bundleConfig.MODULE_E2E_SRC)) {
    await copyFolderRecursiveSync(bundleConfig.MODULE_E2E_SRC, bundleConfig.TMP_DIR, bundleConfig.BLACK_LIST);
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
  const coreJsonStr = fse.readFileSync(bundleConfig.CORE_NG_JSON);
  let coreJsonData = JSON.parse(coreJsonStr);

  coreJsonData.defaultProject = bundleConfig.DEFAULT_PROJECT;

  for (const mod of bundleConfig.ALL_MODULES) {
    const modJsonStr = fse.readFileSync(bundleConfig.MODULE_NG_JSON)

    let modJsonData = JSON.parse(modJsonStr);

    await renameKeys(modJsonData, mod);

    modJsonData = await replacePropertyValues(modJsonData, mod);

    coreJsonData.projects = _.mergeWith({}, coreJsonData.projects, modJsonData, (objValue, srcValue) => {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    });

    if (coreJsonData.defaultProject.length <= 0) {
      coreJsonData.defaultProject = mod.APP_NAME;
    }
  }

  return bundleConfig.writeFilePromise(bundleConfig.NG_OUTPUT, bundleConfig.stringify(coreJsonData), 'utf-8').then(() => {
    console.log(chalk.cyan(`Angular.json file generated successfully at ${bundleConfig.NG_OUTPUT} \n`));
  }).catch((err) => {
    console.error(err);
  });
}

async function renameKeys(obj, mod) {
  obj[mod.APP_NAME] = obj['{{mod}}'];
  delete obj['{{mod}}'];
  obj[mod.APP_NAME + '-e2e'] = obj['{{mod}}-e2e'];
  delete obj['{{mod}}-e2e'];
}

async function replacePropertyValues(obj, mod) {
  const newObject = _.clone(obj);

  await _.each(obj, async (val, key) => {
    if (typeof (val) === 'object') {
      newObject[key] = await replacePropertyValues(val, mod);
    } else if (_.includes(val, '{{mod}}')) {
      newObject[key] = _.replace(val, new RegExp("{{mod}}", "g"), mod.APP_NAME);
    }
  })

  return newObject
}

bundleConfig.init(() => {
  console.log(chalk.cyan('Bundling started...'));
  bundleModules(() => {
    console.log(chalk.cyan('Bundling complete!'));
  });
})
