import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';

import { dynamicFormClasses } from '../utils';

import { Role } from './models/role';
import { Permission } from './models/permission';
import { UserAccessControlService } from './services/user-access-control.service';
import { User } from './models/user';

enum DashboardState {
    ShowingRoles = 1,
    ShowingRolesExpanded,
    ShowingApps,
    ShowingPermissions,
    ShowingUsers,
    ShowingUser,
    ShowingPermissionAttributes
}

@Component({
    moduleId: module.id,
    selector: 'app-uac-dashboard',
    templateUrl: `./uac-dashboard.component.html`
})

export class UserAccessControlComponent implements OnInit {
    message: string = null;
    dashState: DashboardState = DashboardState.ShowingRoles;
    roles: Role[];
    selectedRole: Role = null;
    usersSelected = false;
    permissionsSelected = false;
    selectedUser: User = null;
    selectedPermission: Permission = null;
    selectedUserAttribute: {} = null;
    rolesMetadata: dynamicFormClasses.QuestionBase<any>[] = [];
    usersMetadata: dynamicFormClasses.QuestionBase<any>[] = [];
    usersReadOnlyMetadata: dynamicFormClasses.QuestionBase<any>[] = [];
    permissionsMetadata: dynamicFormClasses.QuestionBase<any>[] = [];

    constructor(
        private uacService: UserAccessControlService
    ) { }

    async ngOnInit() {
        await this.uacService.getAllRoles()
            .then(data => {
                this.roles = data as Role[];
            });

        await this.setMetaData();
    }

    setMetaData(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.rolesMetadata = [
                new dynamicFormClasses.TextboxQuestion({
                    key: 'name',
                    label: 'Name',
                    value: '',
                    required: true,
                    order: 1
                })
            ];

            this.usersMetadata = [
                new dynamicFormClasses.DropdownQuestion({
                    key: 'name',
                    label: 'Username',
                    value: '',
                    required: true,
                    order: 2,
                    options: _.map(this.roles, (role) => {
                        return _.forEach(role.users, (user) => {
                            const obj = {};
                            obj[user.id] = user.full_name;
                            return obj;
                        });
                    })
                })
            ];

            this.usersReadOnlyMetadata = [
                new dynamicFormClasses.ReadonlyField({
                    key: 'name',
                    label: 'Username',
                    value: '',
                    required: false,
                    order: 1
                }),
                new dynamicFormClasses.ReadonlyField({
                    key: 'full_name',
                    label: 'Full Name',
                    value: '',
                    required: false,
                    order: 2
                }),
                new dynamicFormClasses.ReadonlyField({
                    key: 'email',
                    label: 'E-mail',
                    value: '',
                    required: false,
                    order: 3
                })
            ];

            this.permissionsMetadata = [
                new dynamicFormClasses.TextboxQuestion({
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

    setState(state: DashboardState): Promise<void> {
        return new Promise((resolve, reject) => {
            this.dashState = state;
            switch (state) {
                case DashboardState.ShowingRoles:
                    this.selectedRole = null;
                    this.usersSelected = false;
                    this.selectedUser = null;
                    this.selectedPermission = null;
                    break;
                case DashboardState.ShowingRolesExpanded:
                    this.usersSelected = false;
                    this.selectedUser = null;
                    this.selectedPermission = null;
                    break;
                case DashboardState.ShowingUsers:
                    this.selectedPermission = null;
                    break;
                case DashboardState.ShowingUser:
                    this.usersSelected = true;
                    this.selectedPermission = null;
                    break;
                case DashboardState.ShowingPermissions:
                    this.usersSelected = false;
                    this.selectedUser = null;
                    this.selectedPermission = null;
                    break;
            }

            return resolve();
        });
    }

    onToggleList(list: any): void {
        if (list.name === 'apps') {
            this.togglePermissions();
        } else if (list.name === 'users') {
            this.toggleUsers();
        }
    }

    setErrorMessage(section: string, message: string): void {
        this.message = message;
    }

    dismissMessage(): void {
        this.message = null;
    }

    // === Roles ===

    async onToggleRole(role: Role) {
        if (this.selectedRole === role) {
            await this.setState(DashboardState.ShowingRoles);
        } else {
            this.selectedRole = role;
            await this.setState(DashboardState.ShowingRolesExpanded);
        }
    }

    onCreateRole(role: Role): void {
        this.uacService.createRole(role)
            .then(data => {
                role.id = data.id;
                role.users = [];
                role.permissions = [];
                this.roles.unshift(role);
                this.selectedRole = null;
            }).catch(reason => this.setErrorMessage('Roles', reason));
    }

    onModifyRole(role: Role): void {
        this.uacService.updateRole(role)
            .then(() => {
                const roleIndex = _.findIndex(this.roles, (el) => el.id === role.id);
                if (roleIndex >= 0) {
                    this.roles[roleIndex] = role;
                    this.selectedRole = null;
                }
            }).catch(reason => this.setErrorMessage('Roles', reason));
    }

    async onStartEditRole() {
        await this.setState(DashboardState.ShowingRoles);
    }

    onDeleteRole(role: Role): void {
        this.uacService.deleteRole(role.id)
            .then(async () => {
                const roleIndex = _.findIndex(this.roles, (el) => el.id === role.id);
                if (roleIndex >= 0) {
                    this.roles.splice(roleIndex, 1);
                }
                await this.setState(DashboardState.ShowingRoles);
            }).catch(reason => this.setErrorMessage('Roles', reason));
    }

    // === Permissions ===

    async onTogglePermission(perm: Permission) {
        await this.setState(DashboardState.ShowingPermissions);
        const permIndex = _.findIndex(this.selectedRole.permissions, (el) => el.id === perm.id);
        if (permIndex < 0) {
            // role does not have permission enabled
            return;
        }
        if (this.selectedPermission !== perm) {
            this.selectedPermission = this.selectedRole.permissions[permIndex];
            await this.setState(DashboardState.ShowingPermissionAttributes);
        }
    }

    async togglePermissions() {
        await this.setState(DashboardState.ShowingRolesExpanded);
        if (this.selectedRole) {
            this.permissionsSelected = true;
            await this.setState(DashboardState.ShowingPermissions);
        }
    }

    onCreatePermission(perm: Permission): void {
        this.uacService.createPermission(perm)
            .then(data => {
                perm.id = data.permission_id;
                const roleIndex = _.findIndex(this.roles, (el) => el.id === this.selectedRole.id);
                this.roles[roleIndex].permissions.unshift(perm);
            }).catch(reason => this.setErrorMessage('Permission ', reason));
    }

    onModifyPermission(perm: Permission): void {
        this.uacService.modifyPermission(perm)
            .then(() => {
                const roleIndex = _.findIndex(this.roles, (el) => el.id === this.selectedRole.id);
                const permIndex = _.findIndex(this.roles[roleIndex].permissions, (el) => el.id === perm.id);
                this.roles[roleIndex].permissions[permIndex].name = perm.name;
            }).catch(reason => this.setErrorMessage('Permission ', reason));
    }

    onDeletePermission(perm: Permission): void {
        this.uacService.deletePermission(perm.id)
            .then(async () => {
                const roleIndex = _.findIndex(this.roles, (el) => el.id === this.selectedRole.id);
                const permIndex = _.findIndex(this.roles[roleIndex].permissions, (el) => el.id === perm.id);
                if (permIndex >= 0) {
                    this.roles[roleIndex].permissions.splice(permIndex, 1);
                }
                await this.setState(DashboardState.ShowingPermissions);
            }).catch(reason => this.setErrorMessage('Permission ', reason));
    }

    onAddPermissionToRole(perm: Permission): void {
        this.uacService.connectRoleWithPermission(this.selectedRole.id, perm.id)
            .then(() => {
                this.selectedRole.permissions.push(perm);
            }).catch(reason => this.setErrorMessage('Permission ', reason));
    }

    onRemovePermissionFromRole(perm: Permission): void {
        this.uacService.disconnectRoleFromPermission(this.selectedRole.id, perm.id)
            .then(() => {
                const permIndex = _.findIndex(this.selectedRole.permissions, (el) => el.id === perm.id);

                if (permIndex >= 0) {
                    this.selectedRole.permissions.splice(permIndex, 1);
                }
            }).catch(reason => this.setErrorMessage('Permission ', reason));
    }

    // === Users ===

    async toggleUser() {
        await this.setState(DashboardState.ShowingUser);
    }

    async toggleUsers() {
        await this.setState(DashboardState.ShowingRolesExpanded);
        if (this.selectedRole) {
            this.usersSelected = true;
            await this.setState(DashboardState.ShowingUsers);
        }
    }

    onAddUsersToRole(users: string, role: Role) {
        this.uacService.addUsersToRole(users, role)
            .then(data => {
                _.forEach(data.users, (user) => {
                    role.users.unshift(user);
                });
                if (data.errors.length) {
                    this.setErrorMessage(
                        'User/Role',
                        'Unable to add ' + data.failed + ' out of ' + (data.added + data.failed) + ' users to role "' + role.name + '"'
                    );
                }
            }).catch(reason => this.setErrorMessage('User/Role', reason));
    }

    onRemoveUserFromRole(user: User, role: Role) {
        this.uacService.removeUserFromRole(user, role)
            .then(() => {
                const userIndex = _.findIndex(role.users, (el) => el.id === user.id);
                if (userIndex >= 0) {
                    role.users.splice(userIndex, 1);
                }
            }).catch(reason => this.setErrorMessage('User/Role', reason));
    }

    onModifyUser(user: User) {
        this.uacService.updateUser(user)
            .then(data => {
                const userIndex = _.findIndex(this.selectedRole.users, (el) => el.id === user.id);
                this.selectedRole.users[userIndex].name = data.name;
            }).catch(reason => this.setErrorMessage('User', reason));
    }

    onUserSelected(user: User): Promise<void> {
        return new Promise((resolve, reject) => {
            if (user === this.selectedUser) {
                this.selectedUser = null;
                return resolve();
            }
            this.selectedUser = user;
            return resolve();
        });
    }

    replaceAllUsers(user: User): Promise<void> {
        return new Promise((resolve, reject) => {
            _.forEach(this.roles, (role) => {
                if (role.users && role.users.length) {
                    const ind = _.findIndex(role.users, (el) => el.id === user.id);
                    role.users[ind] = user;
                }
            });
            resolve();
        });
    }

}