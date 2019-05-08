import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UtilsModule } from '../../utils';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { ProfileFormComponent } from './profile-form.component';

import { ProfileService } from '../../utils/services/profile.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgbTooltipModule,
        UtilsModule
    ],
    exports: [
        ProfileFormComponent
    ],
    declarations: [
        ProfileFormComponent
    ],
    providers: [
        ProfileService
    ]
})

export class ProfileModule { }
