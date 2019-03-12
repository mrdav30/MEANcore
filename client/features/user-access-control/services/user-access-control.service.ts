import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Role } from '../models/role';
import { Application } from '../models/application';
import { User } from '../models/user';

import { HandleErrorService } from '../../utils';

@Injectable()
export class UserAccessControlService {

    constructor(
        private http: HttpClient,
        protected handleErrorService: HandleErrorService
    ) { }

    // Roles

    getAllRoles(): Promise<Role[]> {
        return this.http.get('/api/roles')
            .pipe(
                tap((res: any) => {
                    return res;
                }),
                catchError(this.handleErrorService.handleError())
            )
            .toPromise();
    }

    createRole(role): Promise<any> {
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

    updateRole(role): Promise<any> {
        return this.http
            .put('/api/role/' + role.id, { role })
            .pipe(
                tap((res: any) => {
                    return res;
                }),
                catchError(this.handleErrorService.handleError())
            )
            .toPromise();
    }

    deleteRole(role): Promise<any> {
        return this.http
            .delete('/api/role/' + role.id)
            .pipe(
                tap((res: any) => {
                    return res;
                }),
                catchError(this.handleErrorService.handleError())
            )
            .toPromise();
    }

    // Apps

    getAllApps(): Promise<Application[]> {
        return this.http.get('/api/apps')
            .pipe(
                tap((res: any) => {
                    return res;
                }),
                catchError(this.handleErrorService.handleError())
            )
            .toPromise();
    }
}
