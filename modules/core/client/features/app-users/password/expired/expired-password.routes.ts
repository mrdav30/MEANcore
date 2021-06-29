import { Route } from '@angular/router';

import { ExpiredPasswordComponent } from './expired-password.component';

export const ExpiredPasswordRoutes: Route[] = [
  {
    path: 'password/expired',
    component: ExpiredPasswordComponent
  }
];
