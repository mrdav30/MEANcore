import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilsModule } from '../../utils';

import { SignUpComponent } from './sign-up.component';

@NgModule({
  declarations: [
    SignUpComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    UtilsModule,
    NgbTooltipModule
  ],
  exports: [
    SignUpComponent
  ]
})
export class SignUpModule { }
