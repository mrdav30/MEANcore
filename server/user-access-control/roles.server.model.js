'use strict';
var mongoose = require('mongoose'),
  _ = require('lodash'),
  Schema = mongoose.Schema;

var rolesSchema = new Schema({
  name: {
    type: String,
    unique: true,
    trim: true
  },
  users: {
    type: [String]
  },
  permissions: {
    type: [String]
  }
});

var Roles = mongoose.model('Roles', rolesSchema);

var service = {};

service.getAll = getAll;
service.create = create;
service.update = update;
service.delete = _delete;
service.connectPermission = connectPermission;
service.disconnectPermission = disconnectPermission;
service.addUser = addUser;
service.removeUser = removeUser;

module.exports = service;


// get roles
function getAll(query, callback) {

  Roles.find(query).sort({
    _id: -1
  }).lean().exec((err, roles) => {
    if (err) {
      return callback(err);
    }

    callback(null, roles);
  })
};

function create(roleParam, callback) {
  Roles(roleParam).save(function (err, role) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    callback(null, role)
  })
};

function update(_id, roleParam, callback) {
  // fields to update
  var set = _.omit(roleParam, '_id');

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

function _delete(_id, callback) {
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

function connectPermission(role_id, perm_id, callback) {
  Roles.updateOne({
      _id: mongoose.Types.ObjectId(role_id)
    }, {
      $push: {
        permissions: perm_id
      }
    },
    function (err) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null)
    });
};

function disconnectPermission(role_id, perm_id, callback) {
  Roles.updateOne({
      _id: mongoose.Types.ObjectId(role_id)
    }, {
      $pull: {
        permissions: perm_id
      }
    },
    function (err) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null)
    });
};

function addUser(user_id, role_id, callback) {
  Roles.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(role_id)
    }, {
      $push: {
        users: user_id
      }
    },
    function (err, role) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null, role);
    })
};

function removeUser(user_id, role_id, callback) {
  Roles.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(role_id)
    }, {
      $pull: {
        users: user_id
      }
    },
    function (err, role) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null, role);
    })
};
