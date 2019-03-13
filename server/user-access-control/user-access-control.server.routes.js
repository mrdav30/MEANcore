'use strict';

var users = require('../controllers/users.controller');
var roles = require('../controllers/roles.controller');
var apps = require('../controllers/apps.controller');

module.exports = function (app) {

  // Roles
  app.route('/api/roles')
    .get(roles.getRoles)

  app.route('/api/role')
    .post(roles.createRole);

  app.route('/api/role/:role_id')
    .get(roles.getRole)
    .put(roles.updateRole)
    .delete(roles.deleteRole);

  app.route('/api/role/:role_id/user/')
    .post(users.addUserToRole);

  app.route('/api/role/:role_id/user/:user_id')
    .delete(users.removeUserFromRole);

  app.route('/api/role/:role_id/users/')
    .post(users.addUsersToRole);

  // Permissions

  app.route('/api/permission')
    .post(apps.createPermission);

  app.route('/api/permission/:perm_id')
    .put(apps.updatePermission)
    .delete(apps.deletePermission);

  app.route('/api/role/:role_id/permission/:perm_id')
    .post(apps.connectPermissionWithRole)
    .delete(apps.disconnectPermissionFromRole);
};
