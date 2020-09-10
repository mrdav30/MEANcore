import mongoose from 'mongoose';
import _ from 'lodash';
const Roles = mongoose.model('Roles');
const User = mongoose.model('User');

export function getRoles(req, res) {
  Roles.find().sort({
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
}

export function createRole(req, res) {
  Roles(req.body.role).save(function (err, role) {
    if (err) {
      return res.status(500).send({
        message: 'Unable to create role'
      });
    }

    res.status(200).send(role);
  });
}

export function updateRole(req, res) {
  // fields to update
  const set = _.omit(req.body.role, '_id');

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
}

export function deleteRole(req, res) {
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
}

export function connectPermissionWithRole(req, res) {
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
}

export function disconnectPermissionFromRole(req, res) {
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
}

export function addUserToRole(req, res) {
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
}

export function removeUserFromRole(req, res) {
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
}
