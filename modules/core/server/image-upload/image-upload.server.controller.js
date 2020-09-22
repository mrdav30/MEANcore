import {
  join
} from 'path';
import multer from 'multer';
import fse from 'fs-extra';

export const getUpload = (config) => {
  // file upload config using multer

  const storage = config.helpers.ImageStorage(config, {
    output: 'png',
    quality: 50
  })

  const upload = multer({
    storage: storage
  });

  return upload;
}

export const upload = (req, res) => {
  const config = req.app.locals.config;

  const dir = req.query.upload || '';
  const filename = req.file.filename;
  const finalDest = config.uploads.images.uploadRepository + dir + '/' + filename

  fse.move(config.uploads.images.uploadRepository + '/_tempDir/' + filename, finalDest, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({
        message: config.helpers.getErrorMessage(err)
      });
    }

    const base = res.locals.host;
    // eslint-disable-next-line no-useless-escape
    const url = join(req.file.baseUrl, dir, filename).replace(/[\\\/]+/g, '/').replace(/^[\/]+/g, '');

    // respond with image url
    res.status(200).send({
      "uploaded": true,
      "url": (req.file.storage == 'local' ? base : '') + '/' + url
    });
  });
}

export const removeImage = (req, res) => {
  const config = req.app.locals.config;
  fse.unlink(config.uploads.images.uploadRepository + req.body.imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({
        message: config.helpers.getErrorMessage(err)
      });
    }

    res.status(200).send({
      message: 'Image successfully removed'
    });
  })
}
