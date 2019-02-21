import { Route } from '@angular/router';

import { SignUpComponent } from './sign-up.component';

import { DirectAccessGuard } from '../../utils';

export const SignUpRoutes: Route[] = [
  {
    path: 'sign-up',
    component: SignUpComponent,
    canActivate: [DirectAccessGuard]
  },
  {
    path: 'sign-up-admin/:install',
    component: SignUpComponent
  }
];
