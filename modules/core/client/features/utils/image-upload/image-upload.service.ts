import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@env';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ConfigService } from '../services/config.service';
import { HandleErrorService } from '../services/handle-error.service';

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
                catchError((err: any) => {
                    console.log('error', err);
                    return throwError(() => {
                        this.handleErrorService.handleError<any>('image-upload', err);
                    });
                })
            )
            .toPromise();
    }
}
