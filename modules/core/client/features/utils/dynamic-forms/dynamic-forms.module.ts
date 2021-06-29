import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { DynamicListComponent } from './dynamic-list.component';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicQuestionComponent } from './dynamic-questions/dynamic-question.component';

import * as dynamicQuestionClasses from './index';
export { dynamicQuestionClasses };

const components = [
    DynamicListComponent,
    DynamicFormComponent,
    DynamicQuestionComponent
];

@NgModule({
    declarations: [
        components
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbTooltipModule
    ],
    exports: [
        ...components
    ]
})

export class DynamicFormsModule { }
