'use strict';

module.exports = function (app) {
  var imageUpload = require('./image-upload.server.controller');

  // handle file upload
  app.route('/api/image-uploads').post(imageUpload.getUpload().single('upload'), imageUpload.upload);
  // handle file removal
  app.route('/api/image-uploads').put(imageUpload.removeImage);
};