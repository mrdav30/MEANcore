// Config service - Use this service to pass the config of the app requried at the bootstrap.
// This service use must restricted to pass data at the boostrap.

import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
  user: any; // if page is refreshed while user is logged in, we pass user information to application bootsrap so authService get user
}
