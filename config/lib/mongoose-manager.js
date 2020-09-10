/**
 * Module dependencies.
 */
import config from '../config.js';
import url from 'url';
import chalk from 'chalk';
import {
  resolve
} from 'path';
import mongoose from 'mongoose';

// Load the mongoose models
export async function loadModels(callback) {
  await Promise.all(config.files.models.map(async (modelFile) => {
    let modelPath = url.pathToFileURL(resolve(modelFile)).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    await import(modelPath);
  })).then(() => {
    if (callback) {
      callback();
    }
  }).catch((err) => {
    console.log(err);
  });
}

// Initialize Mongoose
export async function connectDB(callback) {
  mongoose.Promise = config.mongoDB.promise;

  mongoose.connect(config.mongoDB.uri, config.mongoDB.options)
    .then(function (connection) {
      // Enabling mongoose debug mode if required
      mongoose.set('debug', config.mongoDB.debug);

      // Call callback FN
      if (callback) {
        callback(connection.db);
      }
    })
    .catch(function (err) {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(err);
    });
}

export function disconnect(cb) {
  mongoose.connection.close(function (err) {
    console.info(chalk.yellow('Disconnected from MongoDB.'));
    return cb(err);
  });
}
