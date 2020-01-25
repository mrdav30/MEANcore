import { Component, OnInit } from '@angular/core';

import { ContactDetails } from './contact';
import { ContactService } from './contact.service';
import { SeoService } from '../../utils';

@Component({
    moduleId: module.id,
    selector: 'app-contact-selector',
    templateUrl: `./contact.component.html`
})

export class ContactComponent implements OnInit {
    public contactDetails: ContactDetails;
    public isMessageSent = false;

    constructor(
        private seoService: SeoService,
        private contactService: ContactService
    ) { }

    ngOnInit(): void {
        this.contactDetails = new ContactDetails();
        this.seoService.generateTags({
            title: 'Contact'
        });
     }

    onSubmit(): void {
        this.contactService.SendContactForm(this.contactDetails)
            .subscribe(data => {
                this.isMessageSent = true;
            });
    }
}
