import { Injectable } from '@angular/core';
import * as owasp from 'owasp-password-strength-test/owasp-password-strength-test';

import { environment } from '../../../environments/environment';

@Injectable()
export class PasswordValidatorService {

    constructor() {
        owasp.config(environment.owasp);
    }

    public getResult(password) {
        const result = owasp.test(password);
        return result;
    }

    public getPopoverMsg() {
        const popoverMsg = 'Please enter a passphrase or password with '
            + owasp.configs.minLength
            + ' or more characters, numbers, lowercase, uppercase, and special characters.';

        return popoverMsg;
    }

}
