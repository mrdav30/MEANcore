// Do not import this module directly to any other module. use utils.ts from parent directory
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ImageUploadModule } from './image-upload/image-upload.module';
import { DynamicFormsModule } from './dynamic-forms/dynamic-forms.module';
import { PasswordValidatorModule } from './password-validator/password-validator.module';

import { LoadingComponent } from './loading/loading.component';
import { MessagingComponent } from './messaging/messaging.component';

import { EqualValidatorDirective } from './directives/equal-validator.directive';
import { PasswordToggleDirective } from './directives/password-toggle.directive';
import { AnimatedLabelDirective } from './directives/animated-label.directive';
import { SplitDirective } from './directives/split.directive';
import { ReCaptchaDirective } from './directives/recaptcha.directive';
import { InputRestrictionDirective } from './directives/input-restriction.directive';
import { DeferLoadDirective } from './directives/defer-load.directive';

import { CsvPipe } from './pipes/csv.pipe';
import { SlugifyPipe } from './pipes/slugify.pipe';

import { ConfigService } from './services/config.service';
import { AuthGuard } from './services/auth-guard.service';
import { DirectAccessGuard } from './services/direct-access-guard.service';
import { AuthService } from './services/auth.service';
import { HandleErrorService } from './services/handle-error.service';
import { LoadingService } from './loading/loading.service';
import { MessagingService } from './messaging/messaging.service';
import { PasswordValidatorService } from './services/password-validator.service';

export * from './pipes/slugify.pipe';

export * from './services/data.service';
export * from './services/app-load.service';
export * from './services/config.service';
export * from './services/auth-guard.service';
export * from './services/direct-access-guard.service';
export * from './services/auth.service';
export * from './services/handle-error.service';
export * from './loading/loading.service';
export * from './messaging/messaging.service';
export * from './services/password-validator.service';
export * from './services/recaptcha.service';
export * from './services/cached-data.service';
export * from './services/seo.service';
export * from './services/script-injector.service';

export { dynamicQuestionClasses } from './dynamic-forms/dynamic-forms.module';

export { LoadingInterceptor } from './loading/loading.interceptor';
export { MessagingInterceptor } from './messaging/messaging.interceptor';

export { CanDeactivateGuard } from './services/can-deactivate-guard.service';

const components = [
  MessagingComponent,
  LoadingComponent
];

const modules = [
  ImageUploadModule,
  DynamicFormsModule,
  PasswordValidatorModule
];

const directives = [
  EqualValidatorDirective,
  PasswordToggleDirective,
  AnimatedLabelDirective,
  SplitDirective,
  ReCaptchaDirective,
  InputRestrictionDirective,
  DeferLoadDirective
];

const pipes = [
  CsvPipe,
  SlugifyPipe
];

const services = [
  ConfigService,
  AuthGuard,
  AuthService,
  DirectAccessGuard,
  HandleErrorService,
  LoadingService,
  MessagingService,
  PasswordValidatorService
];

@NgModule({
  declarations: [
    components,
    directives,
    pipes
  ],
  providers: [
    ...services
  ],
  imports: [
    CommonModule,
    FormsModule,
    ...modules
  ],
  exports: [
    ...components,
    ...directives,
    ...pipes,
    ...modules
  ]
})
export class UtilsModule { }
