import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Role } from '../models/role';
import { Application } from '../models/application';
import { User } from '../models/user';

@Injectable()
export class UserAccessControlService {
    constructor(private http: HttpClient) { }
}
