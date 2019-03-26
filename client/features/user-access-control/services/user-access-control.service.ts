import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { HandleErrorService } from '../../utils';

import { Role, User, Feature, Permission } from '../index';
import { Observable } from 'rxjs';

@Injectable()
export class UserAccessControlService {
  constructor(
    private http: HttpClient,
    private handleErrorService: HandleErrorService
  ) { }

  // UAC viewmodel

  getViewModel(): Promise<any> {
    return this.http
      .get(environment.appBaseUrl + environment.apiBaseUrl + '/uac/view')
      .pipe(
        catchError(this.handleErrorService.handleError<any>())
      )
      .toPromise();
  }

  // Roles

  createRole(role: Role): Promise<any> {
    return this.http
      .post(environment.appBaseUrl + environment.apiBaseUrl + '/uac/role/', { role })
      .pipe(
        catchError(this.handleErrorService.handleError<any>())
      )
      .toPromise();
  }

  updateRole(role: Role): Promise<any> {
    return this.http
      .put(environment.appBaseUrl + environment.apiBaseUrl + '/uac/role/' + role._id, { role })
      .pipe(
        catchError(this.handleErrorService.handleError<any>())
      )
      .toPromise();
  }

  deleteRole(role_id: string): Promise<any> {
    return this.http
      .delete(environment.appBaseUrl + environment.apiBaseUrl + '/uac/role/' + role_id)
      .pipe(
        catchError(this.handleErrorService.handleError<any>())
      )
      .toPromise();
  }

  // Features

  createFeature(feature: Feature): Promise<any> {
    return this.http
      .post(environment.appBaseUrl + environment.apiBaseUrl + '/uac/feature/', { feature })
      .pipe(
        catchError(this.handleErrorService.handleError<any>())
      )
      .toPromise();
  }

  updateFeature(feature: Feature): Promise<any> {
    return this.http
      .put(environment.appBaseUrl + environment.apiBaseUrl + '/uac/feature/' + feature._id, { feature })
      .pipe(
        catchError(this.handleErrorService.handleError<any>())
      )
      .toPromise();
  }

  deleteFeature(feature_id: string): Promise<any> {
    return this.http
      .delete(environment.appBaseUrl + environment.apiBaseUrl + '/uac/feature/' + feature_id)
      .pipe(
        catchError(this.handleErrorService.handleError<any>())
      )
      .toPromise();
  }

  // Permissions

  createPermission(feature_id: string, permission: Permission): Promise<any> {
    return this.http
      .post(environment.appBaseUrl + environment.apiBaseUrl + '/uac/feature/' + feature_id + '/permission', { permission })
      .pipe(
        catchError(this.handleErrorService.handleError<any>())
      )
      .toPromise();
  }

  modifyPermission(permission: Permission): Promise<any> {
    return this.http
      .put(environment.appBaseUrl + environment.apiBaseUrl + '/uac/permission/' + permission._id, { permission })
      .pipe(
        catchError(this.handleErrorService.handleError<any>())
      )
      .toPromise();
  }

  deletePermission(feature_id: string, perm_id: string): Promise<any> {
    return this.http
      .delete(environment.appBaseUrl + environment.apiBaseUrl + '/uac/feature/' + feature_id + '/permission/' + perm_id)
      .pipe(
        catchError(this.handleErrorService.handleError<any>())
      )
      .toPromise();
  }

  connectRoleWithPermission(role_id: string, perm_id: string): Promise<any> {
    return this.http
      .post(environment.appBaseUrl + environment.apiBaseUrl + '/uac/role/' + role_id + '/permission/' + perm_id, {})
      .pipe(
        catchError(this.handleErrorService.handleError<any>())
      )
      .toPromise();
  }

  disconnectRoleFromPermission(role_id: string, perm_id: string): Promise<any> {
    return this.http
      .delete(environment.appBaseUrl + environment.apiBaseUrl + '/uac/role/' + role_id + '/permission/' + perm_id)
      .pipe(
        catchError(this.handleErrorService.handleError<any>())
      )
      .toPromise();
  }

  // Users

  addUserToRole(user_id: string, role_id: string): Promise<any> {
    return this.http
      .post(environment.appBaseUrl + environment.apiBaseUrl + '/uac/role/' + role_id + '/user/' + user_id, {})
      .pipe(
        catchError(this.handleErrorService.handleError<any>())
      )
      .toPromise();
  }

  removeUserFromRole(user_id: string, role_id: string): Promise<any> {
    return this.http
      .delete(environment.appBaseUrl + environment.apiBaseUrl + '/uac/role/' + role_id + '/user/' + user_id)
      .pipe(
        catchError(this.handleErrorService.handleError<any>())
      )
      .toPromise();
  }
}
