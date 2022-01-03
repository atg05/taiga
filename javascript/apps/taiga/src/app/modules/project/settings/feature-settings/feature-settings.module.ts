/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectSettingsFeatureSettingsRoutingModule } from './feature-settings-routing.module';
import { ProjectsSettingsFeatureSettingsComponent } from './feature-settings.component';

@NgModule({
  declarations: [
    ProjectsSettingsFeatureSettingsComponent
  ],
  imports: [
    CommonModule,
    ProjectSettingsFeatureSettingsRoutingModule,
  ],
})
export class ProjectSettingsFeatureSettingsModule { }