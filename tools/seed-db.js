import "../env.js";

import {
  connectMongoDB,
  loadMongoModels,
  disconnectMongoDB
} from '../config/lib/mongoose-manager.js';
import config from '../config/config.js';
import mongoose from 'mongoose';
import _ from 'lodash';
import chalk from 'chalk';
import {
  join
} from 'path';
import url from 'url';

const inititalSeedSetup = async () => {
  console.log(chalk.green('Seeding ' + process.env.NODE_ENV + " databases"));
  console.log(chalk.green('Database:  ' + config.mongoDB.uri));

  let allSeeds = [];

  // add core default seed
  allSeeds.push(config.seedDB || {});

  // bundle seed configs for all submodules
  await Promise.all(config.submodules.map(async (module) => {
    const appConfigPath = url.pathToFileURL(module.appDefaultConfig).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let appConfig = await import(appConfigPath);

    const moduleEnvConfigPath = url.pathToFileURL(join(process.cwd(), module.basePath + '/config/env', process.env.NODE_ENV + '.js')).href;
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const moduleEnvConfig = await import(moduleEnvConfigPath);

    // Merge default config with submodules env config
    appConfig = _.mergeWith({}, appConfig, moduleEnvConfig, (objValue, srcValue) => {
      if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    });

    allSeeds.push(appConfig.seedDB || {});
  }));

  // Open mongoose database connection
  await connectMongoDB(config).then(async () => {
      await loadMongoModels(config);

      for (let seed of allSeeds) {
        await configureSeed({
          options: seed.options || {},
          collections: seed.collections || {}
        })
      }
    })
    .then(() => {
      // Disconnect and finish task
      disconnectMongoDB((disconnectError) => {
        if (disconnectError) {
          console.log('Error disconnecting from the database.');
          // Finish task with error
          console.error(disconnectError);
        }
      });
    })
    .catch((err) => {
      disconnectMongoDB((disconnectError) => {
        if (disconnectError) {
          console.log('Error disconnecting from the database, but was preceded by a Mongo Seed error.');
        }

        // Finish task with error
        console.error(err);
      });
    });
}

export const configureSeed = async (seedConfig) => {
  return new Promise((resolve, reject) => {
    seedConfig = seedConfig || {};

    const options = seedConfig.options || {
      options: {
        logResults: true
      }
    };
    const collections = seedConfig.collections;

    // Local Promise handlers

    const onSuccessComplete = () => {
      if (options.logResults) {
        console.log();
        console.log(chalk.green('Database Seeding: Mongo Seed complete!'));
        console.log();
      }

      return resolve();
    }

    const onError = (err) => {
      if (options.logResults) {
        console.log();
        console.log(chalk.red('Database Seeding: Mongo Seed Failed!'));
        console.log(chalk.red('Database Seeding: ' + err));
        console.log();
      }

      return reject(err);
    }

    if (!collections.length) {
      return resolve();
    }

    let seeds = collections
      .filter((collection) => {
        return collection.model;
      });

    // Use the reduction pattern to ensure we process seeding in desired order.
    seeds.reduce((p, item) => {
        return p.then(() => {
          return startSeeding(item, options);
        });
      }, Promise.resolve()) // start with resolved promise for initial previous (p) item
      .then(onSuccessComplete)
      .catch(onError);
  });
}

const startSeeding = (collection, options) => {
  // Merge options with collection options
  options = _.merge(options || {}, collection.options || {});

  return new Promise((resolve, reject) => {
    const Model = mongoose.model(collection.model);
    const docs = collection.docs;

    const skipWhen = collection.skip ? collection.skip.when : null;

    console.log(chalk.bold.yellow('Database Seeding: ' + collection.model + ' collection started'));

    if (!Model.seed) {
      return reject(new Error('Database Seeding: Invalid Model Configuration - ' + collection.model + '.seed() not implemented'));
    }

    if (!docs || !docs.length) {
      return resolve();
    }

    const skipCollection = () => {
      return new Promise((resolve, reject) => {
        if (!skipWhen) {
          return resolve(false);
        }

        Model
          .find(skipWhen)
          .exec((err, results) => {
            if (err) {
              return reject(err);
            }

            if (results && results.length) {
              return resolve(true);
            }

            return resolve(false);
          });
      });
    }

    const seedDocuments = (skipCollection) => {
      return new Promise((resolve, reject) => {
        const workload = docs
          .filter((doc) => {
            return doc.data;
          })
          .map((doc) => {
            return Model.seed(doc.data, {
              overwrite: doc.overwrite
            });
          });

        // Local Closures

        const onComplete = (responses) => {
          if (options.logResults) {
            responses.forEach((response) => {
              if (response.message) {
                console.log(chalk.magenta(response.message));
              }
            });
          }

          console.log(chalk.bold.yellow('Database Seeding: ' + collection.model + ' collection complete'));

          return resolve();
        }

        const onError = (err) => {
          return reject(err);
        }

        if (skipCollection) {
          return onComplete([{
            message: chalk.bold.yellow('Database Seeding: ' + collection.model + ' collection skipped')
          }]);
        }

        Promise.all(workload)
          .then(onComplete)
          .catch(onError);

      });
    }

    // First check if we should skip this collection
    // based on the collection's "skip.when" option.
    // NOTE: If it exists, "skip.when" should be a qualified
    // Mongoose query that will be used with Model.find().
    skipCollection()
      .then(seedDocuments)
      .then(() => {
        return resolve();
      })
      .catch((err) => {
        return reject(err);
      });
  });
}

inititalSeedSetup();
