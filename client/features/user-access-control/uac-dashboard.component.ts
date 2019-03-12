import { Component, OnInit } from '@angular/core';

import * as _ from 'lodash';

import { dynamicFormClasses } from '../utils';

import { Application } from './models/application';
import { Role } from './models/role';
import { Permission } from './models/permission';
import { UserAccessControlService } from './services/user-access-control.service';
import { keyframes } from '@angular/animations';

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
    apps: Application[];
    selectedRole: Role = null;
    appsSelected = false;
    usersSelected = false;
    selectedUser: string = null;
    selectedApp: Application = null;
    selectedPermission: Permission = null;
    selectedPermissionAttribute: {} = null;
    rolesMetadata: dynamicFormClasses.QuestionBase<any>[] = [];
    usersMetadata: dynamicFormClasses.QuestionBase<any>[] = [];
    usersReadOnlyMetadata: dynamicFormClasses.QuestionBase<any>[] = [];
    appsMetadata: dynamicFormClasses.QuestionBase<any>[] = [];
    permissionsMetadata: dynamicFormClasses.QuestionBase<any>[] = [];
    attributesMetadata: dynamicFormClasses.QuestionBase<any>[] = [];

    constructor(
        private uacService: UserAccessControlService
    ) { }

    async ngOnInit() {
        await this.uacService.getAllRoles()
            .then(data => {
                this.roles = data as Role[];

                this.appsMetadata = [
                    new dynamicFormClasses.TextboxQuestion({
                        key: 'name',
                        label: 'Name',
                        value: '',
                        required: true,
                        order: 2
                    }),
                    new dynamicFormClasses.DropdownQuestion({
                        key: 'admin_role.id',
                        label: 'Admin Role',
                        value: '',
                        required: false,
                        order: 3,
                        options: _.map(this.roles, (role) => {
                            const obj = {};
                            obj[role.id] = role.name;
                            return obj;
                        })
                    })
                ];
            });
        await this.uacService.getAllApps()
            .then(data => { this.apps = data as Application[]; });

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
                new dynamicFormClasses.TextboxQuestion({
                    key: 'name',
                    label: 'Username',
                    create_label: 'Username(s) (single instance or comma-separated list)',
                    value: '',
                    required: true,
                    order: 2
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

            this.attributesMetadata = [
                new dynamicFormClasses.TextboxQuestion({
                    key: 'name',
                    label: 'Name',
                    value: '',
                    required: true,
                    order: 1,
                    hide_on_edit: true
                }),
                new dynamicFormClasses.TextareaQuestion({
                    key: 'value',
                    label: 'Value',
                    value: '',
                    required: true,
                    order: 2
                })
            ];

            return resolve();
        });
    }

    setState(state: DashboardState): void {
        this.dashState = state;
        switch (state) {
            case DashboardState.ShowingRoles:
                this.selectedRole = null;
                this.appsSelected = false;
                this.selectedApp = null;
                this.usersSelected = false;
                this.selectedUser = null;
                this.selectedPermission = null;
                this.selectedPermissionAttribute = null;
                break;
            case DashboardState.ShowingRolesExpanded:
                this.appsSelected = false;
                this.selectedApp = null;
                this.usersSelected = false;
                this.selectedUser = null;
                this.selectedPermission = null;
                this.selectedPermissionAttribute = null;
                break;
            case DashboardState.ShowingUsers:
                this.appsSelected = false;
                this.selectedApp = null;
                this.selectedPermission = null;
                this.selectedPermissionAttribute = null;
                break;
            case DashboardState.ShowingUser:
                this.usersSelected = true;
                this.appsSelected = false;
                this.selectedApp = null;
                this.selectedPermission = null;
                this.selectedPermissionAttribute = null;
                break;
            case DashboardState.ShowingApps:
                this.appsSelected = true;
                this.selectedApp = null;
                this.usersSelected = false;
                this.selectedUser = null;
                this.selectedPermission = null;
                this.selectedPermissionAttribute = null;
                break;
            case DashboardState.ShowingPermissions:
                this.appsSelected = true;
                this.usersSelected = false;
                this.selectedUser = null;
                this.selectedPermission = null;
                this.selectedPermissionAttribute = null;
                break;
            case DashboardState.ShowingPermissionAttributes:
                this.appsSelected = true;
                this.usersSelected = false;
                this.selectedUser = null;
                break;
        }
    }

    findItemByField(arr: any[], key, value) {
        const item = _.find(arr, (i) => i[key] === value );
        return item ? item : {};
    }

    setErrorMessage(section, message) {
        this.message = message;
    }

    dismissMessage() {
        this.message = null;
    }

    // === Roles ===

    toggleRole(role) {
        if (this.selectedRole === role) {
            this.setState(DashboardState.ShowingRoles);
        } else {
            this.selectedRole = role;
            this.setState(DashboardState.ShowingRolesExpanded);
        }
    }

    createRole(role) {
        this.uacService.createRole(role)
            .then(data => {
                role.id = data.id;
                role.apps = [];
                role.users = [];
                this.roles.unshift(role);
                this.selectedRole = null;
            }).catch(reason => this.setErrorMessage('Roles', reason));
    }

    modifyRole(role) {
        this.uacService.updateRole(role)
            .then(data => {
                const roleIndex = _.findIndex(this.roles, (el) => el.id === role.id);
                if (roleIndex >= 0) {
                    this.roles[roleIndex] = role;
                    this.selectedRole = null;
                }
            }).catch(reason => this.setErrorMessage('Roles', reason));
    }

    startEditRole() {
        this.setState(DashboardState.ShowingRoles);
    }

    deleteRole(role): void {
        this.uacService.deleteRole(role)
            .then(data => {
                const roleIndex = _.findIndex(this.roles, (el) => el.id === role.id);
                if (roleIndex >= 0) {
                    this.roles.splice(roleIndex, 1);
                }
                this.setState(DashboardState.ShowingRoles);
            }).catch(reason => this.setErrorMessage('Roles', reason));
    }
}
