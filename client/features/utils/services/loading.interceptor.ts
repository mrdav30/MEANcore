import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor(
        private loadingService: LoadingService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap(res => {
                if (res.type === HttpEventType.Sent) {
                    this.loadingService.loading$.next(true);
                }

                if (res.type === HttpEventType.Response) {
                    this.loadingService.loading$.next(false);
                }
            })
        );
    }
}
