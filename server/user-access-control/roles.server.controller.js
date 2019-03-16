'use strict';
var mongoose = require('mongoose'),
  rolesModel = require('./roles.server.model'),
  User = mongoose.model('User');

exports.getRoles = function (req, res) {
  rolesModel.getAll({}, function (err, roles) {
    if (err) {
      return res.status(500).send({
        message: 'Unable to retrieve roles'
      });
    }

    res.status(200).send(roles);
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

    User.updateOne({
        _id: mongoose.Types.ObjectId(req.params.user_id)
      }, {
        $push: {
          roles: role.get('name')
        }
      },
      function (err) {
        if (err) {
          return res.status(500).send({
            message: 'Unable to add role to user'
          });
        }

        User.aggregate([{
            $match: {
              _id: mongoose.Types.ObjectId(req.params.user_id)
            }
          }, {
            $project: {
              name: "$username",
              displayName: 1,
              email: 1
            }
          }])
          .exec(
            function (err, user) {
              if (err) {
                return res.status(500).send({
                  message: 'Unable to add user to role'
                });
              }

              res.status(200).send({
                user: user[0]
              });
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

    User.updateOne({
        _id: mongoose.Types.ObjectId(req.params.user_id)
      }, {
        $pull: {
          roles: role.name
        }
      },
      function (err) {
        if (err) {
          return res.status(500).send({
            message: 'Unable to remove role from user'
          });
        }

        res.status(200).send();
      });
  });
};
