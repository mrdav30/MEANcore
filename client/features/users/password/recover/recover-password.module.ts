import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { RecoverPasswordComponent } from './recover-password.component';

@NgModule({
  declarations: [
    RecoverPasswordComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbCollapseModule
  ]
})
export class RecoverPasswordModule { }
