'use strict';
var async = require('async'),
  rolesModel = require('./roles.model');

exports.getRoles = function (req, res) {
  rolesModel.getRoles(function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to retrieve roles'
      });
    }

    res.status(200).send(result);
  });
};

exports.createRole = function (req, res) {

  rolesModel.createRole(req.body.role, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to create role'
      });
    }

    res.status(200).send(result);
  });
};

exports.updateRole = function (req, res) {
  rolesModel.updateRole(req.params.role_id, req.body.role, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to modify role'
      });
    }

    res.status(200).send(result);
  });
};

exports.deleteRole = function (req, res) {
  rolesModel.deleteRole(req.params.role_id, function (err, result) {
    if (err) {
      return res.status(500).send({
        error: 'Unable to delete role'
      });
    }

    res.status(200).send(result);
  });
};
