import { Component, OnChanges, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { PasswordValidatorService } from '../services/password-validator.service';

@Component({
    moduleId: module.id,
    selector: 'app-password-validator',
    templateUrl: `password-validator.component.html`
})
export class PasswordValidatorComponent implements OnChanges {
    @Input() passwordToCheck: string;
    @Output() GetPasswordValidation = new EventEmitter<any>();

    public requirementsColor: string;
    public requirementsProgress: string;
    // Requirements Meter - visual indicator for users
    public requirementsMeter = [{
        color: 'danger',
        progress: '20'
    }, {
        color: 'warning',
        progress: '40'
    }, {
        color: 'info',
        progress: '60'
    }, {
        color: 'primary',
        progress: '80'
    }, {
        color: 'success',
        progress: '100'
    }];

    constructor(
        private passwordValidatorService: PasswordValidatorService
    ) { }

    ngOnChanges(changes: { [passwordToCheck: string]: SimpleChange }): void {
        const password = changes.passwordToCheck.currentValue;
        this.updateProgressBar(password);
    }

    updateProgressBar(password: string) {
        const result = this.passwordValidatorService.getResult(password);
        let requirementsIdx = 0;

        if (result.errors.length < this.requirementsMeter.length) {
            requirementsIdx = this.requirementsMeter.length - result.errors.length - 1;
        }

        this.requirementsColor = this.requirementsMeter[requirementsIdx].color;
        this.requirementsProgress = this.requirementsMeter[requirementsIdx].progress;

        if (result.errors.length) {
            this.GetPasswordValidation.emit({
                passwordTooltip: this.passwordValidatorService.getPopoverMsg(),
                errorMessages: result.errors,
                status: true
            });
        } else {
            this.GetPasswordValidation.emit({
                passwordTooltip: '',
                errorMessages: [],
                status: false
            });
        }
    }
}
