import { Component, OnInit } from '@angular/core';

import { Application } from './models/application';
import { Role } from './models/role';
import { Permission } from './models/permission';
import { UserAccessControlService } from './services/user-access-control.service';

@Component({
    moduleId: module.id,
    selector: 'app-user-access-control',
    templateUrl: `./user-access-control.component.html`
})

export class UserAccessControlComponent implements OnInit {
    ngOnInit() { }
}
