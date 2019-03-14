import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import { Role } from '../models/role';
import { Permission } from '../models/permission';
import { User } from '../models/user';

import { HandleErrorService } from '../../utils';

@Injectable()
export class UserAccessControlService {
  constructor(private http: HttpClient, protected handleErrorService: HandleErrorService) { }

  // Roles

  getAllRoles(): Promise<Role[]> {
    return this.http
      .get('/api/roles')
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
      .post('/api/role/', { role })
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
      .put('/api/role/' + role._id, { role })
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
      .delete('/api/role/' + role_id)
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }

  // Permissions

  createPermission(permission: Permission): Promise<any> {
    return this.http
      .post('/api/permission', { permission })
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
      .put('/api/permission/' + permission._id, { permission })
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
      .delete('/api/permission/' + perm_id)
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
      .post('/api/role/' + role_id + '/permission/' + perm_id, {})
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
      .delete('/api/role/' + role_id + '/permission/' + perm_id)
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }

  // Users

  addUserToRole(user_id: string, role_id: string): Promise<any> {
    return this.http
      .post('/api/role/' + role_id + '/user/' + user_id, {})
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
      .delete('/api/role/' + role_id + '/user/' + user_id)
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
      .put('/api/user', { user })
      .pipe(
        tap((res: any) => {
          return res;
        }),
        catchError(this.handleErrorService.handleError())
      )
      .toPromise();
  }
}
