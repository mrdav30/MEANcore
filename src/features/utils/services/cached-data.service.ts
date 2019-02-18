import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount, catchError } from 'rxjs/operators';
import * as _ from 'lodash';

let allData: any = {};

@Injectable()
export class CachedDataService {
    constructor(
        private http: HttpClient
    ) {
        setTimeout(() => {
            allData = {};
        }, 1000 * 60 * 60 * 12); // exprire cache after 12 hours of launch;
    }

    populateFields(res: any) {
        if (res.fields) {
            res.result = _.map(res.result, el => { // _.map is fater then map at least 50%
                const tmp = {};
                _.forEach(res.fields, (key, ind) => {
                    tmp[key] = el[ind];
                });
                return tmp;
            });
        }
        return res;
    }

    getData(url: string): any {
        if (!allData[url]) {
            allData[url] = this.http.get(url).pipe(
                map((response) => response),
                //  Mapping fields to array and create object in case we get list or arrays
                map(this.populateFields),
                map((res: any) => {
                    Object.freeze(res.result); // making sure that no one modified list. but still they can modify values (TODO fix)
                    return res;
                }),
                publishReplay(1),
                refCount(),
                catchError(err => {
                    console.log('error', err);
                    delete allData[url];
                    return Observable.throw(err);
                })
            );
        }
        return allData[url];
    }
}
