import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '@env';

import { ConfigService } from '../services/config.service';
import { HandleErrorService } from '../services/handle-error.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ImageUploadService {
    constructor(
        public configService: ConfigService,
        private http: HttpClient,
        private handleErrorService: HandleErrorService
    ) { }

    removeImage(imagePath: string): Promise<any> {
        return lastValueFrom(this.http.put(environment.appBaseUrl + environment.apiBaseUrl + '/image-uploads', { imagePath }));
    }
}
