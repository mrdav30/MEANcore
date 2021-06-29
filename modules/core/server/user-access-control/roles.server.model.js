import async from 'async';
import mongoose from 'mongoose';
import _ from 'lodash';
const Schema = mongoose.Schema;
import chalk from 'chalk';

const rolesSchema = new Schema({
  name: {
    type: String,
    unique: true,
    trim: true
  },
  featurePermissions: {
    type: [String]
  }
});

rolesSchema.statics = {
  /**
   * Seeds the Features collection with document (Feature)
   * and provided options.
   */
  seed(doc, options) {
    const Roles = mongoose.model('Roles'),
      Features = mongoose.model('Features');

    return new Promise((resolve, reject) => {
      const skipDocument = () => {
        return new Promise((resolve, reject) => {
          Roles
            .findOne({
              name: doc.name
            })
            .exec((err, existing) => {
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

              existing.remove((err) => {
                if (err) {
                  return reject(err);
                }

                return resolve(false);
              });
            });
        });
      }

      const add = (skip) => {
        return new Promise((resolve, reject) => {

          if (skip) {
            return resolve({
              message: chalk.yellow('Database Seeding: Role\t\t' + doc.name + ' skipped')
            });
          }

          async.series([
            (callback) => {
              let permissionIds = [];
              async.each(doc.featurePermissions, (featurePermission, done) => {
                const featureName = _.split(featurePermission, ':')[0],
                  permissionName = _.split(featurePermission, ':')[1];

                Features.findOne({
                    name: {
                      $regex: new RegExp(_.escapeRegExp(featureName)),
                      $options: 'i'
                    }
                  },
                  (err, result) => {
                    if (err) {
                      return done(err)
                    } else if (result) {
                      async.each(result.permissions, (permission, cb) => {
                        if (permission.name === permissionName) {
                          permissionIds.push(permission.perm_id);
                        }
                        cb(null);
                      }, () => {
                        done(null);
                      });
                    } else {
                      done(null);
                    }
                  })
              }, (err) => {
                if (err) {
                  return callback(err)
                }

                doc.featurePermissions = permissionIds;

                callback(null);
              })
            },
            (callback) => {
              let role = new Roles(doc);

              role.save((err) => {
                if (err) {
                  return callback(err)
                }

                callback(null);
              });
            }
          ], (err) => {
            if (err) {
              return reject(err);
            }

            return resolve({
              message: 'Database Seeding: Role\t\t' + doc.name + ' added'
            });
          })
        });
      }

      skipDocument()
      .then(add)
      .then((response) => {
        return resolve(response);
      })
      .catch(function (err) {
        return reject(err);
      });
    });
  }
}

mongoose.model('Roles', rolesSchema);
