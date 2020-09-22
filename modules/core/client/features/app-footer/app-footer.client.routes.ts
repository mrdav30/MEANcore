import {
  Route
} from '@angular/router';

import {
  AppFooterComponent
} from './app-footer.component';

import {
  AwarenessClientRoutes
} from '../app-awareness/app-awareness.client.routes';

export const AppFooterRoutes: Route[] = [{
    path: '',
    component: AppFooterComponent,
    outlet: 'appfooter'
  },
  ...AwarenessClientRoutes
];
