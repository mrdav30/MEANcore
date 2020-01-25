import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../utils';

@Component({
    moduleId: module.id,
    selector: 'app-home',
    templateUrl: 'app-home.component.html',
    styleUrls: ['app-home.component.css']
})
export class AppHomeComponent implements OnInit {
    isLoggedIn = false;

    constructor(
        public authService: AuthService,
        public router: Router
    ) { }

    ngOnInit() {
        if (this.authService.user) {
            this.isLoggedIn = this.authService.user ? true : false;
        }
    }
}
