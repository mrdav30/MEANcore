'use strict';
var mongoose = require('mongoose'),
  _ = require('lodash'),
  Schema = mongoose.Schema;

var permissionsSchema = new Schema({
  name: {
    type: String,
    unique: true,
    trim: true
  }
});
var Permissions = mongoose.model('Permissions', permissionsSchema);

var service = {};

service.getAll = getAll;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getAll(query, callback) {
  Permissions.find(query).lean()
    .exec(function (err, permissions) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null, permissions);
    });
}

function create(permissionParam, callback) {
  Permissions(permissionParam).save(function (err, permission) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    callback(null, permission)
  })
};

function update(_id, permissionParam, callback) {
  // fields to update
  var set = _.omit(permissionParam, '_id');

  Permissions.updateOne({
      _id: mongoose.Types.ObjectId(_id)
    }, {
      $set: set
    },
    function (err, permission) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null, permission)
    });
};

function _delete(_id, callback) {
  Permissions.deleteOne({
      _id: mongoose.Types.ObjectId(_id)
    },
    function (err) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null)
    });
};
