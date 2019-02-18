import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ConfigService } from '../services/config.service';

@Component({
    moduleId: module.id,
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {
    private uploader: FileUploader;
    private hasDragOver = false;

    @Input()
    private imageWidth = 200;

    @Input()
    private imageHeight = 200;

    @Input()
    private currentUrl = '';

    @Output()
    private urlChange = new EventEmitter();

    constructor(
        private configService: ConfigService
    ) {
        this.uploader = new FileUploader({
            url: this.configService.appBase + this.configService.imageUploadApi,
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
