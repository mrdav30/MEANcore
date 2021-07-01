//  This script combines the core module with each mod listed inside the modules folder. 
//  **Note: Only the mod's client folder is merged. 
//  **Note: The purpose of these files is stricly for development/build purposes.  

import fs from 'fs';
import _ from 'lodash';
import chalk from 'chalk';

import {
  join
} from 'path';

import {
  clean,
  copyRecursive,
  setNgEnv,
  objectHelpers
} from './utils/index.js';

import bundleConfig from './config.init.js';

const bundleModules = async () => {

  await cleanOnce();

  for (let mod of bundleConfig.ALL_MODULES) {
    objectHelpers.extend(bundleConfig, mod);

    console.log(chalk.green('==================================='));
    console.log(chalk.green('Bundling: ' + bundleConfig.APP_NAME));
    console.log(chalk.green('==================================='));

    await fs.promises.mkdir(join(bundleConfig.DIST_DIR, bundleConfig.APP_NAME), { recursive: true});

    await Promise.all([
      await copyCore(),
      !bundleConfig.CORE_ONLY ? await copyModule() : Promise.resolve(),
      await setNgEnv.createAngularEnv(bundleConfig)
    ]).catch((e) => {
      console.log('bundle err', e);
    })
  }

  await buildAngularJson().then(() => {
    return;
  });
};

// Clean dev/coverage that will only run once
// this prevents karma watchers from being broken when directories are deleted
let firstRun = true;
const cleanOnce = async () => {
  if (firstRun) {
    firstRun = false;
    return await cleanNow();
  } else {
    console.log('Skipping clean on rebuild');
    return;
  }
}

const cleanNow = async () => {
  return await clean.cleanPaths([bundleConfig.TMP_DIR, bundleConfig.COVERAGE_DIR, bundleConfig.DIST_DIR]);
}

const copyCore = async () => {
  console.log(chalk.green('Copying Core'));
  return await Promise.all([
    // copy client directory
    await copyRecursive.copyFolderRecursive(bundleConfig.CORE_CLIENT_SRC, bundleConfig.TMP_DIR),
    // copy e2e directory
    await copyRecursive.copyFolderRecursive(bundleConfig.CORE_E2E_SRC, bundleConfig.TMP_DIR)
  ])
}

const copyModule = async () => {
  console.log(chalk.green('Copying Modules'));
  return await Promise.all([
    // copy client directory
    await copyRecursive.copyFolderRecursive(bundleConfig.MODULE_CLIENT_SRC, bundleConfig.TMP_DIR, bundleConfig.BLACK_LIST),
    // copy e2e directory
    await copyRecursive.copyFolderRecursive(bundleConfig.MODULE_E2E_SRC, bundleConfig.TMP_DIR, bundleConfig.BLACK_LIST)
  ])
}

// Create the bundles Angular.json file
async function buildAngularJson() {
  const coreJsonStr = await fs.promises.readFile(bundleConfig.CORE_NG_JSON);
  let coreJsonData = JSON.parse(coreJsonStr);

  coreJsonData.defaultProject = bundleConfig.DEFAULT_PROJECT;

  if (!bundleConfig.CORE_ONLY) {
    for (const mod of bundleConfig.ALL_MODULES) {
      const modJsonStr = await fs.promises.readFile(bundleConfig.MODULE_NG_JSON)

      let modJsonData = JSON.parse(modJsonStr);

      modJsonData = objectHelpers.renameKeys(modJsonData, mod.APP_NAME, '{{mod}}');
      modJsonData = objectHelpers.renameKeys(modJsonData, mod.APP_NAME + '-e2e', '{{mod}}-e2e');

      modJsonData = await objectHelpers.replacePropertyValues(modJsonData, '{{mod}}', mod.APP_NAME);

      coreJsonData.projects = _.mergeWith({}, coreJsonData.projects, modJsonData, (objValue, srcValue) => {
        if (_.isArray(objValue)) {
          return objValue.concat(srcValue);
        }
      });

      if (coreJsonData.defaultProject.length <= 0) {
        coreJsonData.defaultProject = mod.APP_NAME;
      }
    }
  }

  return fs.promises.writeFile(bundleConfig.NG_OUTPUT, bundleConfig.stringify(coreJsonData), 'utf-8').then(() => {
    console.log(chalk.cyan(`Angular.json file generated successfully at ${bundleConfig.NG_OUTPUT} \n`));
  }).catch((err) => {
    console.error(err);
  });
}

bundleConfig.init(async () => {
  console.log(chalk.cyan('Bundling started...'));
  return await bundleModules()
    .then(() => {
      console.log(chalk.cyan('Bundling complete!'));
      return 1;
    });
})
