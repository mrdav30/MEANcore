'use strict';
var async = require('async'),
  _ = require('lodash'),
  errorHandler = require('../errors.server.controller'),
  rolesModel = require('./roles.server.model'),
  featuresModel = require('./features.server.model'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.getUACViewModel = function (req, res) {

  async.waterfall([
      function (cb) {
        rolesModel.getAll({}, function (err, roles) {
          if (err) {
            cb(err);
          }

          cb(null, roles);
        });
      },
      function (roles, cb) {
        async.each(roles, (role, done) => {
          if (role.permissions.length) {
            featuresModel.getAllFeatures({
              permissions: {
                $in: _.map(role.permissions)
              }
            }, (err, features) => {
              if (err) {
                return done(err);
              }
              role.features = _.forEach(features, (feature) => {
                return _.remove(feature.permissions, (permission) => {
                  const _id = permission._id.toString();
                  return !_.includes(role.permissions, _id)
                });
              })
              delete role.permissions;
              done(null);
            });
          } else {
            delete role.permissions;
            role.features = [];
            done(null);
          }
        }, (err) => {
          if (err) {
            return cb(err);
          }

          cb(null, roles);
        });
      },
      function (roles, cb) {
        async.each(roles, (role, done) => {
          if (role.users.length) {
            User.aggregate([{
                $match: {
                  _id: {
                    $in: _.map(role.users, (id) => {
                      return new mongoose.Types.ObjectId(id);
                    })
                  }
                }
              }, {
                $project: {
                  name: "$username",
                  displayName: 1,
                  email: 1
                }
              }])
              .exec((err, users) => {
                if (err) {
                  return done(err);
                }

                role.users = users ? users : [];
                done(null);
              })
          } else {
            role.users = [];
            done(null);
          }
        }, (err) => {
          if (err) {
            return cb(err);
          }

          cb(null, roles);
        });
      },
      function (roles, cb) {
        featuresModel.getAllFeatures({}, function (err, features) {
          if (err) {
            cb(err);
          }

          cb(null, roles, features);
        });
      },
      function (roles, features, cb) {
        User.aggregate([{
          $project: {
            name: "$username",
            displayName: 1,
            email: 1
          }
        }]).exec(function (err, users) {
          if (err) {
            cb(err);
          }

          cb(null, {
              roles: roles, 
              features: features, 
              users: users
            })
        })
      }
    ],
    function (err, result) {
      if (err) {
        return res.status(500).send({
          message: errorHandler.getErrorMessage(err)
        });
      }

      res.status(200).send(result);
    });

};
