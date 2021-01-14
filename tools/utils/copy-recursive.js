import {
  join,
  basename
} from 'path';
import _ from 'lodash';
import fse from 'fs-extra';

export async function copyFileSync(source, target) {

  var targetFile = target;

  //if target is a directory a new file with the same name will be created
  if (fse.existsSync(target)) {
    if (fse.lstatSync(target).isDirectory()) {
      targetFile = join(target, basename(source));
    }
  }

  fse.writeFileSync(targetFile, fse.readFileSync(source));
}

export async function copyFolderRecursiveSync(source, target, blackList = []) {
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
