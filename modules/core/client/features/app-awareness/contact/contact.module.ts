import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { ContactComponent } from './contact.component';

import { ContactService } from './contact.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgbCollapseModule
    ],
    declarations: [
        ContactComponent
    ],
    providers: [
        ContactService
    ]
})

export class ContactModule { }
