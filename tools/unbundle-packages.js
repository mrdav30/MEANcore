 import fs from 'fs';
 import cp from 'child_process';
 import bundleConfig from './config.init.js';

 // Revert to backup (i.e. core.package.json/mod.package.json)
 const revertToBackupPkg = async () => {
   console.log('Unbundling linked package.json started');

   try {
     await fs.promises.access(bundleConfig.CORE_PKG_BKP);
     await fs.promises.copyFile(bundleConfig.CORE_PKG_BKP, bundleConfig.LINK_CORE_PKG);
   } catch {
     // No current back up package.json recover
   }

   if (!bundleConfig.CORE_ONLY) {
     bundleConfig.ALL_MODULES.forEach(async (mod) => {
       try {
         await fs.promises.access(mod.MOD_PKG_BKP);
         await fs.promises.copyFile(mod.MOD_PKG_BKP, mod.LINK_MOD_PKG);
       } catch {
         // No module back up package.json to recover
       }
     });
   }

   return Promise.resolve();
 }

 bundleConfig.init(async () => {
   return await revertToBackupPkg().then(() => {
     cp.exec("npm config set core_pkg_linked 0");
     console.log('Unbundling linked package.json finished');
     return 1;
   });
 });
