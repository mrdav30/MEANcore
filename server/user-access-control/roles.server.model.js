'use strict';
var mongoose = require('mongoose'),
  _ = require('lodash'),
  Schema = mongoose.Schema,
  chalk = require('chalk');

var rolesSchema = new Schema({
  name: {
    type: String,
    unique: true,
    trim: true
  },
  featurePermissions: {
    type: [String]
  }
});


/**
 * Seeds the Features collection with document (Feature)
 * and provided options.
 */
rolesSchema.statics.seed = function (doc, options) {
  var Roles = mongoose.model('Roles'),
    Features = mongoose.model('Features');

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
        Roles
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
            message: chalk.yellow('Database Seeding: Role\t\t' + doc.name + ' skipped')
          });
        }

        var role = new Role(doc),
          permissionIds = [];

        _.forEach(role.featurePermissions, (featurePermission) => {
          // feature permissions should be set in config as feature:permission
          var featureName = _.split(featurePermission, ':')[0],
            permissionName = _.split(featurePermission, ':')[1];

          Features.find({
            name: featureName,
            permission: {
              name: permissionName
            }
          }, (err, doc) => {
            if (err) {
              return reject(err);
            }

            permissionIds.push(doc.perm_id);
          })
        });

        role.featurePermissions = permissionIds;

        role.save(function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({
            message: 'Database Seeding: Role\t\t' + role.name + ' added'
          });
        });

      });
    }

  });
}

mongoose.model('Roles', rolesSchema);
