import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../utils';

import * as _ from 'lodash';

@Component({
    moduleId: module.id,
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
    isLoggedIn: boolean = false;

    constructor(
        public _authService: AuthService,
        public _router: Router
    ) { }

    ngOnInit() {
        if (this._authService.user) {
            this.isLoggedIn = this._authService.user ? true : false;
        }
    }
}
