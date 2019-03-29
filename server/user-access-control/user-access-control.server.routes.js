'use strict';

var uac = require('./user-access-control.server.controller'),
  roles = require('./roles.server.controller'),
  features = require('./features.server.controller'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  userAuth = require(path.resolve('./server/users/users.authorization.server.controller'));

module.exports = function (app) {

  // Dashboard viewmodel
  app.use(['/uac'], userAuth.hasAuthorization(['admin'], config.appBase));

  app.route('/api/uac/view').get(uac.getViewModel);

  // Return uac menu configuration
  app.route('/api/uac/config').get(uac.getConfiguration);

  // Roles
  app.route('/api/uac/roles').get(roles.getRoles)

  app.route('/api/uac/role').post(roles.createRole);

  app.route('/api/uac/role/:role_id')
    .put(roles.updateRole)
    .delete(roles.deleteRole);

  app.route('/api/uac/role/:role_id/permission/:perm_id')
    .post(roles.connectPermissionWithRole)
    .delete(roles.disconnectPermissionFromRole);

  app.route('/api/uac/role/:role_id/user/:user_id')
    .post(roles.addUserToRole)
    .delete(roles.removeUserFromRole);

  // Features
  app.route('/api/uac/feature').post(features.createFeature);

  app.route('/api/uac/feature/:feature_id')
    .put(features.updateFeature)
    .delete(features.deleteFeature);

  // Permissions
  app.route('/api/uac/feature/:feature_id/permission').post(features.createPermission)

  app.route('/api/uac/feature/:feature_id/permission/:perm_id')
    .delete(features.deletePermission);

  app.route('/api/uac/feature/:feature_id/permission')
    .put(features.updatePermission);
};
