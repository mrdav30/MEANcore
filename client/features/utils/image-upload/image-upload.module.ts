import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';

import { ImageUploadComponent } from './image-upload.component';

@NgModule({
    declarations: [
        ImageUploadComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FileUploadModule
    ],
    exports: [
        ImageUploadComponent
    ]
})
export class ImageUploadModule { }
