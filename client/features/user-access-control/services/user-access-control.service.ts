import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { HandleErrorService } from '../../utils';

import { Role } from '../models/role';
import { Permission } from '../models/permission';
import { User } from '../models/user';

@Injectable()
export class UserAccessControlService {
  constructor(private http: HttpClient, protected handleErrorService: HandleErrorService) { }

  // Roles

  getAllRoles(): Promise<Role[]> {
    return this.http
      .get(environment.appBaseUrl + environment.apiBaseUrl + '/uac/roles')
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }

  createRole(role: Role): Promise<any> {
    return this.http
      .post(environment.appBaseUrl + environment.apiBaseUrl + '/uac/role/', { role })
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }

  updateRole(role: Role): Promise<any> {
    return this.http
      .put(environment.appBaseUrl + environment.apiBaseUrl + '/uac/role/' + role._id, { role })
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }

  deleteRole(role_id: string): Promise<any> {
    return this.http
      .delete(environment.appBaseUrl + environment.apiBaseUrl + '/uac/role/' + role_id)
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }

  // Permissions

  getAllPermissions(): Promise<Permission[]> {
    return this.http
      .get(environment.appBaseUrl + environment.apiBaseUrl + '/uac/permissions')
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }

  createPermission(permission: Permission): Promise<any> {
    return this.http
      .post(environment.appBaseUrl + environment.apiBaseUrl + '/uac/permission', { permission })
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }

  modifyPermission(permission: Permission): Promise<any> {
    return this.http
      .put(environment.appBaseUrl + environment.apiBaseUrl + '/uac/permission/' + permission._id, { permission })
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }

  deletePermission(perm_id: string): Promise<any> {
    return this.http
      .delete(environment.appBaseUrl + environment.apiBaseUrl + '/uac/permission/' + perm_id)
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }

  connectRoleWithPermission(role_id: string, perm_id: string): Promise<any> {
    return this.http
      .post(environment.appBaseUrl + environment.apiBaseUrl + '/uac/role/' + role_id + '/permission/' + perm_id, {})
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }

  disconnectRoleFromPermission(role_id: string, perm_id: string): Promise<any> {
    return this.http
      .delete(environment.appBaseUrl + environment.apiBaseUrl + '/uac/role/' + role_id + '/permission/' + perm_id)
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }

  // Users

  getAllUsers(): Promise<User[]> {
    return this.http
      .get(environment.appBaseUrl + environment.apiBaseUrl + '/users')
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }

  addUserToRole(user_id: string, role_id: string): Promise<any> {
    return this.http
      .post(environment.appBaseUrl + environment.apiBaseUrl + '/uac/role/' + role_id + '/user/' + user_id, {})
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }

  removeUserFromRole(user_id: string, role_id: string): Promise<any> {
    return this.http
      .delete(environment.appBaseUrl + environment.apiBaseUrl + '/uac/role/' + role_id + '/user/' + user_id)
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }

  updateUser(user: User): Promise<User> {
    return this.http
      .put(environment.appBaseUrl + environment.apiBaseUrl + '/user', { user })
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }
}
