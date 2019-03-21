import { Component, OnInit, OnDestroy } from '@angular/core';

import { MessagingService } from './messaging.service';

@Component({
    moduleId: module.id,
    selector: 'app-messaging',
    templateUrl: 'messaging.component.html',
    styleUrls: [`messaging.component.css`]

})
export class MessagingComponent implements OnInit, OnDestroy {
    messages: any[] = [];

    constructor(
        private messagingService: MessagingService
    ) { }

    ngOnInit() {
        this.messagingService.messages$.subscribe((res) => {
            if (res) {
                this.readResponse(res);
            }
        });
    }

    readResponse(res: any) {
        let type = 'error';
        if (res.status === 200) {
            type = 'success';
        }
        const msg: any = {
            message: res.body.message,
            msgType: type
        };

        this.messages.push(msg);
        setTimeout(() => {
            this.messages.splice(this.messages.indexOf(msg), 1);
        }, 5000);
    }

    ngOnDestroy() {
        this.messagingService.messages$.unsubscribe();
    }
}
