import { Routes } from '@angular/router';

import { AuthGuard } from '../utils';

import { UserAccessControlComponent } from './user-access-control.component';

export const UserAccessControlRoutes: Routes = [
    {
        path: 'uac',
        component: UserAccessControlComponent,
        canActivate: [AuthGuard],
        data: {
            uac_admin_only: true
        }
    }
];
