'use strict';
var async = require('async'),
  _ = require('lodash'),
  rolesModel = require('./roles.server.model'),
  permissionsModel = require('./permissions.server.model'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.getRoles = function (req, res) {
  rolesModel.getAll(function (err, roles) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to retrieve roles'
      });
    }

    async.waterfall([
        function (cb) {
          if (roles.permissions) {
            async.each(roles, (role, done) => {
              let query = {
                _id: {
                  $in: _.map(role, (r) => {
                    return r.permissions;
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
          } else {
            cb(null, roles);
          }
        },
        function (roles, cb) {
          if (roles.users) {
            async.each(roles, (role, done) => {
              let query = {
                _id: {
                  $in: _.map(role, (r) => {
                    return r.users;
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
          } else {
            cb(null, roles);
          }
        },
      ],
      function (err, result) {
        if (err) {
          return res.status(500).send({
            error: 'Unable to retrieve roles'
          });
        }

        res.status(200).send(result);
      });
  });
};

exports.createRole = function (req, res) {
  rolesModel.create(req.body.role, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to create role'
      });
    }

    res.status(200).send(result);
  });
};

exports.updateRole = function (req, res) {
  rolesModel.update(req.params.role_id, req.body.role, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to modify role'
      });
    }

    res.status(200).send(result);
  });
};

exports.deleteRole = function (req, res) {
  rolesModel.delete(req.params.role_id, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to delete role'
      });
    }

    res.status(200).send(result);
  });
};

exports.connectPermissionWithRole = function (req, res) {
  rolesModel.connectPermission(req.params.role_id, req.params.perm_id, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to connect permission'
      });
    }

    res.status(200).send(result);
  });
};

exports.disconnectPermissionFromRole = function (req, res) {
  rolesModel.disconnectPermission(req.params.role_id, req.params.perm_id, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to disconnect permission'
      });
    }

    res.status(200).send(result);
  });
};

exports.addUserToRole = function (req, res) {
  rolesModel.addUser(req.params.user_id, req.params.role_id, function (err, role) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to add user to role'
      });
    }

    User.updateOne({
        _id: mongoose.Types.ObjectId(user_id)
      }, {
        $push: {
          roles: role
        }
      },
      function (err, user) {
        if (err) {
          return res.status(500).send({
            error: 'Unable to add user to role'
          });
        }

        res.status(200).send({
          role: role,
          user: user
        });
      });
  });
};

exports.removeUserFromRole = function (req, res) {
  rolesModel.removeUser(req.params.user_id, req.params.role_id, function (err, role) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to remove user from role'
      });
    }

    User.updateOne({
        _id: mongoose.Types.ObjectId(user_id)
      }, {
        $pullAll: {
          roles: role
        }
      },
      function (err, user) {
        if (err) {
          return res.status(500).send({
            error: 'Unable to remove user from role'
          });
        }

        res.status(200).send({
          role: role,
          user: user
        });
      });
  });
};
