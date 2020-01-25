import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../utils';

@Component({
    moduleId: module.id,
    selector: 'app-privacy-policy-selector',
    templateUrl: `./privacy-policy.component.html`
})

export class PrivacyPolicyComponent implements OnInit {

    constructor(
        private seoService: SeoService
    ) { }

    ngOnInit(): void {
        this.seoService.generateTags({
            title: 'Privacy Policy'
        });
    }
}
