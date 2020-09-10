import {
  getViewModel,
  getConfiguration
} from './user-access-control.server.controller.js';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  connectPermissionWithRole,
  disconnectPermissionFromRole,
  addUserToRole,
  removeUserFromRole
} from './roles.server.controller.js';
import {
  createFeature,
  updateFeature,
  deleteFeature,
  createPermission,
  deletePermission,
  updatePermission
} from './features.server.controller.js';
import config from '../../config/config.js';
import * as userAuth from '../users/users.authorization.server.controller.js';

export default function (app) {

  // Dashboard viewmodel
  app.use(['/uac'], userAuth.hasAuthorization(['admin'], config.appBase));

  app.route('/api/uac/view').get(getViewModel);

  // Return uac menu configuration
  app.route('/api/uac/config').get(getConfiguration);

  // Roles
  app.route('/api/uac/roles').get(getRoles)

  app.route('/api/uac/role').post(createRole);

  app.route('/api/uac/role/:role_id')
    .put(updateRole)
    .delete(deleteRole);

  app.route('/api/uac/role/:role_id/permission/:perm_id')
    .post(connectPermissionWithRole)
    .delete(disconnectPermissionFromRole);

  app.route('/api/uac/role/:role_id/user/:user_id')
    .post(addUserToRole)
    .delete(removeUserFromRole);

  // Features
  app.route('/api/uac/feature').post(createFeature);

  app.route('/api/uac/feature/:feature_id')
    .put(updateFeature)
    .delete(deleteFeature);

  // Permissions
  app.route('/api/uac/feature/:feature_id/permission').post(createPermission)

  app.route('/api/uac/feature/:feature_id/permission/:perm_id')
    .delete(deletePermission);

  app.route('/api/uac/feature/:feature_id/permission')
    .put(updatePermission);
}
