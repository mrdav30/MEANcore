import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../utils';
import { filter, intersection, map } from 'lodash';

import { environment } from '../../environments/environment';
import { ConfigService, MenuConfig } from '../utils';

@Component({
  moduleId: module.id,
  selector: 'app-menu',
  templateUrl: `app-menu.component.html`,
  styleUrls: [`./app-menu.component.css`]
})

export class AppMenuComponent implements OnInit {
  public appHome = environment.appDefaultRoute;
  public appLogo = environment.appLogo;
  //  UI Config
  public menus: MenuConfig[];
  public visibleMenus: MenuConfig[] = [];
  public showLoginNav = true;
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
    this.menus = this.configService.config.menuConfig ? this.configService.config.menuConfig : [];
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
    // if user has no roles defined, assign to default user role
    let userRoles = this.user && this.user.roles ? map(this.user.roles, (role) => {
      return role.name;
    }) : ['user'];
    if (!Array.isArray(userRoles)) {
      userRoles = [userRoles];
    }
    this.visibleMenus = filter(this.menus, (menu) => {
      return !menu.roles ||
        intersection(userRoles, menu.roles).length ? true : false;
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
