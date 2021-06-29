// Config service - Use this service to pass the config of the app requried at the bootstrap.
// This service use must restricted to pass data at the boostrap.

import { Injectable } from '@angular/core';

export interface MenuConfig { name: string; route: string; roles: string[]; permission: string; visible: boolean; }

@Injectable()
export class ConfigService {
  // if page is refreshed while user is logged in, we pass user information to application bootsrap so authService get user
  user: any = false;
  config: {
    menuConfig: MenuConfig[];
  };
}
