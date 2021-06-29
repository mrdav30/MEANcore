/**
 * Module dependencies.
 */
import url from 'url';
import chalk from 'chalk';
import {
  resolve
} from 'path';
import mongoose from 'mongoose';

// Initialize Mongoose
export const connectMongoDB = async (config) => {
  mongoose.Promise = config.mongoDB.promise;

  return await mongoose.connect(config.mongoDB.uri, config.mongoDB.options)
    .then(async (instance) => {
      // Enabling mongoose debug mode if required
     mongoose.set('debug', config.mongoDB.debug);

     return instance.connection.db;
    })
    .catch((err) => {
      console.error(chalk.red('Could not connect to MongoDB!'));
      console.log(err);
    });
}

// Load the mongoose models
export const loadMongoModels = async (config) => {
  await Promise.all(config.files.models.map(async (modelFile) => {
    let modelPath = url.pathToFileURL(resolve(modelFile)).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    await import(modelPath);
  })).catch((err) => {
    console.log(err);
  });
}

export const disconnectMongoDB = (cb) => {
  mongoose.connection.close((err) => {
    console.info(chalk.yellow('Disconnected from MongoDB.'));
    return cb(err);
  });
}
