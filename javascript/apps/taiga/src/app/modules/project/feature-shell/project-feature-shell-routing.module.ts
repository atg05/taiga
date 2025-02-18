/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2023-present Kaleidos INC
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectAdminResolver } from './project-admin.resolver.service';
import { ProjectFeatureShellResolverService } from './project-feature-shell-resolver.service';
import { ProjectFeatureShellComponent } from './project-feature-shell.component';
import { CanDeactivateGuard } from '~/app/shared/can-deactivate/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    component: ProjectFeatureShellComponent,
    resolve: {
      project: ProjectFeatureShellResolverService,
    },
    children: [
      {
        path: ':slug/kanban',
        loadChildren: () =>
          import(
            '~/app/modules/project/feature-view-setter/project-feature-view-setter.module'
          ).then((m) => m.ProjectFeatureViewSetterModule),
        canDeactivate: [CanDeactivateGuard],
        data: {
          kanban: true,
        },
      },
      {
        path: 'kanban',
        loadChildren: () =>
          import(
            '~/app/modules/project/feature-view-setter/project-feature-view-setter.module'
          ).then((m) => m.ProjectFeatureViewSetterModule),
        canDeactivate: [CanDeactivateGuard],
        data: {
          kanban: true,
        },
      },
      {
        path: ':slug/stories/:storyRef',
        loadChildren: () =>
          import(
            '~/app/modules/project/feature-view-setter/project-feature-view-setter.module'
          ).then((m) => m.ProjectFeatureViewSetterModule),
        canDeactivate: [CanDeactivateGuard],
        data: {
          stories: true,
        },
      },
      {
        path: 'stories/:storyRef',
        loadChildren: () =>
          import(
            '~/app/modules/project/feature-view-setter/project-feature-view-setter.module'
          ).then((m) => m.ProjectFeatureViewSetterModule),
        canDeactivate: [CanDeactivateGuard],
        data: {
          stories: true,
        },
      },
      {
        path: ':slug/settings',
        loadChildren: () =>
          import(
            '~/app/modules/project/settings/feature-settings/feature-settings.module'
          ).then((m) => m.ProjectSettingsFeatureSettingsModule),
        data: {
          settings: true,
        },
        resolve: {
          project: ProjectAdminResolver,
        },
      },
      {
        path: 'settings',
        loadChildren: () =>
          import(
            '~/app/modules/project/settings/feature-settings/feature-settings.module'
          ).then((m) => m.ProjectSettingsFeatureSettingsModule),
        data: {
          settings: true,
        },
        resolve: {
          project: ProjectAdminResolver,
        },
      },
      {
        path: 'overview',
        loadChildren: () =>
          import(
            '~/app/modules/project/feature-overview/project-feature-overview.module'
          ).then((m) => m.ProjectFeatureOverviewModule),
        data: {
          overview: true,
        },
      },
      {
        path: ':slug/overview',
        loadChildren: () =>
          import(
            '~/app/modules/project/feature-overview/project-feature-overview.module'
          ).then((m) => m.ProjectFeatureOverviewModule),
        data: {
          overview: true,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectFeatureShellRoutingModule {}
