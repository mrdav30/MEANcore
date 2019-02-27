import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { ConfigService } from './config.service';

@Injectable()
export class AppLoadService {
    private getUserUrl = environment.appBaseUrl + environment.apiBaseUrl + '/users/me';

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) { }

    initializeApp(): Promise<any> {
        const profilePromise = this.http.get(this.getUserUrl)
            .toPromise()
            .then((data: any) => {

                this.configService.user = data ? data : null;
            });

        return profilePromise;
    }
}