import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { HandleErrorService } from './handle-error.service';

@Injectable()
export class ProfileService {

    constructor(
        private http: HttpClient,
        private _handleErrorService: HandleErrorService
    ) { }

    GetCurrent(): Observable<{}> {
        return this.http.get(environment.appBaseUrl + environment.apiBaseUrl + '/users/profile/current')
            .pipe(
                catchError(this._handleErrorService.handleError<any>('GetCurrentProfile'))
            );
    }

    Update(profile: any): Observable<{}> {
        return this.http.put(environment.appBaseUrl + environment.apiBaseUrl + '/users/profile/' + profile._id, profile)
            .pipe(
                catchError(this._handleErrorService.handleError<any>('UpdateProfile'))
            );
    }

}
