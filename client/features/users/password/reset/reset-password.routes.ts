import { Route } from '@angular/router';

import { ResetPasswordComponent } from './reset-password.component';

import { DirectAccessGuard } from '../../../utils';

export const ResetPasswordRoutes: Route[] = [
  {
    path: 'password/reset/:token',
    component: ResetPasswordComponent,
    canActivate: [DirectAccessGuard]
  }
];
