import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UtilsModule } from '../../utils';

import { SignInComponent } from './sign-in.component';

@NgModule({
  declarations: [
    SignInComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    UtilsModule
  ]
})
export class SignInModule { }
