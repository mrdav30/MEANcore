import { Route } from '@angular/router';

import { RecoverPasswordComponent } from './recover-password.component';

export const RecoverPasswordRoutes: Route[] = [
  {
    path: 'password/recover/:usernameOrEmail',
    component: RecoverPasswordComponent
  }
];
