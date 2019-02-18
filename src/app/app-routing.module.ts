import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { environment } from '../environments/environment';

import { NotFoundComponent } from '../features/not-found/not-found.component';

import { SignInRoutes } from '../features/users/sign-in/sign-in.routes';
import { RecoverPasswordRoutes } from '../features/users/password/recover/recover-password.routes';
import { ResetPasswordRoutes } from '../features/users/password/reset/reset-password.routes';
import { SignUpRoutes } from '../features/users/sign-up/sign-up.routes';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: environment.APP_DEFAULT_ROUTE,
    pathMatch: 'full'
  },
  ...SignInRoutes,
  ...RecoverPasswordRoutes,
  ...ResetPasswordRoutes,
  ...SignUpRoutes,
  {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
