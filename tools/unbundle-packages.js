 import fse from 'fs-extra';
 import _ from 'lodash';
 import chalk from 'chalk';
 import bundleConfig from './config.init.js';

 // Revert to backup (i.e. core.package.json/mod.package.json)
 const revertToBackupPkg = async () => {
   console.log(chalk.cyan('Unbundling linked package.json.'));

   if (fse.existsSync(bundleConfig.CORE_PKG_BKP)) {
     // Overwrite current core package.json with back up!
     fse.copyFileSync(bundleConfig.CORE_PKG_BKP, bundleConfig.LINK_CORE_PKG);
   }

   _.forEach(bundleConfig.ALL_MODULES, (mod) => {
     if (fse.existsSync(mod.LINK_MOD_PKG)) {
       // Overwrite module package.json with back up!
       fse.copyFileSync(mod.LINK_MOD_PKG, mod.MOD_PKG_BKP);
     } else {
       // Back up current module package.json
       fse.copyFileSync(mod.MOD_PKG_BKP, mod.LINK_MOD_PKG);
     }
   });

   console.log(chalk.cyan('Unbundling linked package.json finished.'));
 }

 bundleConfig.init(() => {
   revertToBackupPkg();
 });