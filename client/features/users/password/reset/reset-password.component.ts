import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms';

import { AuthService } from '../../../utils';

export interface RouteParams {
  token: string;
}

@Component({
  moduleId: module.id,
  selector: 'app-reset-password',
  templateUrl: `reset-password.component.html`
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild('newPassword') newPassword: NgModel;
  private credentials: any = {
    token: '',
    newPassword: ''
  };
  private isTokenInvalid = false;
  private isSecretReset = false;
  private passwordTooltip: string;
  private passwordErrors: string[];

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: RouteParams) => {
      if (params.token === 'invalid') {
        this.isTokenInvalid = true;
      } else {
        this.credentials.token = params.token;
      }
    });
  }

  resetPassword(): void {
    this.authService.reset(this.credentials).subscribe(
      (data: any) => {
        if (data) {
          if (data.invalidSecret) {
            this.newPassword.control.setErrors({ invalidsecret: true });
          } else if (data.tokenInvalid) {
            this.isTokenInvalid = data.tokenInvalid;
          } else if (data.secretReset) {
            this.isSecretReset = data.secretReset;
          }
        }
      });
  }

  setPasswordValidation(passwordValidation: any): void {
    this.passwordTooltip = passwordValidation.passwordTooltip;
    this.passwordErrors = passwordValidation.errorMessages;
    if (this.newPassword && !this.newPassword.control.pristine) {
      if (passwordValidation.status) {
        this.newPassword.control.setErrors({ incorrect: true });
      } else {
        this.newPassword.control.setErrors(null);
      }
    }
    this.cdr.detectChanges();
  }

}
