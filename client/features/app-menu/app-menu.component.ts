import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { AuthService, ConfigService, MenuConfig } from '../utils';

@Component({
  moduleId: module.id,
  selector: 'app-menu',
  templateUrl: `app-menu.component.html`,
  styleUrls: [`./app-menu.component.css`]
})

export class AppMenuComponent implements OnInit {
  public appHome: string;
  public appLogo: string;
  //  UI Config
  public menus: MenuConfig[] = [];
  public visibleMenus: MenuConfig[] = [];
  public showLoginNav = false;
  public showSearchNav = true;
  // used to toggle search input
  public isSearchVisible = false;
  public appSearchRoute = '';
  public searchQuery: string;
  public isNavbarCollapsed = true;
  public user: any = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.appHome = this.configService.appHome;
    this.appLogo = this.configService.appLogo;
    this.menus = this.configService.MENU_CONFIG;
    this.authService.userChange$.subscribe(user => {
      this.onSetUser(user);
    });
    this.onSetUser();
    this.onResize(window);
  }

  @HostListener('window:resize', ['$event.target'])
  onResize(event) {
    if (event.innerWidth > 990) {
      this.isNavbarCollapsed = true;
    }
  }

  onSetUser(user?: any): void {
    this.user = user ? user : this.authService.user ? this.authService.user : false;
    this.setMenuUI();
  }

  setMenuUI(): void {
    let userRoles = this.user && this.user.roles ? this.user.roles : ['user'];
    if (!Array.isArray(userRoles)) {
      userRoles = [userRoles];
    }
    const userPermissions = this.user && this.user.permissions ? this.user.permissions : ['user'];
    this.visibleMenus = _.filter(this.menus, (menu) => {
      return _.intersection(userRoles, menu.roles).length ||
        _.includes(userPermissions, _.toLower(menu.permission));
    });
  }

  onSubmit(): void {
    this.isSearchVisible = false;
    this.router.navigate([this.appSearchRoute, this.searchQuery]);
    this.searchQuery = null;
  }

  logout(): void {
    this.authService.signOut();
  }
}
