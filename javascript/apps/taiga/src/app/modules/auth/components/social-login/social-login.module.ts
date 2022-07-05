/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslocoModule, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ContextNotificationModule } from '@taiga/ui/context-notification/context-notification.module';
import { SocialLoginButtonModule } from '../social-login-button/social-login-button.module';
import { SocialLoginComponent } from './social-login.component';

@NgModule({
  imports: [
    CommonModule,
    TranslocoModule,
    ContextNotificationModule,
    SocialLoginButtonModule,
  ],
  declarations: [SocialLoginComponent],
  exports: [SocialLoginComponent],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'auth',
        alias: 'auth',
      },
    },
  ],
})
export class SocialLoginModule {}
