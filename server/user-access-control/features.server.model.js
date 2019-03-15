'use strict';
var mongoose = require('mongoose'),
  _ = require('lodash'),
  Schema = mongoose.Schema;

var featuresSchema = new Schema({
  name: {
    type: String,
    unique: true,
    trim: true
  },
  route: {
    type: String,
    unique: true,
    trim: true
  },
  permissions: {
    type: [String]
  }
});

var permissionsSchema = new Schema({
  featureId: {
    type: Number
  },
  name: {
    type: String,
    trim: true
  }
});
permissionsSchema.index({
  featureId: 1,
  name: 1
}, {
  unique: true
})
var Features = mongoose.model('Features', featuresSchema);
var Permissions = mongoose.model('Permissions', permissionsSchema);

var service = {};

service.getAllFeatures = getAllFeatures;
service.createFeature = createFeature;
service.updateFeature = updateFeature;
service.deleteFeature = _deleteFeature;
service.createPermission = createPermission;
service.updatePermission = updatePermission;
service.deletePermission = _deletePermission;

module.exports = service;

function getAllFeatures(query, callback) {
  Features.find(query).lean()
    .exec(function (err, features) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null, features);
    });
}

function createFeature(featuresParam, callback) {
  Features(featuresParam).save(function (err, feature) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    callback(null, feature)
  })
};

function updateFeature(_id, featuresParam, callback) {
  // fields to update
  var set = _.omit(featuresParam, '_id');

  Features.updateOne({
      _id: mongoose.Types.ObjectId(_id)
    }, {
      $set: set
    },
    function (err) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null)
    });
};

function _deleteFeature(_id, callback) {
  Features.deleteOne({
      _id: mongoose.Types.ObjectId(_id)
    },
    function (err) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null)
    });
};


function createPermission(feature_id, permissionsParam, callback) {
  permissionsParam.featureId = feature_id;

  Permissions(permissionsParam).save(function (err, permission) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    Features.updateOne({
        _id: mongoose.Types.ObjectId(feature_id)
      }, {
        $push: {
          permissions: permission._id
        }
      },
      function (err) {
        if (err) {
          return callback(err.name + ': ' + err.message);
        }

        callback(null, permission)
      });
  });
};

function updatePermission(_id, permissionsParam, callback) {
  // fields to update
  var set = _.omit(permissionsParam, '_id');

  Permissions.updateOne({
      _id: mongoose.Types.ObjectId(_id)
    }, {
      $set: set
    },
    function (err) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null)
    });
};

function _deletePermission(feature_id, perm_id, callback) {
  Features.updateOne({
    _id: mongoose.Types.ObjectId(feature_id)
  }, {
    $pull: {
      permissions: perm_id
    }
  },
  function (err) {
    if (err) {
      return callback(err.name + ': ' + err.message);
    }

    Permissions.deleteOne({
      _id: mongoose.Types.ObjectId(perm_id),
      featureId: feature_id
    },
    function (err) {
      if (err) {
        return callback(err.name + ': ' + err.message);
      }

      callback(null)
    });
  });
};
