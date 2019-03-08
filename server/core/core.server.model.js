'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Core Config Schema
 */
var CoreConfigSchema = new Schema({
  menuConfig: [{
    label: String,
    route: String,
    roles: [String],
    permissions: [String],
    visible: Boolean
  }]
}, {
  strict: false //set to strict to allow modules to override config schema for config settings
});

CoreConfigSchema.statics.getAll = function (callback) {
  var _this = this;

  _this.find({}).exec(function (err, config) {
    if (err) {
      return callback(err);
    } else if (!config) {
      return callback('Failed to load Config');
    } else {
      callback(null, config);
    }
  });
};

mongoose.model('CoreConfig', CoreConfigSchema);
