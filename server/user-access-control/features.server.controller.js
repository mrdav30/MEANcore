'use strict';

var async = require('async'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  SequenceCounter = mongoose.model('SequenceCounter'),
  Features = mongoose.model('Features'),
  Roles = mongoose.model('Roles');

// Features

exports.createFeature = function (req, res) {
  Features(req.body.feature).save(function (err, feature) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to create feature'
      });
    }

    res.status(200).send(feature);
  });
};

exports.updateFeature = function (req, res) {
  // fields to update
  var set = _.omit(req.body.feature, '_id');

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
};

exports.deleteFeature = function (req, res) {
  Features.findOneAndDelete({
      _id: mongoose.Types.ObjectId(req.params.feature_id)
    },
    function (err, feature) {
      if (err) {
        return res.status(500).send({
          error: 'Unable to delete feature'
        });
      }

      // delete feature permissions from any assigned roles
      Roles.updateMany({
        featurePermissions: {
          $in: _.map(feature.get('permissions'), (permission) => {
            return permission.perm_id;
          })
        }
      }, (err) => {
        if (err) {
          return res.status(500).send({
            error: 'Unable to delete feature permissions from roles'
          });
        }

        res.status(200).send();
      })
    });
};

// Feature Permissions

exports.createPermission = function (req, res) {
  var permissionParms = req.body.permission;
  SequenceCounter.getValueForNextSequence('perm_id', (err, counter) => {
    if (err) {
      return res.status(500).send({
        error: 'Unable to create permission'
      });
    }

    permissionParms.perm_id = counter;

    Features.findOneAndUpdate({
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
};

exports.updatePermission = function (req, res) {
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
};

exports.deletePermission = function (req, res) {
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
        return res.status(500).send({
          error: 'Unable to delete permission'
        });
      }

      // pull permission from any assigned roles
      Roles.updateMany({
        permissions: {
          $in: req.params.perm_id
        }
      }, {
        $pull: {
          permissions: req.params.perm_id
        }
      }, (err) => {
        if (err) {
          return res.status(500).send({
            error: 'Unable to delete permission from roles'
          });
        }

        res.status(200).send();
      })
    });
};
