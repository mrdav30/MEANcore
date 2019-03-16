'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function (password) {
  return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your email'],
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  username: {
    type: String,
    unique: true,
    required: 'Please fill in a username',
    trim: true
  },
  password: {
    type: String,
    default: '',
    validate: [validateLocalStrategyPassword, 'Password should be longer']
  },
  salt: {
    type: String
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerData: {},
  additionalProvidersData: {},
  appName: String,
  roles: {
    type: [{
      type: [String]
    }],
    default: ['user']
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* for security validation to prevent hack attempts */
  knownIPAddresses: {
    type: [String],
    default: []
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
}, {
  strict: false //set to strict to allow modules to override user schema for account settings
});

UserSchema.index({
  _id: 1,
  roles: 1
}, {
  unique: true
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.password.length > 6) {
    this.salt = Buffer.from(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

UserSchema.statics.findUser = function (_id, callback) {
  var _this = this;

  _this.findOne({
    _id: id
  }).exec(function (err, user) {
    if (err) {
      return callback(err);
    } else if (!user) {
      return callback('Failed to load User ' + _id);
    }
    callback(null, user);
  });
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var _this = this;
  var possibleUsername = username + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function (err, user) {
    if (err) {
      callback(null);
    } else if (!user) {
      callback(null, possibleUsername);
    } else {
      return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
    }
  });
};

mongoose.model('User', UserSchema);
