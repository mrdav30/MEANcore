import {
  join,
  basename
} from 'path';
import _ from 'lodash';
import fs from 'fs';

export async function copyFile(source, target) {
  //if target is a directory a new file with the same name will be created
  if ((await fs.promises.lstat(target)).isDirectory()) {
    target = join(target, basename(source));
  }

  return await fs.promises.writeFile(target, (await fs.promises.readFile(source)));
}

export async function copyFolderRecursive(source, target, blackList = []) {
  try {
    // test if source exists
    await fs.promises.access(source);

    if ((await fs.promises.lstat(source)).isDirectory()) {
      let targetFolder = join(target, basename(source));

      await fs.promises.mkdir(targetFolder, {
        recursive: true
      });

      let files = [];

      files = await fs.promises.readdir(source);
      files = _.difference(files, blackList);

      return await Promise.all(files.map(async (file) => {
        var curSource = join(source, file);
        if ((await fs.promises.lstat(curSource)).isDirectory()) {
          //  console.log(1)
          return await copyFolderRecursive(curSource, targetFolder);
        } else {
          return await copyFile(curSource, targetFolder);
        }
      })).catch((e) => {
        console.log('copy err', e)
        return;
      });
    } else {
      return;
    }
  } catch {
    return;
  }
}
