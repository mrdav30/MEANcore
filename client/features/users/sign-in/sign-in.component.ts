import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';

import { AuthService } from '../../utils';

@Component({
  moduleId: module.id,
  selector: 'app-sign-in',
  templateUrl: `sign-in.component.html`
})

export class SignInComponent implements OnInit, AfterViewInit {
  @ViewChild('usernameOrEmail') usernameOrEmail: NgModel;
  @ViewChild('userFocus') userFocus: ElementRef;
  @ViewChild('password') password: NgModel;
  @ViewChild('passFocus') passFocus: ElementRef;
  public user: any = {
    usernameOrEmail: '',
    password: ''
  };
  public isUserValidated = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.authService.user) {
      this.redirectPostLogin();
    }
  }

  ngAfterViewInit(): void {
    this.userFocus.nativeElement.focus();
  }

  validateUser(): void {
    this.authService.valuedateUser(this.user).subscribe(
      (data: any) => {
        if (data) {
          if (data.userExists) {
            this.isUserValidated = true;
            setTimeout(() => this.passFocus.nativeElement.focus());
          } else {
            this.usernameOrEmail.control.setErrors({ notused: true });
          }
        }
      }
    );
  }

  signIn(): void {
    this.authService.signIn(this.user).subscribe(
      (data: any) => {
        if (data) {
          if (data.invalidSecret) {
            this.password.control.setErrors({ incorrect: true });
          } else if (this.authService.user) {
            this.redirectPostLogin();
          }
        }
      });
  }

  redirectPostLogin(): void {
    // Get the redirect URL from our auth service
    const redirect = this.authService.redirectUrl;
    // Redirect the user
    this.router.navigate([redirect]);
  }
}
