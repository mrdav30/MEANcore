 import fs from 'fs';
 import bundleConfig from './config.init.js';

 // Revert to backup (i.e. core.package.json/mod.package.json)
 const revertToBackupPkg = async () => {
   console.log('Unbundling linked package.json.');

   if (fs.existsSync(bundleConfig.CORE_PKG_BKP)) {
     // Overwrite current core package.json with back up!
     fs.copyFileSync(bundleConfig.CORE_PKG_BKP, bundleConfig.LINK_CORE_PKG);
   }

   bundleConfig.ALL_MODULES.forEach((mod) => {
     if (fs.existsSync(mod.LINK_MOD_PKG)) {
       // Overwrite module package.json with back up!
       fs.copyFileSync(mod.LINK_MOD_PKG, mod.MOD_PKG_BKP);
     } else {
       // Back up current module package.json
       fs.copyFileSync(mod.MOD_PKG_BKP, mod.LINK_MOD_PKG);
     }
   });

   console.log('Unbundling linked package.json finished.');

   return 1;
 }

 bundleConfig.init(() => {
   revertToBackupPkg();
 });