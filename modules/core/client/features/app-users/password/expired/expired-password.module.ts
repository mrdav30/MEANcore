import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ExpiredPasswordComponent } from './expired-password.component';

@NgModule({
  declarations: [
    ExpiredPasswordComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ]
})
export class ExpiredPasswordModule { }
