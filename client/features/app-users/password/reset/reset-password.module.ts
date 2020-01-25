import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilsModule } from '../../../utils';

import { ResetPasswordComponent } from './reset-password.component';

@NgModule({
  declarations: [
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbCollapseModule,
    UtilsModule
  ]
})
export class ResetPasswordModule { }
