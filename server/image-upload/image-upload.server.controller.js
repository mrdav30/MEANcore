'use strict';

var path = require('path'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  _ = require('lodash'),
  fs = require('fs-extra'),
  errorHandler = require('../errors.server.controller'),
  imageStorage = config.helpers.imageStorage;

var getUpload = function (req, res) {
  // file upload config using multer

  var storage = imageStorage({
    output: 'png',
    quality: 50
  })

  var upload = multer({
    storage: storage
  });

  return upload;
}
exports.getUpload = getUpload;

exports.upload = function (req, res, next) {

  var dir = req.query.upload || '';
  var filename = req.file.filename;
  var finalDest = config.uploads.images.uploadRepository + dir + '/' + filename

  fs.move(config.uploads.images.uploadRepository + '/_tempDir/' + filename, finalDest, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    var base = res.locals.host;
    var url = path.join(req.file.baseUrl, dir, filename).replace(/[\\\/]+/g, '/').replace(/^[\/]+/g, '');

    // respond with image url
    res.status(200).send({
      "uploaded": true,
      "url": (req.file.storage == 'local' ? base : '') + '/' + url
    });
  });
}

exports.removeImage = function (req, res, next) {
  fs.unlink(config.uploads.images.uploadRepository + req.body.imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.status(200).send({
      message: 'Image successfully removed'
    });
  })
}
