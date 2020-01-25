import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../utils';

@Component({
    moduleId: module.id,
    selector: 'app-about-selector',
    templateUrl: `./about.component.html`
})

export class AboutComponent implements OnInit {

    constructor(
        private seoService: SeoService
    ) { }

    ngOnInit(): void {
        this.seoService.generateTags({
            title: 'About'
        });
    }
}
