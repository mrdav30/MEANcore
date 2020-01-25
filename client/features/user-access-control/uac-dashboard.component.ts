import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  Title
} from '@angular/platform-browser';
import {
  map,
  find,
  findIndex
} from 'lodash';

import {
  environment
} from '../../environments/environment';

import {
  dynamicQuestionClasses
} from '../utils';

import {
  Role,
  Permission,
  User,
  Feature
} from './index';
import {
  DashboardState
} from './enums/uac-dashboard-state.enum';

import {
  UserAccessControlService
} from './services/user-access-control.service';

@Component({
  moduleId: module.id,
  selector: 'app-uac-dashboard',
  templateUrl: `./uac-dashboard.component.html`
})

export class UserAccessControlComponent implements OnInit {
  public message: string = null;
  public dashState: DashboardState = DashboardState.ShowingRoles;
  public roles: Role[] = [];
  public users: User[] = [];
  public features: Feature[] = [];
  public metaDataSet = false;
  public selectedRole: Role = null;
  public featuresSelected = false;
  public usersSelected = false;
  public selectedUser: User = null;
  public selectedFeature: Feature = null;
  public selectedPermission: Permission = null;
  public selectedUserAttribute: {} = null;
  public rolesMetadata: dynamicQuestionClasses.QuestionBase < any > [] = [];
  public featuresMetadata: dynamicQuestionClasses.QuestionBase < any > [] = [];
  public usersMetadata: dynamicQuestionClasses.QuestionBase < any > [] = [];
  public usersReadOnlyMetadata: dynamicQuestionClasses.QuestionBase < any > [] = [];
  public permissionsMetadata: dynamicQuestionClasses.QuestionBase < any > [] = [];

  constructor(
    private uacService: UserAccessControlService,
    private titleService: Title,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('UAC' + environment.metaTitleSuffix);
    this.uacService.getViewModel()
      .then(async (data) => {
        this.roles = data.roles as Role[];
        this.users = data.users as User[];
        this.features = data.features as Feature[];
        await this.setMetaData().then(() => {
          this.metaDataSet = true;
        });
      });
  }

  setMetaData(): Promise < void > {
    return new Promise((resolve) => {
      this.rolesMetadata = [
        new dynamicQuestionClasses.TextboxQuestion({
          key: 'name',
          label: 'Name',
          value: '',
          required: true,
          order: 1
        })
      ];

      this.featuresMetadata = [
        new dynamicQuestionClasses.TextboxQuestion({
          key: 'name',
          label: 'Name',
          value: '',
          required: true,
          order: 1
        }),
        new dynamicQuestionClasses.TextboxQuestion({
          key: 'route',
          label: 'Route',
          value: '',
          required: true,
          order: 2
        }),
        new dynamicQuestionClasses.NumberQuestion({
          key: 'order_priority',
          label: 'Order Priority',
          value: 0,
          required: true,
          order: 3
        })
      ];

      this.usersMetadata = [
        new dynamicQuestionClasses.DropdownQuestion({
          key: '_id',
          label: 'Username',
          create_label: 'Select an existing user',
          value: '',
          required: true,
          order: 1,
          options: map(this.users, (user) => {
            const obj = {
              key: user._id,
              value: user.name
            };
            return obj;
          })
        })
      ];

      this.usersReadOnlyMetadata = [
        new dynamicQuestionClasses.ReadonlyField({
          key: 'name',
          label: 'Username',
          value: '',
          required: false,
          order: 1
        }),
        new dynamicQuestionClasses.ReadonlyField({
          key: 'displayName',
          label: 'Full Name',
          value: '',
          required: false,
          order: 2
        }),
        new dynamicQuestionClasses.ReadonlyField({
          key: 'email',
          label: 'E-mail',
          value: '',
          required: false,
          order: 3
        })
      ];

      this.permissionsMetadata = [
        new dynamicQuestionClasses.TextboxQuestion({
          key: 'name',
          label: 'Name',
          value: '',
          required: true,
          order: 1
        })
      ];

      return resolve();
    });
  }

  setState(state: DashboardState): Promise < void > {
    return new Promise((resolve) => {
      this.dashState = state;
      switch (state) {
        case DashboardState.ShowingRoles:
          this.featuresSelected = false;
          this.selectedFeature = null;
          this.selectedRole = null;
          this.usersSelected = false;
          this.selectedUser = null;
          this.selectedPermission = null;
          break;
        case DashboardState.ShowingRolesExpanded:
          this.featuresSelected = false;
          this.selectedFeature = null;
          this.usersSelected = false;
          this.selectedUser = null;
          this.selectedPermission = null;
          break;
        case DashboardState.ShowingUsers:
          this.featuresSelected = false;
          this.selectedFeature = null;
          this.selectedPermission = null;
          break;
        case DashboardState.ShowingUser:
          this.featuresSelected = false;
          this.selectedFeature = null;
          this.usersSelected = true;
          this.selectedPermission = null;
          break;
        case DashboardState.ShowingFeatures:
          this.featuresSelected = true;
          this.selectedFeature = null;
          this.usersSelected = false;
          this.selectedUser = null;
          this.selectedPermission = null;
          break;
        case DashboardState.ShowingPermissions:
          this.featuresSelected = true;
          this.usersSelected = false;
          this.selectedUser = null;
          this.selectedPermission = null;
          break;
      }

      return resolve();
    });
  }

  onToggleList(list: any): void {
    if (list.name === 'features') {
      this.toggleFeatures();
    } else if (list.name === 'users') {
      this.toggleUsers();
    }
  }

  findItemByField(arr: any[], key: string, value: any) {
    const item = find(arr, (i) => i[key] === value);
    return item ? item : {};
  }

  setErrorMessage(section: string, message: string): void {
    this.message = message;
  }

  dismissMessage(): void {
    this.message = null;
  }

  // === Roles ===

  async onToggleRole(role: Role): Promise < void > {
    if (this.selectedRole === role) {
      await this.setState(DashboardState.ShowingRoles);
    } else {
      this.selectedRole = role;
      await this.setState(DashboardState.ShowingRolesExpanded);
    }
  }

  onCreateRole(role: Role): void {
    const roleIndex = findIndex(this.roles, (el) => el.name === role.name);
    if (roleIndex >= 0) {
      return this.setErrorMessage('Roles', 'Role already exists');
    } else {
      this.uacService.createRole(role)
        .then(data => {
          role._id = data._id;
          role.users = [];
          role.features = [];
          this.roles.unshift(role);
          this.selectedRole = null;
        }).catch(reason => this.setErrorMessage('Roles', reason));
    }
  }

  onModifyRole(role: Role): void {
    this.uacService.updateRole(role)
      .then(() => {
        const roleIndex = findIndex(this.roles, (el) => el._id === role._id);
        if (roleIndex >= 0) {
          this.roles[roleIndex] = role;
          this.selectedRole = null;
        }
      }).catch(reason => this.setErrorMessage('Roles', reason));
  }

  async onStartEditRole(): Promise < void > {
    await this.setState(DashboardState.ShowingRoles);
  }

  onDeleteRole(role: Role): void {
    this.uacService.deleteRole(role._id)
      .then(async () => {
        const roleIndex = findIndex(this.roles, (el) => el._id === role._id);
        if (roleIndex >= 0) {
          this.roles.splice(roleIndex, 1);
        }
        await this.setState(DashboardState.ShowingRoles);
      }).catch(reason => this.setErrorMessage('Roles', reason));
  }

  // === Features ===

  async toggleFeature(feature: Feature): Promise < void > {
    await this.setState(DashboardState.ShowingFeatures);
    if (this.selectedFeature !== feature) {
      const featureIndex = findIndex(this.features, (f) => f._id === feature._id);
      if (featureIndex >= 0) {
        this.selectedFeature = this.features[featureIndex];
      } else {
        this.selectedFeature = feature;
      }
      await this.setState(DashboardState.ShowingPermissions);
    }
  }

  async toggleFeatures(): Promise < void > {
    await this.setState(DashboardState.ShowingRolesExpanded);
    if (this.selectedRole && this.features) {
      this.featuresSelected = true;
      await this.setState(DashboardState.ShowingFeatures);
    }
  }

  onCreateFeature(feature: Feature): void {
    const featureIndex = findIndex(this.features, (el) => el.name === feature.name);
    if (featureIndex >= 0) {
      return this.setErrorMessage('Feature', 'Feature already exists');
    } else {
      this.uacService.createFeature(feature)
        .then(data => {
          feature._id = data._id;
          feature.permissions = [];
          this.features.unshift(feature);

          // update current menu ui
          this.uacService.alertFeatureChange();
        }).catch(reason => this.setErrorMessage('Feature ', reason));
    }
  }



  onModifyFeature(feature: Feature): void {
    this.uacService.updateFeature(feature)
      .then(() => {
        const featureIndex = findIndex(this.features, (f) => f._id === feature._id);
        if (featureIndex >= 0) {
          this.features[featureIndex].name = feature.name;
          this.features[featureIndex].route = feature.route;
        }

        // update current menu ui
        this.uacService.alertFeatureChange();
      }).catch(reason => this.setErrorMessage('Feature ', reason));
  }

  async startEditFeature(): Promise < void > {
    await this.setState(DashboardState.ShowingFeatures);
  }

  onDeleteFeature(feature: Feature): void {
    this.uacService.deleteFeature(feature._id)
      .then(async () => {
        const featureIndex = findIndex(this.features, (f) => f._id === feature._id);
        if (featureIndex >= 0) {
          this.features.splice(featureIndex, 1);
        }

        // need to remove association with role
        const roleFeatureIndex = findIndex(this.selectedRole.features, (f) => f._id === feature._id);
        if (this.selectedRole.features[roleFeatureIndex]) {
          this.selectedRole.features.splice(roleFeatureIndex, 1);
        }

        // update current menu ui
        this.uacService.alertFeatureChange();

        await this.setState(DashboardState.ShowingFeatures);
      }).catch(reason => this.setErrorMessage('Feature ', reason));
  }

  // === Permissions ===

  async onTogglePermission(perm: Permission): Promise < void > {
    await this.setState(DashboardState.ShowingPermissions);
    const featureIndex = findIndex(this.selectedRole.features, (f) => f._id === this.selectedFeature._id);
    const permIndex = findIndex(this.selectedRole.features[featureIndex].permissions, (el) => el.perm_id === perm.perm_id);
    if (permIndex < 0) {
      // role does not have permission enabled
      return;
    }
    if (this.selectedPermission !== perm) {
      this.selectedPermission = this.selectedRole.features[featureIndex].permissions[permIndex];
      await this.setState(DashboardState.ShowingPermissionAttributes);
    }
  }

  onCreatePermission(perm: Permission): void {
    const permIndex = findIndex(this.selectedFeature.permissions, (el) => el.name === perm.name);
    if (permIndex >= 0) {
      return this.setErrorMessage('Permission', 'Permission already exists');
    } else {
      this.uacService.createPermission(this.selectedFeature._id, perm)
        .then((data) => {
          perm.perm_id = data.perm_id;
          const featureIndex = findIndex(this.features, (f) => f._id === this.selectedFeature._id);
          this.features[featureIndex].permissions.unshift(perm);
        }).catch(reason => this.setErrorMessage('Permission ', reason));
    }
  }

  onModifyPermission(perm: Permission): void {
    this.uacService.modifyPermission(this.selectedFeature._id, perm)
      .then(() => {
        const featureIndex = findIndex(this.features, (f) => f._id === this.selectedFeature._id);
        const permIndex = findIndex(this.features[featureIndex].permissions, (el) => el.perm_id === perm.perm_id);
        this.features[featureIndex].permissions[permIndex].name = perm.name;
      }).catch(reason => this.setErrorMessage('Permission ', reason));
  }

  onDeletePermission(perm: Permission): void {
    this.uacService.deletePermission(this.selectedFeature._id, perm.perm_id)
      .then(async () => {
        const featureIndex = findIndex(this.features, (f) => f._id === this.selectedFeature._id);
        const permIndex = findIndex(this.features[featureIndex].permissions, (el) => el.perm_id === perm.perm_id);
        if (permIndex >= 0) {
          this.features[featureIndex].permissions.splice(permIndex, 1);
        }

        // need to remove association with role and feature
        const roleFeatureIndex = findIndex(this.selectedRole.features, (f) => f._id === this.selectedFeature._id);
        const rolePermIndex = findIndex(this.selectedRole.features[roleFeatureIndex].permissions, (el) => el.perm_id === perm.perm_id);
        if (rolePermIndex >= 0) {
          this.selectedRole.features[roleFeatureIndex].permissions.splice(rolePermIndex, 1);
        }
        if (this.selectedRole.features[roleFeatureIndex].permissions.length === 0) {
          this.selectedRole.features.splice(roleFeatureIndex, 1);
        }

        await this.setState(DashboardState.ShowingPermissions);
      }).catch(reason => this.setErrorMessage('Permission ', reason));
  }

  onAddPermissionToRole(perm: Permission): void {
    this.uacService.connectRoleWithPermission(this.selectedRole._id, perm.perm_id)
      .then(() => {
        const featureIndex = findIndex(this.selectedRole.features, (f) => f._id === this.selectedFeature._id);
        if (featureIndex < 0) {
          const newFeature = {
            _id: this.selectedFeature._id,
            name: this.selectedFeature.name,
            route: this.selectedFeature.route,
            order_priority: this.selectedFeature.order_priority,
            permissions: [perm]
          };
          this.selectedRole.features.push(newFeature);
        } else {
          this.selectedRole.features[featureIndex].permissions.push(perm);
        }
      }).catch(reason => this.setErrorMessage('Permission ', reason));
  }

  onRemovePermissionFromRole(perm: Permission): void {
    this.uacService.disconnectRoleFromPermission(this.selectedRole._id, perm.perm_id)
      .then(() => {
        const featureIndex = findIndex(this.selectedRole.features, (f) => f._id === this.selectedFeature._id);
        const permIndex = findIndex(this.selectedRole.features[featureIndex].permissions, (el) => el.perm_id === perm.perm_id);
        if (permIndex >= 0) {
          this.selectedRole.features[featureIndex].permissions.splice(permIndex, 1);
        }
        if (this.selectedRole.features[featureIndex].permissions.length === 0) {
          this.selectedRole.features.splice(featureIndex, 1);
        }
      }).catch(reason => this.setErrorMessage('Permission ', reason));
  }

  // === Users ===
  async toggleUsers(): Promise < void > {
    await this.setState(DashboardState.ShowingRolesExpanded);
    if (this.selectedRole) {
      this.usersSelected = true;
      await this.setState(DashboardState.ShowingUsers);
    }
  }

  onAddUserToRole(user: User, role: Role): void {
    const userIndex = findIndex(this.selectedRole.users, (el) => el._id === user._id);
    if (userIndex >= 0) {
      return this.setErrorMessage('User/Role', 'User already attached to role');
    } else {
      this.uacService.addUserToRole(user._id, role._id)
        .then(() => {
          user = find(this.users, (el) => el._id === user._id);
          role.users.unshift(user);
        }).catch(reason => this.setErrorMessage('User/Role', reason));
    }
  }

  onRemoveUserFromRole(user: User, role: Role): void {
    this.uacService.removeUserFromRole(user._id, role._id)
      .then(() => {
        const userIndex = findIndex(role.users, (el) => el._id === user._id);
        if (userIndex >= 0) {
          role.users.splice(userIndex, 1);
        }
      }).catch(reason => this.setErrorMessage('User/Role', reason));
  }
}
