'use strict';
var featuresModel = require('./features.server.model');

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
  featuresModel.updateFeature(req.params.feature_id, req.body.feature, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to update feature'
      });
    }

    res.status(200).send(result);
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


exports.createPermission = function(req, res) {
  featuresModel.createPermission(req.params.feature_id, req.body.permission, function(err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to create permission'
      });
    }

    res.status(200).send(result);
  });
};

exports.updatePermission = function(req, res) {
  featuresModel.updatePermission(req.params.permission_id, req.body.permission, function(err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to update permission'
      });
    }

    res.status(200).send(result);
  });
};

exports.deletePermission = function(req, res) {
  featuresModel.deletePermission(req.params.feature_id, req.params.perm_id, function(err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to delete permission'
      });
    }

    res.status(200).send(result);
  });
};