// Auth service - Use this service to pass the config of the app required at the bootstrap.
// this service use must be restricted to pass data at the boostrap.

import { Injectable } from '@angular/core';

export interface MenuConfig { menus: [{ label: string; route: string; permission: string[]; visible: boolean; }]; }

@Injectable()
export class ConfigService {
  // if page is refreshed while user is logged in, we pass user information to application bootsrap so authService get user
  public user: any;
  public APP_TITLE = '';
  public appBase = '/';
  public imageUploadApi = '';
  public MENU_CONFIG: MenuConfig[] = [];
  public appClientConfig: any = {
    showLoginNav: true,
    showSearchNav: false,
    siteSearchRoute: '/'
  };
  public RECAPTCHA_SITE_KEY = '';
  public appLogo: string;
  public owasp: any = {};
}
