 import fse from 'fs-extra';
 import _ from 'lodash';
 import chalk from 'chalk';
 import bundleConfig from './config.init.js';

 // Revert to backup (i.e. core.package.json/mod.package.json)
 const revertToBackupPkg = async () => {
   console.log(chalk.cyan('Unbundling package.json.'));

   if (fse.existsSync(bundleConfig.CORE_PKG)) {
     // Overwrite current core package.json with back up!
     fse.copyFileSync(bundleConfig.CORE_PKG, bundleConfig.LINK_PKG);
   }

   _.forEach(bundleConfig.ALL_MODULES, (mod) => {
     if (fse.existsSync(mod.LINK_MOD_PKG)) {
       // Overwrite module package.json with back up!
       fse.copyFileSync(mod.LINK_MOD_PKG, mod.MOD_PKG);
     } else {
       // Back up current module package.json
       fse.copyFileSync(mod.MOD_PKG, mod.LINK_MOD_PKG);
     }
   });

   console.log(chalk.cyan('Unbundling finished.'));
 }

 bundleConfig.init(() => {
  console.log('bundleConfig', bundleConfig);

   revertToBackupPkg();
 });
