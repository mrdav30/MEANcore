import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { ConfigService } from './config.service';

@Injectable()
export class AppLoadService {
    private uacConfigUrl = environment.appBaseUrl + environment.apiBaseUrl + '/uac/config';

    constructor(
        public configService: ConfigService,
        private http: HttpClient
    ) { }

    initializeApp(): Promise<any> {
        const configPromise = this.http.get(this.uacConfigUrl)
            .toPromise()
            .then((data: any) => {
                if (data) {
                    // set user stored in server session
                    this.configService.user = data.user ? data.user : null;
                    this.configService.config = data.config ? data.config : null;
                }
            });

        return configPromise;
    }
}
