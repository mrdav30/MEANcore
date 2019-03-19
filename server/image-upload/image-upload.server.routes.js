'use strict';

module.exports = function (app) {
  var imageUpload = require('./image-upload.server.controller');

  // handle profile file upload
  app.route('/api/image-uploads').post(imageUpload.getUpload().single('upload'), imageUpload.upload);
};