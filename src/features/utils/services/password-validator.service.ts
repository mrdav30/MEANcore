import { Injectable } from '@angular/core';
import * as owasp from 'owasp-password-strength-test/owasp-password-strength-test';

import { ConfigService } from './config.service';

@Injectable()
export class PasswordValidatorService {

    constructor(
        private configService: ConfigService
    ) {
        owasp.config(this.configService.owasp);
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
