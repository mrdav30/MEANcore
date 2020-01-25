import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { PrivacyPolicyComponent } from './privacy/privacy-policy.component';
import { TermsConditionsComponent } from './terms/terms-conditions.component';

import { ContactModule } from './contact/contact.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ContactModule
    ],
    declarations: [
        AboutComponent,
        PrivacyPolicyComponent,
        TermsConditionsComponent
    ]
})

export class AwarenessModule { }
