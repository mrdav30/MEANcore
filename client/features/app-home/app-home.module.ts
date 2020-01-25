import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppHomeComponent } from './app-home.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    AppHomeComponent
  ]
})

export class AppHomeModule {}
