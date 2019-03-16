'use strict';
var async = require('async'),
  _ = require('lodash'),
  featuresModel = require('./features.server.model'),
  Roles = require('mongoose').model('Roles');

// Features

exports.getFeatures = function (req, res) {
  featuresModel.getAllFeatures({}, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to get features'
      });
    }

    res.status(200).send(result);
  });
};

exports.createFeature = function (req, res) {
  featuresModel.createFeature(req.body.feature, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to create feature'
      });
    }

    res.status(200).send(result);
  });
};

exports.updateFeature = function (req, res) {
  featuresModel.updateFeature(req.params.feature_id, req.body.feature, function (err) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to update feature'
      });
    }

    res.status(200).send();
  });
};

exports.deleteFeature = function (req, res) {
  featuresModel.deleteFeature(req.params.feature_id, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to delete feature'
      });
    }

    res.status(200).send(result);
  });
};

// Feature Permissions


exports.createPermission = function (req, res) {
  featuresModel.createPermission(req.params.feature_id, req.body.permission, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to create permission'
      });
    }

    res.status(200).send(result);
  });
};

exports.updatePermission = function (req, res) {
  featuresModel.updatePermission(req.params.permission_id, req.body.permission, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to update permission'
      });
    }

    res.status(200).send(result);
  });
};

exports.deletePermission = function (req, res) {
  featuresModel.deletePermission(req.params.feature_id, req.params.perm_id, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to delete permission'
      });
    }

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

function getMenuConfiguration(callback) {
  featuresModel.getAllFeatures({}, (err, features) => {
    async.each(features, (feature, done) => {
      if (feature.permissions.length) {
        Roles.find({
            permissions: {
              $in: _.map(feature.permissions, (permission) => {
                return permission._id
              })
            }
          }).select('name')
          .exec((err, roles) => {
            if (err) {
              return done(err);
            }

            feature.roles = _.map(roles, (role) => {
              return role.name;
            });
            delete feature.permissions;
            done(null);
          })
      } else {
        done(null);
      }
    }, (err) => {
      if (err) {
        return callback(err);
      }

      callback(null, features);
    });
  });
};
exports.getMenuConfiguration = getMenuConfiguration;
