import {
  join,
  basename
} from 'path';
import _ from 'lodash';
import fs from 'fs';

export async function copyFileSync(source, target) {

  var targetFile = target;

  //if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = join(target, basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

export async function copyFolderRecursiveSync(source, target, blackList = []) {
  let files = [];

  // check if folder needs to be created or integrated
  let targetFolder = join(target, basename(source));

  if (!fs.existsSync(targetFolder)) {
    await fs.ensureDir(targetFolder);
  }

  // copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);

    files = _.difference(files, blackList);

    await Promise.all(files.map(async (file) => {
      var curSource = join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        await copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        await copyFileSync(curSource, targetFolder);
      }
    }));
  }
}
