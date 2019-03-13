'use strict';
var async = require('async'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  permissionsModel = require('./permissions.model'),
  User = mongoose.model('User'),
  Schema = mongoose.Schema;

var rolesSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  permissionIds: {
    type: [Number]
  }
});
var Roles = mongoose.model('Roles', roleSchema);

// get roles + permissions/users
exports.getRoles = function (callback) {
  async.waterfall([
      function (cb) {
        Roles.find({}).sort({
          _id: -1
        }).exec((err, roles) => {
          if (err) {
            return cb(err);
          }
          cb(null, roles);
        });
      },
      function (roles, cb) {
        async.each(roles, (role, done) => {
          let query = {
            _id: {
              $in: _.map(role, (r) => {
                return r.permissionIds;
              })
            }
          }
          permissionsModel.getAll(query, (err, permissions) => {
            if (err) {
              return done(err);
            }
            role.permissions = permissions ? permissions : [];
            done(null);
          });
        }, (err) => {
          if (err) {
            return cb(err);
          }
          cb(null, roles);
        });
      },
      function (roles, cb) {
        async.each(roles, (role, done) => {
          let query = {
            roles: {
              $in: _.map(role, (r) => {
                return r.name;
              })
            }
          }
          User.find(query, (err, users) => {
            if (err) {
              return done(err);
            }
            role.users = users ? users : [];
            done(null);
          })
        }, (err) => {
          if (err) {
            return cb(err);
          }
          cb(null, roles);
        });
      },
    ],
    function (err, roles) {
      if (err) {
        return callback(err);
      }

      callback(err, roles);
    });
};

exports.createRole = function (roleParam, callback) {
  Roles(roleParam).save(function (err, role) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    callback(null, role)
  })
};

exports.updateRole = function (_id, roleParam, callback) {
  // fields to update
  var set = _.omit(postParam, '_id');

  Roles.updateOne({
      _id: mongoose.Types.ObjectId(_id)
    }, {
      $set: set
    },
    function (err, role) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null, role)
    });
};

exports.deleteRole = function (_id, callback) {
  Roles.deleteOne({
      _id: mongoose.Types.ObjectId(_id)
    },
    function (err) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null)
    });
};
