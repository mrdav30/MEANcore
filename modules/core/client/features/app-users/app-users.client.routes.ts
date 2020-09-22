import {
  Route
} from '@angular/router';

import { SignInRoutes } from './sign-in/sign-in.routes';
import { RecoverPasswordRoutes } from './password/recover/recover-password.routes';
import { ResetPasswordRoutes } from './password/reset/reset-password.routes';
import { SignUpRoutes } from './sign-up/sign-up.routes';
import { ProfileRoutes } from './profile/profile.routes';

export const AppUsersRoutes: Route[] = [
  ...SignInRoutes,
  ...RecoverPasswordRoutes,
  ...ResetPasswordRoutes,
  ...SignUpRoutes,
  ...ProfileRoutes,
];
