import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms';

import { environment } from '../../../../environments/environment';

import { AuthService } from '../../../utils';

export interface RouteParams {
  usernameOrEmail: string;
}

@Component({
  moduleId: module.id,
  selector: 'app-recover-password',
  templateUrl: `recover-password.component.html`
})
export class RecoverPasswordComponent implements OnInit {
  @ViewChild('usernameOrEmail', {static: false}) usernameOrEmail: NgModel;
  @ViewChild('password', {static: false}) password: NgModel;
  public user: any = {
    usernameOrEmail: '',
    password: ''
  };
  public isSecretValidated = false;
  public isSecretReset = false;
  public message: string;

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Password Recovery' + environment.metaTitleSuffix);
    this.route.params.subscribe(params => {
      this.user.usernameOrEmail = params.usernameOrEmail;
    });
  }

  recoverPassword(): void {
    this.authService.signIn(this.user).subscribe(
      (signInResult: any) => {
        if (signInResult) {
          if (signInResult.invalidSecret) {
            this.authService.forgot(this.user).subscribe(
              (forgotResult: any) => {
                if (forgotResult) {
                  if (forgotResult.isSecretReset) {
                    this.isSecretReset = forgotResult.isSecretReset;
                    this.message = forgotResult.message;
                  }
                }
              });
          } else if (this.authService.user) {
            this.isSecretValidated = true;
          }
        }
      });
  }

  redirectPostLogin(): void {
    // Get the redirect URL from our auth service
    // If no redirect has been set, use the default
    const redirect = this.authService.redirectUrl ? this.authService.redirectUrl : 'home';
    // Redirect the user
    this.router.navigate([redirect]);
  }
}
