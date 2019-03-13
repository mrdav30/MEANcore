'use strict';
var permissionsModel = require('./permissions.server.model');

exports.createPermission = function (req, res) {
  permissionsModel.create(req.body.permission, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to create permission'
      });
    }

    res.status(200).send(result);
  });
};

exports.updatePermission = function (req, res) {
  permissionsModel.update(req.params.perm_id, req.body.permission, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to update permission'
      });
    }

    res.status(200).send(result);
  });
};

exports.deletePermission = function (req, res) {
  permissionsModel.delete(req.params.perm_id, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to delete permission'
      });
    }

    res.status(200).send(result);
  });
};
