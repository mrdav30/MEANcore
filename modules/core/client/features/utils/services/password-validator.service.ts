// password-strength tester based off of the OWASP Guidelines for enforcing secure passwords.
// https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#Implement_Proper_Password_Strength_Controls
import {
  Injectable
} from '@angular/core';
import * as owasp from '@shared_modules/owasp-password-strength-test';

@Injectable()
export class PasswordValidatorService {

  public getResult(password: string) {
    const result = owasp.passwordTest(password);
    return result;
  }

  public getPopoverMsg() {
    const popoverMsg = 'Please enter a passphrase or password with ' +
      owasp.owaspConfig.minLength +
      ' or more characters, numbers, lowercase, uppercase, and special characters.';

    return popoverMsg;
  }
}
