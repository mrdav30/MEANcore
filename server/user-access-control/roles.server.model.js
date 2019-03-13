'use strict';
var async = require('async'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  permissionsModel = require('./permissions.server.model'),
  User = mongoose.model('User'),
  Schema = mongoose.Schema;

var rolesSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  userIds: {
    type: [Number]
  },
  permissionIds: {
    type: [Number]
  }
});
var Roles = mongoose.model('Roles', rolesSchema);

var service = {};

service.getAll = getAll;
service.create = create;
service.update = update;
service.delete = _delete;
service.connectPermission = connectPermission;
service.disconnectPermission = disconnectPermission;
service.addUser = addUser;
service.removeUser = removeUser;

module.exports = service;

// get roles + permissions/users
function getAll(callback) {
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
                return r.userIds;
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

function create(roleParam, callback) {
  Roles(roleParam).save(function (err, role) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    callback(null, role)
  })
};

function update(_id, roleParam, callback) {
  // fields to update
  var set = _.omit(roleParam, '_id');

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

function _delete(_id, callback) {
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

function connectPermission(role_id, perm_id, callback) {
  Roles.updateOne({
      _id: mongoose.Types.ObjectId(role_id)
    }, {
      $push: {
        permissionIds: perm_id
      }
    },
    function (err, role) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null, role)
    });
};

function disconnectPermission(role_id, perm_id, callback) {
  Roles.updateOne({
      _id: mongoose.Types.ObjectId(role_id)
    }, {
      $pullAll: {
        permissionIds: perm_id
      }
    },
    function (err, role) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null, role)
    });
};

function addUser(user_id, role_id, callback) {
  async.waterfall([
    function (cb) {
      Roles.updateOne({
          _id: mongoose.Types.ObjectId(role_id)
        }, {
          $push: {
            userIds: user_id
          }
        },
        function (err, role) {
          if (err) {
            return cb(err.name + ': ' + err.message);
          }

          cb(null, role);
        })
    },
    function (role, cb) {
      User.updateOne({
          _id: mongoose.Types.ObjectId(user_id)
        }, {
          $push: {
            roles: role
          }
        },
        function (err, user) {
          if (err) {
            return cb(err.name + ': ' + err.message);
          }

          cb(null, role, user)
        });
    }
  ], function (err, result) {
    if (err) {
      return callback(err);
    }

    callback(null, result);
  })
};

function removeUser(user_id, role_id, callback) {
  async.waterfall([
    function (cb) {
      Roles.updateOne({
          _id: mongoose.Types.ObjectId(role_id)
        }, {
          $pullAll: {
            userIds: user_id
          }
        },
        function (err, role) {
          if (err) {
            return cb(err.name + ': ' + err.message);
          }

          cb(null, role);
        })
    },
    function (role, cb) {
      User.updateOne({
          _id: mongoose.Types.ObjectId(user_id)
        }, {
          $pullAll: {
            roles: role
          }
        },
        function (err, user) {
          if (err) {
            return cb(err.name + ': ' + err.message);
          }

          cb(null, role, user)
        });
    }
  ], function (err, result) {
    if (err) {
      return callback(err);
    }

    callback(null, result);
  })
};
