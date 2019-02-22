import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { environment } from '../../../environments/environment';

@Component({
    moduleId: module.id,
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
    public uploader: FileUploader;
    public hasDragOver = false;

    @Input()
    public imageWidth = 200;

    @Input()
    public imageHeight = 200;

    @Input()
    public currentUrl = '';

    @Output()
    public urlChange = new EventEmitter();

    constructor() {
        this.uploader = new FileUploader({
            url: environment.appBaseUrl + environment.imageUploadUrl,
            disableMultipart: false,
            autoUpload: true,
            itemAlias: 'upload'
        });

        this.uploader.response.subscribe((res) => {
            res = JSON.parse(res);
            // Upload returns a JSON with the image ID
            this.currentUrl = res.url;
            this.urlChange.emit(this.currentUrl);
        }, (error) => {
            alert('Error uploading image!');
        });
    }

    // tslint:disable-next-line
    ngOnInit() {
    }

    public fileOver(e: any): void {
        this.hasDragOver = e;
    }
}
