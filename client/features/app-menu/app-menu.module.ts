import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppMenuComponent } from './app-menu.component';
import { UtilsModule } from '../utils';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        UtilsModule
    ],
    declarations: [
        AppMenuComponent
    ],
    exports: [AppMenuComponent]
})

export class AppMenuModule { }
