import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { HandleErrorService } from './handle-error.service';

// generic data service to be used as base for other entity services
export abstract class AbstractRestService {
    protected appBaseUrl = environment.appBaseUrl;
    protected apiBaseUrl = environment.apiBaseUrl;

    constructor(
        protected http: HttpClient,
        protected actionUrl: string,
        protected handleErrorService: HandleErrorService
    ) { }

    GetAll(): Observable<{}> {
        return this.http.get(this.appBaseUrl + this.apiBaseUrl + this.actionUrl)
            .pipe(
                catchError(this.handleErrorService.handleError())
            );
    }

    GetById(id: string): Observable<{}> {
        return this.http.get(this.appBaseUrl + this.apiBaseUrl + this.actionUrl + '/' + id)
            .pipe(
                catchError(this.handleErrorService.handleError())
            );
    }

    Save(entity: any): Observable<{}> {
        if (entity._id) {
            // update
            return this.http.put(this.appBaseUrl + this.apiBaseUrl + this.actionUrl + '/' + entity._id, entity)
                .pipe(
                    catchError(this.handleErrorService.handleError())
                );
        } else {
            // create
            return this.http.post(this.appBaseUrl + this.apiBaseUrl + this.actionUrl, entity)
                .pipe(
                    catchError(this.handleErrorService.handleError())
                );
        }
    }

    Delete(id: string): Observable<{}> {
        return this.http.delete(this.appBaseUrl + this.apiBaseUrl + this.actionUrl + '/' + id)
            .pipe(
                catchError(this.handleErrorService.handleError())
            );
    }
}
