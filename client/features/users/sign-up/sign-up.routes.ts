import { Route } from '@angular/router';

import { SignUpComponent } from './sign-up.component';

import { DirectAccessGuard } from '../../utils';

export const SignUpRoutes: Route[] = [
  {
    path: 'sign-up',
    redirectTo: 'sign-up/',
    pathMatch: 'full'
  },
  {
    path: 'sign-up/:install',
    component: SignUpComponent,
    canActivate: [DirectAccessGuard]
  }
];
