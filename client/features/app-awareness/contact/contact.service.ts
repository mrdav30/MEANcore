import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { HandleErrorService } from '../../utils';

@Injectable()
export class ContactService {

    constructor(
        private http: HttpClient,
        private handleErrorService: HandleErrorService
    ) { }

    SendContactForm(contactForm: any): Observable<{}> {
        return this.http.post(environment.appBaseUrl + environment.apiBaseUrl + '/contact', contactForm)
            .pipe(
                catchError(this.handleErrorService.handleError<any>('Contact'))
            );
    }
}
