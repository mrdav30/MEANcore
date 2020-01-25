import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@Component({
    moduleId: module.id,
    selector: 'app-unauthorized',
    templateUrl: `unauthorized.component.html`,
})
export class UnauthorizedComponent implements OnInit {
    public url: string;

    // tslint:disable-next-line
    constructor(
        private router: Router
    ) { }

    ngOnInit() {
        // navigate back to app base after 2 seconds
        setTimeout(() => {
            this.router.navigate([environment.appBaseUrl]);
        }, 2000);
    }
}
