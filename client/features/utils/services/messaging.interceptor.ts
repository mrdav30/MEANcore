import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessagingService } from './messaging.service';

@Injectable()
export class MessagingInterceptor implements HttpInterceptor {
    constructor(
        private messagingService: MessagingService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap((res: any) => {
                // only trigger observable if response contains a message
                if (res.type === HttpEventType.Response && res.body && res.body.message) {
                    this.messagingService.messages$.next(res);
                }
            })
        );
    }
}
