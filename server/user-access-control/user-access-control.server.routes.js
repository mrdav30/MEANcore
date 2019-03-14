'use strict';

var roles = require('./roles.server.controller');
var permissions = require('./permissions.server.controller');

module.exports = function (app) {

  // Roles
  app.route('/api/uac/roles')
    .get(roles.getRoles)

  app.route('/api/uac/role')
    .post(roles.createRole);

  app.route('/api/uac/role/:role_id')
    .put(roles.updateRole)
    .delete(roles.deleteRole);

  app.route('/api/uac/role/:role_id/permission/:perm_id')
    .post(roles.connectPermissionWithRole)
    .delete(roles.disconnectPermissionFromRole);

  app.route('/api/uac/role/:role_id/user/:user_id')
    .post(roles.addUserToRole)
    .delete(roles.removeUserFromRole);

  // Permissions

  app.route('/api/uac/permissions')
  .get(permissions.getPermissions);

  app.route('/api/uac/permission')
    .post(permissions.createPermission);

  app.route('/api/uac/permission/:perm_id')
    .put(permissions.updatePermission)
    .delete(permissions.deletePermission);
};
