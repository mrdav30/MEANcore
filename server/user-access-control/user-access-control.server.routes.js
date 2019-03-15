'use strict';

var roles = require('./roles.server.controller'),
  features = require('./features.server.controller');

module.exports = function (app) {

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
  app.route('/api/uac/features').get(features.getFeatures);

  app.route('/api/uac/feature').post(features.createFeature);

  app.route('/api/uac/feature/:feature_id')
    .put(features.updateFeature)
    .delete(features.deleteFeature);

  // Permissions
  app.route('/api/uac/feature/:feature_id/permission/:perm_id')
    .post(features.createPermission)
    .delete(features.deletePermission);

  app.route('/api/uac/feature/:feature_id/permission')
    .put(features.updatePermission);
};
