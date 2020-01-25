import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { filter, intersection, map, orderBy } from 'lodash';

import { environment } from '../../environments/environment';

import { UserAccessControlService } from '../user-access-control/services/user-access-control.service'
import { ConfigService, AuthService, MenuConfig } from '../utils';

@Component({
  moduleId: module.id,
  selector: 'app-menu',
  templateUrl: `app-menu.component.html`,
  styleUrls: [`./app-menu.component.css`]
})

export class AppMenuComponent implements OnInit {
  public appDefaultRoute = environment.appDefaultRoute;
  public appLogo = environment.appLogo;
  //  UI Config
  public menus: MenuConfig[];
  public visibleMenus: MenuConfig[] = [];
  public showLoginNav = true;
  public showSearchNav = true;
  // used to toggle search input
  public isSearchVisible = false;
  public appSearchRoute = '';
  public searchQuery = '';
  public isNavbarCollapsed = true;
  public currentUser: any = false;
  public currentUserAvatar: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private configService: ConfigService,
    private uacService: UserAccessControlService
  ) { }

  ngOnInit(): void {
    this.authService.userChange$.subscribe(currentUser => {
      this.onSetUser(currentUser);
    });
    this.uacService.featureChange$.subscribe(() => {
      this.setMenuUI();
    });
    this.onSetUser(false);
    this.onResize(window);
  }

  @HostListener('window:resize', ['$event.target'])
  onResize(event: any) {
    if (event.innerWidth > 990) {
      this.isNavbarCollapsed = true;
    }
  }

  onSetUser(currentUser?: any): void {
    this.currentUser = currentUser ? currentUser : this.authService.user ? this.authService.user : false;
    this.currentUserAvatar = this.currentUser ? this.currentUser.avatarUrl : null;
    this.setMenuUI();
  }

  setMenuUI(): void {
    this.menus = this.configService.config.menuConfig ? this.configService.config.menuConfig : [];
    // if currentUser has no roles defined, assign to default currentUser role
    let userRoles = this.currentUser && this.currentUser.roles ? map(this.currentUser.roles, (role) => {
      return role.name;
    }) : ['currentUser'];
    if (!Array.isArray(userRoles)) {
      userRoles = [userRoles];
    }
    this.visibleMenus = filter(this.menus, (menu) => {
      return !menu.roles ||
        intersection(userRoles, menu.roles).length ? true : false;
    });

    this.visibleMenus = orderBy(this.visibleMenus, 'order_priority', 'asc');
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
