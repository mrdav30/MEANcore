import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';

import { ImageUploadComponent } from './image-upload.component';

import { ImageUploadService } from './image-upload.service';

@NgModule({
    declarations: [
        ImageUploadComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FileUploadModule
    ],
    providers: [
        ImageUploadService
    ],
    exports: [
        ImageUploadComponent
    ]
})
export class ImageUploadModule { }
