import { Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms';

import { AuthService } from '../../utils';

export interface RouteParams {
  install: string;
}

@Component({
  moduleId: module.id,
  selector: 'app-sign-up',
  templateUrl: `sign-up.component.html`
})
export class SignUpComponent implements OnInit {
  @ViewChild('username') username: NgModel;
  @ViewChild('password') password: NgModel;
  public user: any = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  };
  public possibleUsername: string;
  public passwordTooltip: string;
  public passwordErrors: string[];
  public isInstallation = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.isInstallation = params.install ? true : false;
    });
  }

  onSubmit(): void {
    if (!this.isInstallation) {
      this.authService.signUp(this.user).subscribe((data: any) => {
        this.processResult(data);
      });
    } else {
      this.authService.install(this.user).subscribe((data: any) => {
        this.processResult(data);
      });
    }
  }

  processResult(data: any): void {
    if (data) {
      if (data.userExists) {
        this.possibleUsername = data.possibleUsername;
        this.username.control.setErrors({ alreadyused: true });
      } else {
        if (this.authService.user) {
          this.redirectPostLogin();
        }
      }
    }
  }

  setPasswordValidation(passwordValidation: any): void {
    this.passwordTooltip = passwordValidation.passwordTooltip;
    this.passwordErrors = passwordValidation.errorMessages;
    if (this.password && !this.password.control.pristine) {
      if (passwordValidation.status) {
        this.password.control.setErrors({ incorrect: true });
      } else {
        this.password.control.setErrors(null);
      }
    }
    this.cdr.detectChanges();
  }

  redirectPostLogin(): void {
    // Get the redirect URL from our auth service
    // If no redirect has been set, use the default
    const redirect = this.authService.redirectUrl ? this.authService.redirectUrl : 'home';
    // Redirect the user
    this.router.navigate([redirect]);
  }
}
