import { seedDB } from '../config';
import { model } from 'mongoose';
import _ from 'lodash';
import { bold, yellow, magenta } from 'chalk';

const _start = start;
export { _start as start };

function start(seedConfig) {
  return new Promise(function (resolve, reject) {
    console.log(bold.green('Seeding ' + process.env.NODE_ENV + " databases"));

    seedConfig = seedConfig || {};

    const options = seedConfig.options || (seedDB ? _.clone(seedDB.options, true) : {});
    const collections = seedConfig.collections || (seedDB ? _.clone(seedDB.collections, true) : []);

    if (!collections.length) {
      return resolve();
    }

    let seeds = collections
      .filter(function (collection) {
        return collection.model;
      });

    // Use the reduction pattern to ensure we process seeding in desired order.
    seeds.reduce(function (p, item) {
        return p.then(function () {
          return seed(item, options);
        });
      }, Promise.resolve()) // start with resolved promise for initial previous (p) item
      .then(onSuccessComplete)
      .catch(onError);

    // Local Promise handlers

    function onSuccessComplete() {
      if (options.logResults) {
        console.log();
        console.log(bold.green('Database Seeding: Mongo Seed complete!'));
        console.log();
      }

      return resolve();
    }

    function onError(err) {
      if (options.logResults) {
        console.log();
        console.log(bold.red('Database Seeding: Mongo Seed Failed!'));
        console.log(bold.red('Database Seeding: ' + err));
        console.log();
      }

      return reject(err);
    }

  });
}

function seed(collection, options) {
  // Merge options with collection options
  options = _.merge(options || {}, collection.options || {});

  return new Promise(function (resolve, reject) {
    const Model = model(collection.model);
    const docs = collection.docs;

    const skipWhen = collection.skip ? collection.skip.when : null;

    console.log(yellow('Database Seeding: ' + collection.model + ' collection started'));

    if (!Model.seed) {
      return reject(new Error('Database Seeding: Invalid Model Configuration - ' + collection.model + '.seed() not implemented'));
    }

    if (!docs || !docs.length) {
      return resolve();
    }

    // First check if we should skip this collection
    // based on the collection's "skip.when" option.
    // NOTE: If it exists, "skip.when" should be a qualified
    // Mongoose query that will be used with Model.find().
    skipCollection()
      .then(seedDocuments)
      .then(function () {
        return resolve();
      })
      .catch(function (err) {
        return reject(err);
      });

    function skipCollection() {
      return new Promise(function (resolve, reject) {
        if (!skipWhen) {
          return resolve(false);
        }

        Model
          .find(skipWhen)
          .exec(function (err, results) {
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

    function seedDocuments(skipCollection) {
      return new Promise(function (resolve, reject) {

        if (skipCollection) {
          return onComplete([{
            message: yellow('Database Seeding: ' + collection.model + ' collection skipped')
          }]);
        }

        const workload = docs
          .filter(function (doc) {
            return doc.data;
          })
          .map(function (doc) {
            return Model.seed(doc.data, {
              overwrite: doc.overwrite
            });
          });

        Promise.all(workload)
          .then(onComplete)
          .catch(onError);

        // Local Closures

        function onComplete(responses) {
          if (options.logResults) {
            responses.forEach(function (response) {
              if (response.message) {
                console.log(magenta(response.message));
              }
            });
          }

          console.log(yellow('Database Seeding: ' + collection.model + ' collection complete'));

          return resolve();
        }

        function onError(err) {
          return reject(err);
        }
      });
    }
  });
}
