import { Injectable } from '@angular/core';
import * as owasp from 'owasp-password-strength-test/owasp-password-strength-test';

@Injectable()
export class PasswordValidatorService {
    public owaspConfig = {
        allowPassphrases: true,
        maxLength: 128,
        minLength: 10,
        minPhraseLength: 20,
        minOptionalTestsToPass: 4
    };

    constructor() {
        owasp.config(this.owaspConfig);
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
