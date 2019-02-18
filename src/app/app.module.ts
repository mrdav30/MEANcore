import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NotFoundComponent } from '../features/not-found/not-found.component';

import { AppMenuModule } from '../features/app-menu/app-menu.module';
import { UtilsModule } from '../features/utils';
import { SignInModule } from '../features/users/sign-in/sign-in.module';
import { RecoverPasswordModule } from '../features/users/password/recover/recover-password.module';
import { ResetPasswordModule } from '../features/users/password/reset/reset-password.module';
import { SignUpModule } from '../features/users/sign-up/sign-up.module';

import { AuthGuard } from '../features/utils';
import { AuthService } from '../features/utils';
import { ConfigService } from '../features/utils';
import { LoadingInterceptor } from '../features/utils';
import { LoadingService } from '../features/utils';
import { MessagingInterceptor } from '../features/utils';
import { MessagingService } from '../features/utils';

export const AppModule = (config) => {
  @NgModule({
    declarations: [
      AppComponent,
      NotFoundComponent
    ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      AppRoutingModule,
      UtilsModule,
      SignInModule,
      RecoverPasswordModule,
      ResetPasswordModule,
      SignUpModule,
      AppMenuModule
    ],
    providers: [
      AuthGuard,
      AuthService,
      {
        provide: ConfigService,
        useValue: config
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: LoadingInterceptor,
        multi: true
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: MessagingInterceptor,
        multi: true
      },
      LoadingService,
      MessagingService,
      {
        provide: APP_BASE_HREF,
        useValue: '<%= APP_BASE %>'
      }
    ],
    bootstrap: [AppComponent]
  })

  class AppMainModule { }

  return AppMainModule;
};
