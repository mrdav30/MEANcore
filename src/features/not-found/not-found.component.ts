import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'app-not-found',
    templateUrl: `not-found.component.html`,
})
export class NotFoundComponent implements OnInit {
    public url: string;

    // tslint:disable-next-line
    constructor() { }

    ngOnInit() {
        this.url = window.document.URL;
    }
}
