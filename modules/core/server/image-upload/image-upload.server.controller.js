import {
  join
} from 'path';
import multer from 'multer';
import fs from 'fs';

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

export const upload = async (req, res) => {
  const config = req.app.locals.config;

  const dir = req.query.upload || '';
  const filename = req.file.filename;
  const finalDestPath = config.uploads.images.uploadRepository + dir;

  try {
    // test if source exists
    await fs.promises.access(finalDestPath);
  } catch {
    await fs.promises.mkdir(finalDestPath, {
      recursive: true
    });
  }

  await fs.promises.rename(config.uploads.images.uploadRepository + '/_tempDir/' + filename, finalDestPath + '/' + filename).then(() => {
    const base = res.locals.host;
    // eslint-disable-next-line no-useless-escape
    const url = join(req.file.baseUrl, dir, filename).replace(/[\\\/]+/g, '/').replace(/^[\/]+/g, '');

    // respond with image url
    res.status(200).send({
      "uploaded": true,
      "url": (req.file.storage == 'local' ? base : '') + '/' + url
    });
  }).catch((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({
        message: config.helpers.getErrorMessage(err)
      });
    }
  });
}

export const removeImage = async (req, res) => {
  const config = req.app.locals.config;
  const target = config.uploads.images.uploadRepository + req.body.imagePath;

  await fs.promises.unlink(target, () => {}).then(() => {
    res.status(200).send({
      message: 'Image successfully removed'
    });
  }).catch((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({
        message: config.helpers.getErrorMessage(err)
      });
    }
  })
}
