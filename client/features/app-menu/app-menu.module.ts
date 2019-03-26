import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';

import { AppMenuComponent } from './app-menu.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgbCollapseModule
    ],
    declarations: [
        AppMenuComponent
    ],
    exports: [AppMenuComponent]
})

export class AppMenuModule { }
