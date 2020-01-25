import {
  Route
} from '@angular/router';

import {
  AboutComponent
} from './about/about.component';
import {
  PrivacyPolicyComponent
} from './privacy/privacy-policy.component';
import {
  TermsConditionsComponent
} from './terms/terms-conditions.component';
import {
  ContactComponent
} from './contact/contact.component';

export const AwarenessClientRoutes: Route[] = [
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'privacy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms',
    component: TermsConditionsComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  }
];
