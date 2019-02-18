import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class HandleErrorService {

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    public handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // In real world app,  use a remote logging infrastructure
            const errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : 'Server error';
            console.error(errMsg); // log to console

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
