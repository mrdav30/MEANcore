import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule } from '../utils';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { AppFooterComponent } from './app-footer.component';

import { AwarenessModule } from '../app-awareness/app-awareness.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        UtilsModule,
        AwarenessModule,
        NgbTooltipModule
    ],
    declarations: [
        AppFooterComponent
    ]
})

export class AppFooterModule { }
