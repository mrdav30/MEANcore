import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { ConfigService } from './config.service';

@Injectable()
export class AppLoadService {
    private getAppConfig = environment.appBaseUrl + environment.apiBaseUrl + '/core/config';

    constructor(
        private http: HttpClient,
        private configService: ConfigService
    ) { }

    initializeApp(): Promise<any> {
        const configPromise = this.http.get(this.getAppConfig)
            .toPromise()
            .then((data: any) => {

                this.configService = data ? data : null;
            });

        return configPromise;
    }
}