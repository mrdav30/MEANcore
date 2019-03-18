'use strict';

var path = require('path'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  _ = require('lodash'),
  //   slugify = config.helpers.slugify,
  //   fileExists = config.helpers.fileExists,
  imageStorage = config.helpers.imageStorage;

var getUpload = function () {
  // file upload config using multer

  var storage = imageStorage({
    square: true,
    responsive: true,
    quality: 90
  })

  var upload = multer({
    storage: storage,
    limits: config.uploads.images.limits
  });

  return upload;
}
exports.getUpload = getUpload;

exports.upload = function (req, res, next) {

  var dir = req.params.directory;
  var filename = req.file.filename;
  var finalDest = config.uploads.images.uploadRepository + dir + '/' + filename

  fs.move(config.uploads.images.uploadRepository + filename, finalDest, (err) => {
    if (err) {
      return console.error(err);
    }

    var port = req.app.get('port');
    var base = req.protocol + '://' + req.hostname + (port ? ':' + port : '');
    var url = path.join(req.file.baseUrl, filename).replace(/[\\\/]+/g, '/').replace(/^[\/]+/g, '');

    // respond with image url
    res.status(200).send({
      "uploaded": true,
      "url": (req.file.storage == 'local' ? base : '') + '/' + url
    });
  });
}
