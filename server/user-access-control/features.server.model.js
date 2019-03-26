'use strict';

var mongoose = require('mongoose'),
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
  permissions: [{
    perm_id: {
      type: String
    },
    name: {
      type: String,
      unique: true,
      trim: true
    }
  }]
});

mongoose.model('Features', featuresSchema);
