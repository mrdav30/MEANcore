import { Route } from '@angular/router';

import { SignUpComponent } from './sign-up.component';

export const SignUpRoutes: Route[] = [
  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {
    path: 'sign-up-admin/:install',
    component: SignUpComponent
  }
];
