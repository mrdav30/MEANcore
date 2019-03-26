import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

import { PasswordValidatorComponent } from './password-validator.component';

@NgModule({
  declarations: [
    PasswordValidatorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbProgressbarModule
  ],
  exports: [
    PasswordValidatorComponent
  ]
})
export class PasswordValidatorModule { }
