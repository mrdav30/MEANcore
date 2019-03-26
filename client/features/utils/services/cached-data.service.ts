import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { tap, publishReplay, refCount, catchError } from 'rxjs/operators';
import { map, forEach } from 'lodash';

import { HandleErrorService } from './handle-error.service';

let allData: any = {};

@Injectable()
export class CachedDataService {
    constructor(
        private http: HttpClient,
        private handleErrorService: HandleErrorService
    ) {
        setTimeout(() => {
            allData = {};
        }, 1000 * 60 * 60 * 12); // exprire cache after 12 hours of launch;
    }

    populateFields(res: any, done) {
        if (res.fields) {
            res.result = map(res.result, el => { // _.map is fater then map at least 50%
                const tmp = {};
                forEach(res.fields, (key, ind) => {
                    tmp[key] = el[ind];
                });
                return tmp;
            });
        }
        return done(res);
    }

    getData(url: string): any {
        if (!allData[url]) {
            allData[url] = this.http.get(url).pipe(
                tap((res: any) => {
                    this.populateFields(res, (obj: any) => {
                        Object.freeze(obj.result); // making sure that no one modified list. but still they can modify values (TODO fix)
                        return obj;
                    });
                }),
                publishReplay(1),
                refCount(),
                catchError((err) => {
                    console.log('error', err);
                    delete allData[url];
                    return this.handleErrorService.handleError<any>();
                })
            );
        }
        return allData[url];
    }
}
