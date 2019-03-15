import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';

import { dynamicQuestionClasses } from '../utils';

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
    permissions: Permission[];
    users: User[];
    selectedRole: Role = null;
    usersSelected = false;
    permissionsSelected = false;
    selectedUser: User = null;
    selectedPermission: Permission = null;
    selectedUserAttribute: {} = null;
    rolesMetadata: dynamicQuestionClasses.QuestionBase<any>[] = [];
    usersMetadata: dynamicQuestionClasses.QuestionBase<any>[] = [];
    usersReadOnlyMetadata: dynamicQuestionClasses.QuestionBase<any>[] = [];
    permissionsMetadata: dynamicQuestionClasses.QuestionBase<any>[] = [];

    constructor(
        private uacService: UserAccessControlService
    ) { }

    async ngOnInit(): Promise<void> {
        await this.getData();

        await this.setMetaData();
    }

    async getData(): Promise<void> {
        await this.uacService.getAllRoles()
            .then((data) => {
                this.roles = data as Role[];
            });

        await this.uacService.getAllPermissions()
            .then((data) => {
                this.permissions = data as Permission[];
            });

        await this.uacService.getAllUsers()
            .then((data) => {
                this.users = data as User[];
            });
    }

    setMetaData(): Promise<void> {
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

            this.usersMetadata = [
                new dynamicQuestionClasses.DropdownQuestion({
                    key: '_id',
                    label: 'Username',
                    value: '',
                    required: true,
                    order: 1,
                    options: _.map(this.users, (user) => {
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

    setState(state: DashboardState): Promise<void> {
        return new Promise((resolve) => {
            this.dashState = state;
            switch (state) {
                case DashboardState.ShowingRoles:
                    this.selectedRole = null;
                    this.usersSelected = false;
                    this.permissionsSelected = false;
                    this.selectedUser = null;
                    this.selectedPermission = null;
                    break;
                case DashboardState.ShowingRolesExpanded:
                    this.usersSelected = false;
                    this.selectedUser = null;
                    this.selectedPermission = null;
                    break;
                case DashboardState.ShowingUsers:
                    this.permissionsSelected = false;
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
        if (list.name === 'permissions') {
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

    async onToggleRole(role: Role): Promise<void> {
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
                role._id = data._id;
                role.users = [];
                role.permissions = [];
                this.roles.unshift(role);
                this.selectedRole = null;
            }).catch(reason => this.setErrorMessage('Roles', reason));
    }

    onModifyRole(role: Role): void {
        this.uacService.updateRole(role)
            .then(() => {
                const roleIndex = _.findIndex(this.roles, (el) => el._id === role._id);
                if (roleIndex >= 0) {
                    this.roles[roleIndex] = role;
                    this.selectedRole = null;
                }
            }).catch(reason => this.setErrorMessage('Roles', reason));
    }

    async onStartEditRole(): Promise<void> {
        await this.setState(DashboardState.ShowingRoles);
    }

    onDeleteRole(role: Role): void {
        this.uacService.deleteRole(role._id)
            .then(async () => {
                const roleIndex = _.findIndex(this.roles, (el) => el._id === role._id);
                if (roleIndex >= 0) {
                    this.roles.splice(roleIndex, 1);
                }
                await this.setState(DashboardState.ShowingRoles);
            }).catch(reason => this.setErrorMessage('Roles', reason));
    }

    // === Permissions ===

    async onTogglePermission(perm: Permission): Promise<void> {
        await this.setState(DashboardState.ShowingPermissions);
        const permIndex = _.findIndex(this.selectedRole.permissions, (el) => el._id === perm._id);
        if (permIndex < 0) {
            // role does not have permission enabled
            return;
        }
        if (this.selectedPermission !== perm) {
            this.selectedPermission = this.selectedRole.permissions[permIndex];
            await this.setState(DashboardState.ShowingPermissionAttributes);
        }
    }

    async togglePermissions(): Promise<void> {
        await this.setState(DashboardState.ShowingRolesExpanded);
        if (this.selectedRole) {
            this.permissionsSelected = true;
            await this.setState(DashboardState.ShowingPermissions);
        }
    }

    onCreatePermission(perm: Permission): void {
        this.uacService.createPermission(perm)
            .then(data => {
                perm._id = data._id;
                this.permissions.unshift(perm);
            }).catch(reason => this.setErrorMessage('Permission ', reason));
    }

    onModifyPermission(perm: Permission): void {
        this.uacService.modifyPermission(perm)
            .then(() => {
                const roleIndex = _.findIndex(this.roles, (el) => el._id === this.selectedRole._id);
                const permIndex = _.findIndex(this.roles[roleIndex].permissions, (el) => el._id === perm._id);
                this.roles[roleIndex].permissions[permIndex].name = perm.name;
            }).catch(reason => this.setErrorMessage('Permission ', reason));
    }

    onDeletePermission(perm: Permission): void {
        this.uacService.deletePermission(perm._id)
            .then(async () => {
                const roleIndex = _.findIndex(this.roles, (el) => el._id === this.selectedRole._id);
                const permIndex = _.findIndex(this.roles[roleIndex].permissions, (el) => el._id === perm._id);
                if (permIndex >= 0) {
                    this.roles[roleIndex].permissions.splice(permIndex, 1);
                }
                this.permissions.splice(permIndex, 1);
                await this.setState(DashboardState.ShowingPermissions);
            }).catch(reason => this.setErrorMessage('Permission ', reason));
    }

    onAddPermissionToRole(perm: Permission): void {
        this.uacService.connectRoleWithPermission(this.selectedRole._id, perm._id)
            .then(() => {
                this.selectedRole.permissions.push(perm);
            }).catch(reason => this.setErrorMessage('Permission ', reason));
    }

    onRemovePermissionFromRole(perm: Permission): void {
        this.uacService.disconnectRoleFromPermission(this.selectedRole._id, perm._id)
            .then(() => {
                const permIndex = _.findIndex(this.selectedRole.permissions, (el) => el._id === perm._id);

                if (permIndex >= 0) {
                    this.selectedRole.permissions.splice(permIndex, 1);
                }
            }).catch(reason => this.setErrorMessage('Permission ', reason));
    }

    // === Users ===

    async toggleUser(): Promise<void> {
        await this.setState(DashboardState.ShowingUser);
    }

    async toggleUsers(): Promise<void> {
        await this.setState(DashboardState.ShowingRolesExpanded);
        if (this.selectedRole) {
            this.usersSelected = true;
            await this.setState(DashboardState.ShowingUsers);
        }
    }

    onAddUserToRole(user: User, role: Role): void {
        this.uacService.addUserToRole(user._id, role._id)
            .then((data) => {
                role.users.unshift(data.user);
            }).catch(reason => this.setErrorMessage('User/Role', reason));
    }

    onRemoveUserFromRole(user: User, role: Role): void {
        this.uacService.removeUserFromRole(user._id, role._id)
            .then(() => {
                const userIndex = _.findIndex(role.users, (el) => el._id === user._id);
                if (userIndex >= 0) {
                    role.users.splice(userIndex, 1);
                }
            }).catch(reason => this.setErrorMessage('User/Role', reason));
    }

    onModifyUser(user: User): void {
        this.uacService.updateUser(user)
            .then(data => {
                const userIndex = _.findIndex(this.selectedRole.users, (el) => el._id === user._id);
                this.selectedRole.users[userIndex].name = data.name;
            }).catch(reason => this.setErrorMessage('User', reason));
    }

    onUserSelected(user: User): Promise<void> {
        return new Promise((resolve) => {
            if (user === this.selectedUser) {
                this.selectedUser = null;
                return resolve();
            }
            this.selectedUser = user;
            return resolve();
        });
    }
}
