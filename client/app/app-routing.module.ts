import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { environment } from '../environments/environment';

import { PageNotFoundComponent } from '../features/page-not-found/page-not-found.component';

import { SignInRoutes } from '../features/users/sign-in/sign-in.routes';
import { RecoverPasswordRoutes } from '../features/users/password/recover/recover-password.routes';
import { ResetPasswordRoutes } from '../features/users/password/reset/reset-password.routes';
import { SignUpRoutes } from '../features/users/sign-up/sign-up.routes';
import { UserAccessControlRoutes } from '../features/user-access-control/uac-dashboard.routes';
import { HomeRoutes } from '../features/home/home.routes';
import { UnauthorizedComponent } from '../features/unauthorized/unauthorized.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: environment.appDefaultRoute,
    pathMatch: 'full'
  },
  ...SignInRoutes,
  ...RecoverPasswordRoutes,
  ...ResetPasswordRoutes,
  ...SignUpRoutes,
  ...UserAccessControlRoutes,
  ...HomeRoutes,
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
