import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

import { split } from 'lodash';

import { environment } from '../../../environments/environment';

import { ImageUploadService } from './image-upload.service';

@Component({
    moduleId: module.id,
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
    public uploader: FileUploader;
    public hasDragOver = false;
    public endPointBase = environment.appBaseUrl + environment.apiBaseUrl + environment.imageBaseUrl;

    @Input()
    public imageWidth = 200;

    @Input()
    public imageHeight = 200;

    // Type of input that matches
    // Should match to option under config.uploads.images.options
    @Input()
    public uploadType = '';

    @Input()
    public currentUrl = '';

    // Set to true to clear the current image from the view after each upload
    @Input()
    public clearCurrent = true;

    // Set to true to replace the current image before each upload
    @Input()
    public replaceCurrent = false;

    @Output()
    public urlChange = new EventEmitter();

    constructor(
        private imageUploadService: ImageUploadService
    ) { }

    ngOnInit(): void {
        this.uploader = new FileUploader({
            url: this.endPointBase + '?upload=' + this.uploadType,
            disableMultipart: false,
            autoUpload: true,
            itemAlias: 'upload'
        });

        this.uploader.onBeforeUploadItem = async () => {
            if (this.replaceCurrent && this.currentUrl.length) {
                await this.clearImage();
            }
        };

        this.uploader.response.subscribe((res) => {
            res = JSON.parse(res);
            // Upload returns a JSON with the image ID
            this.currentUrl = res.url;
            this.urlChange.emit(this.currentUrl);
        }, (error) => {
            alert('Error uploading image!');
        });
    }

    public fileOver(e: any): void {
        this.hasDragOver = e;
    }

    public async clearImage(): Promise<void> {
        if (this.currentUrl.length) {
            // Split the image url and return only the relate image path
            const imagePath = split(this.currentUrl, this.endPointBase)[1];
            this.imageUploadService.removeImage(imagePath)
                .then(() => {
                    if (this.clearCurrent) {
                        this.currentUrl = '';
                    }
                });
        }
    }
}
