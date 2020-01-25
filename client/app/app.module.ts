import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { UnauthorizedComponent } from '../features/utils/unauthorized/unauthorized.component';
import { PageNotFoundComponent } from '../features/utils/page-not-found/page-not-found.component';

import { AppHomeModule } from '../features/app-home/app-home.module';
import { AppFooterModule } from '../features/app-footer/app-footer.module';
import { AppMenuModule } from '../features/app-menu/app-menu.module';
import { AppUsersModule } from '../features/app-users/app-users.module';
import { UserAccessControlModule } from '../features/user-access-control/uac-dashboard.module';

import {
  UtilsModule,
  AppLoadService,
  AuthGuard,
  AuthService,
  LoadingInterceptor,
  LoadingService,
  MessagingInterceptor,
  MessagingService,
  ScriptInjectorService,
  SeoService
} from '../features/utils';

export function init_app(appLoadService: AppLoadService) {
  return () => appLoadService.initializeApp();
}

@NgModule({
  declarations: [
    AppComponent,
    UnauthorizedComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    UtilsModule,
    UserAccessControlModule,
    AppMenuModule,
    AppHomeModule,
    AppFooterModule,
    AppUsersModule
  ],
  providers: [
    AppLoadService,
    {
      provide: APP_INITIALIZER,
      useFactory: init_app,
      deps: [AppLoadService],
      multi: true
    },
    AuthGuard,
    AuthService,
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
    ScriptInjectorService,
    SeoService,
    {
      provide: '@env',
      useValue: environment
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
