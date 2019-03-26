import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';

import { intersection, map, flatMap } from 'lodash';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot | any, state: RouterStateSnapshot) {

    const routeData = route.data || {};
    const user = this.authService.user;
    const userRoles = map(user.roles, (role) => {
      return role.name;
    });
    const userPermissions = flatMap(user.roles, (role) => {
      return role.featurePermissions;
    });

    // if public url
    if (routeData.isPublic) {
      return true;
    }

    // no public access specified and user not logged in
    if (!this.authService.user) {
      // Store the attempted URL for redirecting
      this.authService.redirectUrl = state.url;

      // Navigate to the sign-in page
      this.router.navigate(['/sign-in']);
      return false;
    }

    // route is role based
    if (routeData.roles) {
      if (!intersection(routeData.roles, userRoles).length) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    // route is permission based
    if (routeData.permissions && !intersection(routeData.permissions, user.permissions).length) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
