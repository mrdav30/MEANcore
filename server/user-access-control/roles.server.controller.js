'use strict';
var mongoose = require('mongoose'),
  Roles = mongoose.model('Roles'),
  User = mongoose.model('User');

exports.getRoles = function (req, res) {
  Roles.find(query).sort({
      _id: -1
    })
    .lean()
    .exec((err, roles) => {
      if (err) {
        return res.status(500).send({
          message: 'Unable to retrieve roles'
        });
      }

      res.status(200).send(roles);
    });
};

exports.createRole = function (req, res) {
  Roles(req.body.role).save(function (err, role) {
    if (err) {
      return res.status(500).send({
        message: 'Unable to create role'
      });
    }

    res.status(200).send(role);
  });
};

exports.updateRole = function (req, res) {
  // fields to update
  var set = _.omit(req.body.role, '_id');

  Roles.updateOne({
      _id: mongoose.Types.ObjectId(req.params.role_id)
    }, {
      $set: set
    },
    function (err, role) {
      if (err) {
        return res.status(500).send({
          message: 'Unable to modify role'
        });
      }

      res.status(200).send(role);
    });
};

exports.deleteRole = function (req, res) {
  Roles.deleteOne({
      _id: mongoose.Types.ObjectId(req.params.role_id)
    },
    function (err) {
      if (err) {
        return res.status(500).send({
          message: 'Unable to delete role'
        });
      }

      User.updateMany({
        roles: {
          $in: req.params.role_id
        }
      }, {
        $pull: {
          roles: req.params.role_id
        }
      }, (err) => {
        if (err) {
          return res.status(500).send({
            message: 'Unable to remove role from user'
          });
        }

        res.status(200).send();
      })
    });
};

exports.connectPermissionWithRole = function (req, res) {
  Roles.updateOne({
      _id: mongoose.Types.ObjectId(req.params.role_id)
    }, {
      $addToSet: {
        featurePermissions: req.params.perm_id
      }
    },
    function (err) {
      if (err) {
        return res.status(500).send({
          message: 'Unable to connect permission'
        });
      }

      res.status(200).send();
    });
};

exports.disconnectPermissionFromRole = function (req, res) {
  Roles.updateOne({
      _id: mongoose.Types.ObjectId(req.params.role_id)
    }, {
      $pull: {
        featurePermissions: req.params.perm_id
      }
    },
    function (err) {
      if (err) {
        return res.status(500).send({
          message: 'Unable to disconnect permission'
        });
      }

      res.status(200).send();
    });
};

exports.addUserToRole = function (req, res) {
  User.updateOne({
      _id: mongoose.Types.ObjectId(req.params.user_id)
    }, {
      $addToSet: {
        roles: req.params.role_id
      }
    },
    function (err) {
      if (err) {
        return res.status(500).send({
          message: 'Unable to add role to user'
        });
      }

      res.status(200).send();
    });
};

exports.removeUserFromRole = function (req, res) {
  User.updateOne({
      _id: mongoose.Types.ObjectId(req.params.user_id)
    }, {
      $pull: {
        roles: req.params.role_id
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
};
