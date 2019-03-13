'use strict';
var mongoose = require('mongoose'),
  _ = require('lodash'),
  Schema = mongoose.Schema;

var rolesSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  permissionIds: {
    type: [Number]
  }
});
var Roles = mongoose.model('Roles', rolesSchema);

// get roles + permissions/users
exports.getRoles = function (callback) {
  Roles.find({}).sort({
    _id: -1
  }).exec((err, roles) => {
    if (err) {
      return callback(err);
    }

    callback(null, roles);
  });
};

exports.createRole = function (roleParam, callback) {
  Roles(roleParam).save(function (err, role) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    callback(null, role)
  })
};

exports.updateRole = function (_id, roleParam, callback) {
  // fields to update
  var set = _.omit(postParam, '_id');

  Roles.updateOne({
      _id: mongoose.Types.ObjectId(_id)
    }, {
      $set: set
    },
    function (err, role) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null, role)
    });
};

exports.deleteRole = function (_id, callback) {
  Roles.deleteOne({
      _id: mongoose.Types.ObjectId(_id)
    },
    function (err) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null)
    });
};
