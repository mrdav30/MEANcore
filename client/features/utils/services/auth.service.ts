import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { catchError, share, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { environment } from '../../../environments/environment';

import { ConfigService } from './config.service';
import { HandleErrorService } from './handle-error.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthService {
    public redirectUrl = environment.appDefaultRoute;
    public user: any;
    public userChange$: Observable<any>;

    private signInUrl = environment.appBaseUrl + environment.apiBaseUrl + '/auth/signIn'; // URL to web API
    private recoverUrl = environment.appBaseUrl + environment.apiBaseUrl + '/auth/forgot';
    private resetUrl = environment.appBaseUrl + environment.apiBaseUrl + '/auth/reset/';
    private signOutUrl = environment.appBaseUrl + environment.apiBaseUrl + '/auth/signOut';
    private validateUrl = environment.appBaseUrl + environment.apiBaseUrl + '/auth/validate';
    private signUpUrl = environment.appBaseUrl + environment.apiBaseUrl + '/auth/signUp';
    private installUrl = environment.appBaseUrl + environment.apiBaseUrl + '/install';
    private authListener: Observer<any>;

    constructor(
        private configService: ConfigService,
        private http: HttpClient,
        private router: Router,
        private handleErrorService: HandleErrorService
    ) {
        this.userChange$ = new Observable(observer => this.authListener = observer).pipe(
            share()
        );

        this.user = this.configService.user || false;
    }

    signIn(user): Observable<{}> {
        return this.http.post(this.signInUrl, user)
            .pipe(
                tap((res: any) => {
                    if (res.user) {
                        this.notifyUserSubscribers(res.user);
                    }
                }),
                catchError(this.handleErrorService.handleError<any>('UserSignIn'))
            );
    }

    valuedateUser(user): Observable<{}> {
        return this.http.post(this.validateUrl, user, httpOptions)
            .pipe(
                catchError(this.handleErrorService.handleError<any>('ValidateUser'))
            );
    }

    signUp(user): Observable<{}> {
        return this.http.post(this.signUpUrl, user, httpOptions)
            .pipe(
                tap((res: any) => {
                    if (res.user) {
                        this.notifyUserSubscribers(res.user);
                    }
                }),
                catchError(this.handleErrorService.handleError<any>('UserSignUp'))
            );
    }

    install(user): Observable<{}> {
        return this.http.post(this.installUrl, user, httpOptions)
            .pipe(
                tap((res: any) => {
                    if (res.user) {
                        this.notifyUserSubscribers(res.user);
                    }
                }),
                catchError(this.handleErrorService.handleError<any>('UserSignUp'))
            );
    }

    forgot(user): Observable<{}> {
        return this.http.post(this.recoverUrl, user, httpOptions)
            .pipe(
                catchError(this.handleErrorService.handleError<any>('ForgotPassword'))
            );
    }

    reset(credentials): Observable<{}> {
        return this.http.post(this.resetUrl + credentials.token, credentials, httpOptions)
            .pipe(
                tap((res: any) => {
                    if (res.user) {
                        this.notifyUserSubscribers(res.user);
                    }
                }),
                catchError(this.handleErrorService.handleError<any>('ResetPassword'))
            );
    }

    signOut(): void {
        this.http.get(this.signOutUrl)
            .subscribe(() => {
                this.notifyUserSubscribers(false);
                this.router.navigate(['sign-in']);
            }, () => {
                console.log('Error while logout.');
            });
    }

    notifyUserSubscribers(user: any): void {
        this.user = user;
        this.authListener.next(this.user);
    }

    hasRole(role): boolean {
        // only for test since switching makes it a string
        if (!Array.isArray(this.user.roles)) {
            this.user.roles = [this.user.roles];
        }
        return this.user.roles.indexOf(role) !== -1;
    }

    hasPermission(permission): boolean {
        permission = permission.toLowerCase();
        const permissions = this.user.permission_data[environment.appName];
        return !!_.find(permissions, (p) => p.name === permission);
    }

    checkPermission(permission, attributes): any {
        permission = permission.toLowerCase();
        const permissions = _.filter(this.user.permission_data[environment.appName], (p) => p.name === permission);
        return _.some(permissions, (p) => {
            return _.every(Object.keys(attributes), (key) => {
                const attr = attributes[key];
                return !p.attributes || !p.attributes[key] || p.attributes[key].indexOf(attr) !== -1;
            });
        });
    }
}
