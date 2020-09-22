import _ from 'lodash';
import mongoose from 'mongoose';
const SequenceCounter = mongoose.model('SequenceCounter');
const Features = mongoose.model('Features');
const Roles = mongoose.model('Roles');

// Features

export function createFeature (req, res) {
  Features(req.body.feature).save(function (err, feature) {
    if (err) {
      return res.status(200).send({
        message: 'Unable to create feature',
        msgType: 'error'
      });
    }

    res.status(200).send(feature);
  });
}

export function updateFeature (req, res) {
  // fields to update
  const set = _.omit(req.body.feature, '_id');

  Features.updateOne({
      _id: mongoose.Types.ObjectId(req.params.feature_id)
    }, {
      $set: set
    },
    function (err) {
      if (err) {
        return res.status(500).send({
          error: 'Unable to update feature'
        });
      }

      res.status(200).send();
    });
}

export function deleteFeature (req, res) {
  Features.findOneAndDelete({
      _id: mongoose.Types.ObjectId(req.params.feature_id)
    },
    function (err, feature) {
      if (err) {
        return res.status(200).send({
          message: 'Unable to delete feature',
          msgType: 'error'
        });
      }

      let permissions = feature.get('permissions');
      if (permissions.length > 0) {
        // delete feature permissions from any assigned roles
        Roles.updateMany({
          featurePermissions: {
            $in: _.map(permissions, (permission) => {
              return permission.perm_id;
            })
          }
        }, {
          $pull: {
            featurePermissions: {
              $in: _.map(permissions, (permission) => {
                return permission.perm_id;
              })
            }
          }
        }, (err) => {
          if (err) {
            return res.status(200).send({
              message: 'Unable to delete feature permissions from roles',
              msgType: 'error'
            });
          }

          res.status(200).send();
        })
      } else {
        res.status(200).send();
      }
    });
}

// Feature Permissions

export function createPermission (req, res) {
  const permissionParms = req.body.permission;
  SequenceCounter.getValueForNextSequence('perm_id', (err, counter) => {
    if (err) {
      return res.status(500).send({
        error: 'Unable to create permission'
      });
    }

    permissionParms.perm_id = counter;

    Features.updateOne({
        _id: mongoose.Types.ObjectId(req.params.feature_id)
      }, {
        $addToSet: {
          permissions: permissionParms
        }
      },
      function (err) {
        if (err) {
          return res.status(500).send({
            error: 'Unable to create permission'
          });
        }

        res.status(200).send({
          perm_id: permissionParms.perm_id
        });
      });
  });
}

export function updatePermission (req, res) {
  Features.updateOne({
      permissions: {
        $in: {
          perm_id: req.params.permission_id
        }
      }
    }, {
      $set: req.body.permission
    },
    function (err) {
      if (err) {
        return res.status(500).send({
          error: 'Unable to update permission'
        });
      }

      res.status(200).send();
    });
}

export function deletePermission (req, res) {
  Features.updateOne({
      _id: mongoose.Types.ObjectId(req.params.feature_id)
    }, {
      $pull: {
        permissions: {
          perm_id: req.params.perm_id
        }
      }
    },
    function (err) {
      if (err) {
        return res.status(200).send({
          message: 'Unable to delete permission',
          msgType: 'error'
        });
      }

      // pull permission from any assigned roles
      Roles.updateMany({
        featurePermissions: {
          $in: req.params.perm_id
        }
      }, {
        $pull: {
          featurePermissions: req.params.perm_id
        }
      }, (err) => {
        if (err) {
          return res.status(200).send({
            messsage: 'Unable to delete permission from roles',
            msgType: 'error'
          });
        }

        res.status(200).send();
      })
    });
}
