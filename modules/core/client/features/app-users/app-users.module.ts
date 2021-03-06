import { NgModule } from '@angular/core';

import { ProfileModule } from './profile/profile.module';
import { RecoverPasswordModule } from './password/recover/recover-password.module';
import { ResetPasswordModule } from './password/reset/reset-password.module';
import { ExpiredPasswordModule } from './password/expired/expired-password.module';
import { SignInModule } from './sign-in/sign-in.module';
import { SignUpModule } from './sign-up/sign-up.module';

@NgModule({
  imports: [
    ProfileModule,
    RecoverPasswordModule,
    ResetPasswordModule,
    ExpiredPasswordModule,
    SignInModule,
    SignUpModule
  ]
})

export class AppUsersModule { }
