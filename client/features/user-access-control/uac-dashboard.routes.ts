import { Routes } from '@angular/router';

import { AuthGuard } from '../utils';

import { UserAccessControlComponent } from './uac-dashboard.component';

export const UserAccessControlRoutes: Routes = [
    {
        path: 'uac',
        data: { roles: ['admin'] },
        component: UserAccessControlComponent,
        canActivate: [AuthGuard]
    }
];
