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
  featurePermissions: {
    type: [String]
  }
});

mongoose.model('Roles', rolesSchema);
