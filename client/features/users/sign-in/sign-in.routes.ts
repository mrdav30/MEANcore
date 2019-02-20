import { Route } from '@angular/router';

import { SignInComponent } from './sign-in.component';

import { DirectAccessGuard } from '../../utils';

export const SignInRoutes: Route[] = [
  {
    path: 'sign-in',
    component: SignInComponent,
    canActivate: [DirectAccessGuard]
  }
];
