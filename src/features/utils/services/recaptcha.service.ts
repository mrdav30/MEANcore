import { Inject, Injectable, InjectionToken } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export const RECAPTCHA_URL = new InjectionToken('RECAPTCHA_URL');

@Injectable()
export class ReCaptchaValidatorService {

    constructor(
        private http: HttpClient,
        @Inject(RECAPTCHA_URL) private url
    ) { }

    validateToken(token: string) {
        return (_: AbstractControl) => {
            return this.http.get(this.url, { params: { token } }).pipe(
                map((res: any) => {
                    if (!res.success) {
                        return { tokenInvalid: true };
                    }
                    return null;
                })
            );
        };
    }
}
