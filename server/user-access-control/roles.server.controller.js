'use strict';
var async = require('async'),
  _ = require('lodash'),
  rolesModel = require('./roles.server.model'),
  featuresModel = require('./features.server.model'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.getRoles = function (req, res) {
  rolesModel.getAll(function (err, roles) {
    if (err) {
      return res.status(500).send({
        message: 'Unable to retrieve roles'
      });
    }

    async.waterfall([
        function (cb) {
          async.each(roles, (role, done) => {
            if (role.features.length) {
              featuresModel.getAll({
                _id: {
                  $in: _.map(role.features)
                }
              }, (err, features) => {
                if (err) {
                  return done(err);
                }
                role.features = features ? features : [];
                done(null);
              });
            } else {
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
                  role.users = users;
                  done(null);
                })
            } else {
              done(null);
            }
          }, (err) => {
            if (err) {
              return cb(err);
            }

            cb(null, roles);
          });
        }
      ],
      function (err, result) {
        if (err) {
          return res.status(500).send({
            message: 'Unable to retrieve roles'
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
        message: 'Unable to create role'
      });
    }

    res.status(200).send(result);
  });
};

exports.updateRole = function (req, res) {
  rolesModel.update(req.params.role_id, req.body.role, function (err, result) {
    if (err) {
      return res.status(500).send({
        message: 'Unable to modify role'
      });
    }

    res.status(200).send(result);
  });
};

exports.deleteRole = function (req, res) {
  rolesModel.delete(req.params.role_id, function (err, result) {
    if (err) {
      return res.status(500).send({
        message: 'Unable to delete role'
      });
    }

    res.status(200).send(result);
  });
};

exports.connectPermissionWithRole = function (req, res) {
  rolesModel.connectPermission(req.params.role_id, req.params.perm_id, function (err) {
    if (err) {
      return res.status(500).send({
        message: 'Unable to connect permission'
      });
    }

    res.status(200).send();
  });
};

exports.disconnectPermissionFromRole = function (req, res) {
  rolesModel.disconnectPermission(req.params.role_id, req.params.perm_id, function (err) {
    if (err) {
      return res.status(500).send({
        message: 'Unable to disconnect permission'
      });
    }

    res.status(200).send();
  });
};

exports.addUserToRole = function (req, res) {
  rolesModel.addUser(req.params.user_id, req.params.role_id, function (err, role) {
    if (err) {
      return res.status(500).send({
        message: 'Unable to add user to role'
      });
    }

    User.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.params.user_id)
      }, {
        $push: {
          roles: role.get('name')
        }
      },
      function (err, user) {
        if (err) {
          return res.status(500).send({
            message: 'Unable to add user to role'
          });
        }

        // remove sensitive data
        delete user.password;
        delete user.salt;

        res.status(200).send({
          user: user
        });
      });
  });
};

exports.removeUserFromRole = function (req, res) {
  rolesModel.removeUser(req.params.user_id, req.params.role_id, function (err, role) {
    if (err) {
      return res.status(500).send({
        message: 'Unable to remove user from role'
      });
    }

    User.findOneAndUpdate({
        _id: mongoose.Types.ObjectId(req.params.user_id)
      }, {
        $pullAll: {
          roles: role
        }
      },
      function (err, user) {
        if (err) {
          return res.status(500).send({
            message: 'Unable to remove user from role'
          });
        }

        // remove sensitive data
        delete user.password;
        delete user.salt;

        res.status(200).send({
          role: role,
          user: user
        });
      });
  });
};
