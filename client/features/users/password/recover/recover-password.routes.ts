import { Route } from '@angular/router';

import { RecoverPasswordComponent } from './recover-password.component';

import { DirectAccessGuard } from '../../../utils';

export const RecoverPasswordRoutes: Route[] = [
  {
    path: 'password/recover/:usernameOrEmail',
    component: RecoverPasswordComponent,
    canActivate: [DirectAccessGuard]
  }
];
