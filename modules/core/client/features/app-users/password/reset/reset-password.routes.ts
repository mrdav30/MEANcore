import { Route } from '@angular/router';

import { ResetPasswordComponent } from './reset-password.component';

export const ResetPasswordRoutes: Route[] = [
  {
    path: 'password/reset/:username/:token',
    component: ResetPasswordComponent
  }
];
