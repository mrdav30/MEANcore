// Load dependencies
import _ from 'lodash';
import fse from 'fs-extra';
import {
  resolve,
  join,
  basename
} from 'path';
import jimp from 'jimp';
import PngQuant from 'pngquant';
import {
  randomBytes,
  createHash
} from 'crypto';
import concat from 'concat-stream';
import streamifier from 'streamifier';

// create a multer storage engine
export const ImageStorage = (config, options) => {

  // Configure UPLOAD_PATH
  const UPLOAD_PATH = resolve(config.uploads.images.uploadRepository + '/_tempDir');

  // this serves as a constructor
  class ImageStorage {
    constructor(config, opts) {

      const baseUrl = config.app.appBaseUrl + config.app.apiBaseUrl + config.uploads.images.baseUrl;

      const allowedStorageSystems = ['local', 's3'];
      const allowedOutputFormats = ['jpg', 'png'];

      // fallback for the options
      const defaultOptions = {
        storage: 'local',
        output: 'png',
        greyscale: false,
        quality: 70,
        square: false,
        threshold: 500,
        responsive: false
      };

      // extend default options with passed options
      let options = (opts && _.isObject(opts)) ? _.pick(opts, _.keys(defaultOptions)) : {};
      options = _.extend(defaultOptions, options);

      // check the options for correct values and use fallback value where necessary
      this.options = _.forIn(options, (value, key, object) => {

        switch (key) {

          case 'square':
          case 'greyscale':
          case 'responsive':
            object[key] = _.isBoolean(value) ? value : defaultOptions[key];
            break;

          case 'storage':
            value = String(value).toLowerCase();
            object[key] = _.includes(allowedStorageSystems, value) ? value : defaultOptions[key];
            break;

          case 'output':
            value = String(value).toLowerCase();
            object[key] = _.includes(allowedOutputFormats, value) ? value : defaultOptions[key];
            break;

          case 'quality':
            value = isFinite(value) ? value : Number(value);
            object[key] = (value && value >= 0 && value <= 100) ? value : defaultOptions[key];
            break;

          case 'threshold':
            value = isFinite(value) ? value : Number(value);
            object[key] = (value && value >= 0) ? value : defaultOptions[key];
            break;

        }

      });

      // set the upload path
      this.uploadPath = this.options.responsive ? join(UPLOAD_PATH, 'responsive') : UPLOAD_PATH;

      // set the upload base url
      this.uploadBaseUrl = this.options.responsive ? join(baseUrl, 'responsive') : baseUrl;

      if (this.options.storage == 'local') {
        // if upload path does not exist, create the upload path structure
        !fse.existsSync(this.uploadPath) && fse.mkdirp.sync(this.uploadPath);
      }

    }
    // this generates a random cryptographic filename
    _generateRandomFilename() {
      // create pseudo random bytes
      const bytes = randomBytes(32);

      // create the md5 hash of the random bytes
      const checksum = createHash('MD5').update(bytes).digest('hex');

      // return as filename the hash with the output extension
      return checksum + '.' + this.options.output;
    }
    // this creates a Writable stream for a filepath
    _createOutputStream(filepath, cb) {

      // create a reference for this to use in local functions
      const that = this;

      // create a writable stream from the filepath
      const output = fse.createWriteStream(filepath);

      // set callback fn as handler for the error event
      output.on('error', cb);

      // set handler for the finish event
      output.on('finish', () => {
        cb(null, {
          destination: that.uploadPath,
          baseUrl: that.uploadBaseUrl,
          filename: basename(filepath),
          storage: that.options.storage
        });
      });

      // return the output stream
      return output;
    }
    // this processes the Jimp image buffer
    _processImage(image, cb) {

      // create a reference for this to use in local functions
      const that = this;

      let batch = [];

      // the responsive sizes
      const sizes = ['lg', 'md', 'sm'];

      const filename = this._generateRandomFilename();

      let mime = null;
      // create a clone of the Jimp image
      let clone = image.clone();

      // fetch the Jimp image dimensions
      const width = clone.bitmap.width;
      const height = clone.bitmap.height;
      let square = Math.min(width, height);
      const threshold = this.options.threshold;

      // resolve the Jimp output mime type
      switch (this.options.output) {
        case 'jpg':
          mime = jimp.MIME_JPEG;
          break;
        case 'png':
        default:
          mime = jimp.MIME_PNG;
          break;
      }

      // auto scale the image dimensions to fit the threshold requirement
      if (threshold && square > threshold) {
        clone = (square == width) ? clone.resize(threshold, jimp.AUTO, jimp.RESIZE_BEZIER) : clone.resize(jimp.AUTO, threshold, jimp.RESIZE_BEZIER);
        //clone.scaleToFit(threshold, Jimp.AUTO, Jimp.RESIZE_BEZIER)
        //(square == width) ? clone.resize(threshold, Jimp.AUTO, Jimp.RESIZE_BEZIER) : clone.resize(Jimp.AUTO, threshold, Jimp.RESIZE_BEZIER);
        //clone.scaleToFit(threshold, Jimp.AUTO, Jimp.RESIZE_BEZIER)
        //(square == width) ? clone.resize(threshold, Jimp.AUTO, Jimp.RESIZE_BEZIER) : clone.resize(Jimp.AUTO, threshold, Jimp.RESIZE_BEZIER);
        //clone.scaleToFit(threshold, Jimp.AUTO, Jimp.RESIZE_BEZIER)
        //(square == width) ? clone.resize(threshold, Jimp.AUTO) : clone.resize(Jimp.AUTO, threshold);
      }

      // crop the image to a square if enabled
      if (this.options.square) {

        if (threshold) {
          square = Math.min(square, threshold);
        }

        // fetch the new image dimensions and crop
        clone = clone.crop((clone.bitmap.width - square) / 2, (clone.bitmap.height - square) / 2, square, square);
      }

      // convert the image to greyscale if enabled
      if (this.options.greyscale) {
        clone = clone.greyscale();
      }

      // set the image output quality
      if (mime === jimp.MIME_JPEG) {
        clone = clone.quality(this.options.quality);
      }

      if (this.options.responsive) {

        // map through  the responsive sizes and push them to the batch
        batch = _.map(sizes, (size) => {

          let outputStream;

          let image = null;
          let filepath = filename.split('.');

          // create the complete filepath and create a writable stream for it
          filepath = filepath[0] + '_' + size + '.' + filepath[1];
          filepath = join(that.uploadPath, filepath);
          outputStream = that._createOutputStream(filepath, cb);

          // scale the image based on the size
          switch (size) {
            case 'sm':
              image = clone.clone().scale(0.3);
              break;
            case 'md':
              image = clone.clone().scale(0.7);
              break;
            case 'lg':
              image = clone.clone();
              break;
          }

          // return an object of the stream and the Jimp image
          return {
            stream: outputStream,
            image: image
          };
        });

      } else {

        // push an object of the writable stream and Jimp image to the batch
        batch.push({
          stream: that._createOutputStream(join(that.uploadPath, filename), cb),
          image: clone
        });

      }

      // process the batch sequence
      _.each(batch, (current) => {
        // get the buffer of the Jimp image using the output mime type
        current.image.getBuffer(mime, (err, buffer) => {
          if (that.options.storage == 'local') {
            if (mime === jimp.MIME_PNG) {
              const pngQuanter = new PngQuant([256, '--quality', that.options.quality]);
              streamifier.createReadStream(buffer).pipe(pngQuanter).pipe(current.stream);
            } else {
              streamifier.createReadStream(buffer).pipe(current.stream);
            }
          }
        });
      });

    }
    // multer requires this for handling the uploaded file
    _handleFile(req, file, cb) {

      // create a reference for this to use in local functions
      const that = this;

      // create a writable stream using concat-stream that will
      // concatenate all the buffers written to it and pass the
      // complete buffer to a callback fn
      const fileManipulate = concat((imageData) => {

        // read the image buffer with Jimp
        // it returns a promise
        jimp.read(imageData)
          .then((image) => {
            // process the Jimp image buffer
            that._processImage(image, cb);
          })
          .catch(cb);
      });

      // write the uploaded file buffer to the fileManipulate stream
      file.stream.pipe(fileManipulate);

    }
    // multer requires this for destroying file
    _removeFile(req, file, cb) {

      let matches, pathsplit;
      const filename = file.originalname;
      const _path = join(this.uploadPath, filename);
      let paths = [];

      // delete the file properties
      delete file.filename;
      delete file.destination;
      delete file.baseUrl;
      delete file.storage;

      // create paths for responsive images
      if (this.options.responsive) {
        pathsplit = _path.split('/');
        matches = pathsplit.pop().match(/^(.+?)_.+?\.(.+)$/i);

        if (matches) {
          paths = _.map(['lg', 'md', 'sm'], (size) => {
            return pathsplit.join('/') + '/' + (matches[1] + '_' + size + '.' + matches[2]);
          });
        }
      } else {
        paths = [_path];
      }

      // delete the files from the filesystem
      _.each(paths, (_path) => {
        fse.unlink(_path, cb);
      });

    }
  }

  // create a new instance with the passed options and return it
  return new ImageStorage(config, options);
};
