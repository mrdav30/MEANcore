import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../utils';

@Component({
    moduleId: module.id,
    selector: 'app-terms-conditions-selector',
    templateUrl: `./terms-conditions.component.html`
})

export class TermsConditionsComponent implements OnInit {

    constructor(
        private seoService: SeoService
    ) { }

    ngOnInit(): void {
        this.seoService.generateTags({
            title: 'Terms of Service'
        });
    }
}
