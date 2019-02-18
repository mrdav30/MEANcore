import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'app-page-not-found',
    templateUrl: `page-not-found.component.html`,
})
export class PageNotFoundComponent implements OnInit {
    public url: string;

    // tslint:disable-next-line
    constructor() { }

    ngOnInit() {
        this.url = window.document.URL;
    }
}
