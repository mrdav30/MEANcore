import * as imageUpload from './image-upload.server.controller.js';

export default async function (app) {
  // handle file upload
  app.route('/api/image-uploads').post(imageUpload.getUpload().single('upload'), imageUpload.upload);
  // handle file removal
  app.route('/api/image-uploads').put(imageUpload.removeImage);
}
