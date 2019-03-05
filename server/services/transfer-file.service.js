var fs = require('fs'),
  path = require('path');

function responseFile(basePath, fileName, res) {
  var fullFileName = path.join(basePath, fileName);

  fs.exists(fullFileName, function (exist) {
    if (exist) {
      var filename = path.basename(fullFileName);

      res.setHeader('Content-Disposition', 'attachment; filename=' + filename);
      res.setHeader('Content-Transfer-Encoding', 'binary');
      res.setHeader('Content-Type', 'application/octet-stream');

      var rootDir = path.normalize(process.cwd());
      res.sendFile(fullFileName, {
        root: rootDir
      })
    } else {
      res.sendStatus(404);
    }
  });
};

exports.responseFile = responseFile
