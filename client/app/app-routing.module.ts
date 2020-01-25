import {
  NgModule
} from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';

import {
  AppHomeRoutes
} from '../features/app-home/app-home.routes';
import {
  AppFooterRoutes
} from '../features/app-footer/app-footer.client.routes';
import {
  AppUsersRoutes
} from '../features/app-users/app-users.client.routes';
import {
  UserAccessControlRoutes
} from '../features/user-access-control/uac-dashboard.routes';

import {
  UnauthorizedComponent
} from '../features/utils/unauthorized/unauthorized.component';
import {
  PageNotFoundComponent
} from '../features/utils/page-not-found/page-not-found.component';

export const AppRoutes: Routes = [
  ...AppHomeRoutes,
  ...AppFooterRoutes,
  ...AppUsersRoutes,
  ...UserAccessControlRoutes,
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
