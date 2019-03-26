import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { catchError, share, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

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
        return this.http.put(environment.appBaseUrl + environment.apiBaseUrl + '/image-uploads', { imagePath })
            .pipe(
                catchError((err) => {
                    return this.handleErrorService.handleError<any>(err);
                })
            )
            .toPromise();
    }
}
