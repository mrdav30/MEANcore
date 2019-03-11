import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DynamicListComponent } from './dynamic-list.component';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormQuestionComponent } from './dynamic-questions/dynamic-form-question.component';

import * as dynamicFormClasses from './index';
export { dynamicFormClasses };

const components = [
    DynamicListComponent,
    DynamicFormComponent,
    DynamicFormQuestionComponent
];

@NgModule({
    declarations: components,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        ...components
    ]
})

export class DynamicFormsModule { }
