import fse from 'fs-extra';
import { join, basename, normalize } from 'path';

export function responseFile(basePath, fileName, res) {
  var fullFileName = join(basePath, fileName);

  fse.access(fullFileName, (exist) => {
    if (exist) {
      var filename = basename(fullFileName);

      res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-Transfer-Encoding', 'binary');
      res.setHeader('Content-Type', 'application/octet-stream');

      var rootDir = normalize(process.cwd());
      res.sendFile(fullFileName, {
        root: rootDir
      })
    } else {
      res.sendStatus(404);
    }
  });
}
