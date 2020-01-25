'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  chalk = require('chalk'),
  async = require('async');

var featuresSchema = new Schema({
  name: {
    type: String,
    unique: true,
    trim: true
  },
  route: {
    type: String,
    unique: true,
    trim: true
  },
  order_priority: {
    type: Number,
    unique: true
  },
  permissions: [{
    perm_id: {
      type: String
    },
    name: {
      type: String,
      trim: true
    }
  }]
});

/**
 * Seeds the Features collection with document (Feature)
 * and provided options.
 */
featuresSchema.statics.seed = function (doc, options) {
  var Features = mongoose.model('Features'),
    SequenceCounter = mongoose.model('SequenceCounter');

  return new Promise(function (resolve, reject) {

    skipDocument()
      .then(add)
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });

    function skipDocument() {
      return new Promise(function (resolve, reject) {
        Features
          .findOne({
            name: doc.name
          })
          .exec(function (err, existing) {
            if (err) {
              return reject(err);
            }

            if (!existing) {
              return resolve(false);
            }

            if (existing && !options.overwrite) {
              return resolve(true);
            }

            // Remove User (overwrite)

            existing.remove(function (err) {
              if (err) {
                return reject(err);
              }

              return resolve(false);
            });
          });
      });
    }

    function add(skip) {
      return new Promise(function (resolve, reject) {

        if (skip) {
          return resolve({
            message: chalk.yellow('Database Seeding: Feature\t\t' + doc.name + ' skipped')
          });
        }

        var feature = new Features(doc);

        async.series([
          function (callback) {
            async.each(feature.permissions, (permission, done) => {
              SequenceCounter.getValueForNextSequence('perm_id', (err, result) => {
                if (err) {
                  return done(err)
                }

                permission.perm_id = result;
                done(null);
              });
            }, (err) => {
              if (err) {
                return callback(err);
              }

              callback(null);
            })
          },
          function (callback) {
            feature.save(function (err) {
              if (err) {
                return callback(err);
              }

              callback(null);
            });
          }
        ], (err) => {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Feature\t\t' + feature.name + ' added'
          });
        })
      });
    }
  });
}

mongoose.model('Features', featuresSchema);
