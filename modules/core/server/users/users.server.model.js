/* eslint-disable no-useless-escape */
/**
 * Module dependencies.
 */
import async from 'async';
import _ from 'lodash';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import {
  randomBytes,
  pbkdf2Sync
} from 'crypto';
import config from '../../../../config/config.js';
import {
  setOwaspConfig,
  passwordTest
} from '../../../../shared_modules/owasp-password-strength-test.js';
import generatePassword from 'generate-password';
import chalk from 'chalk';

/**
 * A Validation function for local strategy properties
 */
const validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * User Schema
 */
const UserSchema = new Schema({
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
    unique: 'Username already exists',
    required: 'Please fill in a username',
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    default: ''
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
    type: [String],
    default: []
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

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.password.length > 6) {
    this.salt = Buffer.from(randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

UserSchema.methods = {
  /**
   * Create instance method for authenticating user
   */
  authenticate(password) {
    return this.password === this.hashPassword(password);
  },
  /**
   * Create instance method for hashing a password
   */
  hashPassword(password) {
    if (this.salt && password) {
      return pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('base64');
    } else {
      return password;
    }
  }
}

UserSchema.statics = {
  findUser(_id, callback) {
    const _this = this;

    _this.findOne({
      _id: _id
    }).exec((err, user) => {
      if (err) {
        return callback(err);
      } else if (!user) {
        return callback('Failed to load User ' + _id);
      }
      callback(null, user);
    });
  },
    /**
   * A Validation function for username
   * - at least 3 characters
   * - only a-z0-9_-.
   * - contain at least one alphanumeric character
   * - not in list of illegal usernames
   * - no consecutive dots: "." ok, ".." nope
   * - not begin or end with "."
   */
  validateUsername(config, username, callback) {
    const usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
    if (this.provider === 'local' &&
      (username && usernameRegex.test(username) && config.illegalUsernames.indexOf(username) < 0)) {
      const err = 'Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.';
      return callback(err);
    }
    
    return callback();
  },
  /**
   * Find possible not used username
   */
  findUniqueUsername(username, suffix, callback) {
    const _this = this;
    const possibleUsername = username + (suffix || '');

    _this.findOne({
      username: possibleUsername
    }, (err, user) => {
      if (err) {
        callback(null);
      } else if (!user) {
        callback(null, possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    });
  },
  /**
   * Generates a random passphrase that passes the owasp test
   * Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
   * NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
   */
  generateRandomPassphrase() {
    return new Promise((resolve, reject) => {
      let password = '';
      const repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

      // iterate until the we have a valid passphrase
      // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present
      while (password.length < 20 || repeatingCharacters.test(password)) {
        // build the random password
        password = generatePassword.generate({
          length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
          numbers: true,
          symbols: false,
          uppercase: true,
          excludeSimilarCharacters: true
        });

        // check if we need to remove any repeating characters
        password = password.replace(repeatingCharacters, '');
      }

      setOwaspConfig(config.owaspConfig);

      // Send the rejection back if the passphrase fails to pass the strength test
      if (passwordTest(password).errors.length) {
        reject(new Error('An unexpected problem occurred while generating the random passphrase'));
      } else {
        // resolve with the validated passphrase
        resolve(password);
      }
    });
  },
  /**
   * Seeds the User collection with document (User)
   * and provided options.
   */
  seed(doc, options) {
    const User = mongoose.model('User'),
      Roles = mongoose.model('Roles');

    return new Promise((resolve, reject) => {
      const skipDocument = () => {
        return new Promise((resolve, reject) => {
          User
            .findOne({
              username: doc.username
            })
            .exec((err, existing) => {
              if (err) {
                return reject(err);
              }

              if (!existing) {
                return resolve(false);
              }

              if (existing && !options.overwrite) {
                return resolve(true);
              }

              // Remove User (overwrite)

              existing.remove((err) => {
                if (err) {
                  return reject(err);
                }

                return resolve(false);
              });
            });
        });
      }

      const add = (skip) => {
        return new Promise((resolve, reject) => {

          if (skip) {
            return resolve({
              message: chalk.yellow('Database Seeding: User\t\t' + doc.username + ' skipped')
            });
          }

          User.generateRandomPassphrase()
            .then((passphrase) => {
              async.series([
                (callback) => {
                  let roleIds = [];
                  async.each(doc.roles, (role, done) => {
                    Roles.findOne({
                      name: new RegExp(_.escapeRegExp(role))
                    }, (err, result) => {
                      if (err) {
                        return done(err);
                      } else if (result) {
                        roleIds.push(result._id);
                        done(null);
                      } else {
                        done(null)
                      }
                    })
                  }, (err) => {
                    if (err) {
                      return callback(err);
                    }

                    doc.roles = roleIds;

                    callback(null);
                  })
                },
                (callback) => {
                  let user = new User(doc);

                  user.provider = 'local';
                  user.displayName = user.firstName + ' ' + user.lastName;
                  user.password = passphrase;

                  user.save((err) => {
                    if (err) {
                      return callback(err);
                    }

                    callback(null);
                  });
                }
              ], (err) => {
                if (err) {
                  return reject(err);
                }

                return resolve({
                  message: 'Database Seeding: User\t\t' + doc.username + ' added with password set to ' + passphrase
                });
              })
            })
            .catch((err) => {
              return reject(err);
            });
        });
      }

      skipDocument()
        .then(add)
        .then((response) => {
          return resolve(response);
        })
        .catch((err) => {
          return reject(err);
        });

    });
  }
}

mongoose.model('User', UserSchema);
