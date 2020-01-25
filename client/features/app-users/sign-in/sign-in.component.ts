import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';

import { environment } from '../../../environments/environment';

import { AuthService } from '../../utils';

@Component({
  moduleId: module.id,
  selector: 'app-sign-in',
  templateUrl: `sign-in.component.html`
})

export class SignInComponent implements OnInit, AfterViewInit {
  @ViewChild('usernameOrEmail', {static: false}) usernameOrEmail: NgModel;
  @ViewChild('userFocus', {static: false}) userFocus: ElementRef;
  @ViewChild('password', {static: false}) password: NgModel;
  @ViewChild('passFocus', {static: false}) passFocus: ElementRef;
  public user: any = {
    usernameOrEmail: '',
    password: ''
  };
  public isUserValidated = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Sign-In' + environment.metaTitleSuffix);
    if (this.authService.user) {
      this.redirectPostLogin();
    }
  }

  ngAfterViewInit(): void {
    this.userFocus.nativeElement.focus();
  }

  validateUser(): void {
    this.authService.validateUser(this.user).subscribe(
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
