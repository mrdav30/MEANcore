import fs from 'fs';
import {
  join,
  basename,
  dirname
} from 'path';

import * as objectHelpers from './object-helpers.js';

export const getGlobs = (searchPath, globpattern, targetpath) => {
  if (searchPath.length > 0 && !globpattern) {
    return [targetpath];
  }

  if (globpattern.startsWith(searchPath)) {
    globpattern = globpattern.replace(searchPath, '').substr(1, globpattern.length);
  }

  // replace all backslashes with forward slashes before splitting by forward slash
  let splitPattern = globpattern.replace(/\\/g, '/').split('/');

  let allFolders = fs.lstatSync(searchPath).isDirectory() ? fs.readdirSync(searchPath) : [];
  let allFiles = [];

  if (splitPattern[0] === '**') {
    splitPattern.shift();
    globpattern = splitPattern.join('/');

    for (let i = 0; i < allFolders.length; i++) {
      let deepTarget = join(targetpath ? targetpath : '', allFolders[i]);
      let deepSearch = join(searchPath, allFolders[i]);

      let files = getGlobs(deepSearch, globpattern, deepTarget);
      if (files && files.length > 0) {
        allFiles = [...allFiles, ...files];
      }
    }

    return allFiles;
  } else if (splitPattern[0].startsWith('!')) {
    let ignore = splitPattern[0].split('(').pop().split(')')[0]

    splitPattern.shift();
    globpattern = splitPattern.join('/');

    for (let i = 0; i < allFolders.length; i++) {
      if (allFolders[i] != ignore) {
        let deepTarget = join(targetpath ? targetpath : '', allFolders[i]);
        let deepSearch = join(searchPath, allFolders[i]);

        let files = getGlobs(deepSearch, globpattern, deepTarget);
        if (files && files.length > 0) {
          allFiles = [...allFiles, ...files];
        }
      }
    }

    return allFiles;
  } else if (splitPattern[0].match(/\.[0-9a-z]+$/i)) {
    if (fs.lstatSync(searchPath).isDirectory()) {
      if (splitPattern[0].startsWith('*')) {
        splitPattern = globpattern.split('*')[1];
        allFiles = fs.readdirSync(searchPath).filter((fn) => fn.endsWith(splitPattern))
      } else {
        allFiles = fs.readdirSync(searchPath).filter((fn) => fn == splitPattern[0])
      }

      allFiles.forEach((p, i, a) => {
        a[i] = join(targetpath, p);
      });
    } else {
      splitPattern = splitPattern[0].startsWith('*') ? globpattern.split('*')[1] : splitPattern[0];
      if (basename(searchPath).endsWith(splitPattern) || basename(searchPath) == splitPattern) {
        allFiles.push(join(dirname(targetpath), basename(searchPath)));
      }
    }

    return allFiles;
  } else if (allFolders.indexOf(splitPattern[0]) > -1) {
    targetpath = join(targetpath ? targetpath : '', splitPattern[0]);
    searchPath = join(searchPath, splitPattern[0]);
    splitPattern.shift();
    globpattern = splitPattern.join('/');

    return getGlobs(searchPath, globpattern, targetpath);
  } else {
    return;
  }
}

/**
 * Get files by glob patterns
 */
export const getGlobbedPaths = (globPatterns, excludes) => {
  // URL paths regex
  let urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');

  // The output array
  let output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (Array.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = objectHelpers.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (typeof globPatterns === 'string') {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = getGlobs(process.cwd(), globPatterns);

      if (excludes) {
        files = files.map(function (file) {
          if (Array.isArray(excludes)) {
            Object.keys(excludes).forEach(function (i) {
              file = file.replace(excludes[i], '');
            });
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = objectHelpers.union(output, files);
    }
  }

  return output;
}
