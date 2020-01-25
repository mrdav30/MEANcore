import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable()
export class DirectAccessGuard implements CanActivate {
    constructor(private router: Router) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        // If the previous URL was blank, then the user is directly accessing this page
        if (this.router.url === '/') {
            this.router.navigate([environment.appDefaultRoute]); // Navigate away to some other page
            return false;
        }
        return true;
    }
}
