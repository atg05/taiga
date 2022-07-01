/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { selectCurrentProject } from '~/app/modules/project/data-access/+state/selectors/project.selectors';
import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { WsService } from '@taiga/ws';
import { filterNil } from '~/app/shared/utils/operators';
import { setNotificationClosed } from '../feature-overview/data-access/+state/actions/project-overview.actions';
import { acceptInvitationSlug } from '~/app/shared/invite-to-project/data-access/+state/actions/invitation.action';
import { RxState } from '@rx-angular/state';
import { Project } from '@taiga/data';

@Component({
  selector: 'tg-project-feature-shell',
  templateUrl: './project-feature-shell.component.html',
  styleUrls: ['./project-feature-shell.component.css'],
  providers: [RxState],
})
export class ProjectFeatureShellComponent implements OnDestroy {
  public model$ = this.state.select();
  public subscribedProject?: string;

  constructor(
    private store: Store,
    private wsService: WsService,
    private state: RxState<{
      project: Project;
    }>
  ) {
    this.state.connect(
      'project',
      this.store.select(selectCurrentProject).pipe(filterNil())
    );

    this.state.hold(this.state.select('project'), (project) => {
      this.unsubscribeFromProjectEvents();

      this.subscribedProject = project.slug;
      this.wsService
        .command('subscribe_to_project_events', { project: project.slug })
        .subscribe();
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribeFromProjectEvents();
  }

  public unsubscribeFromProjectEvents() {
    if (this.subscribedProject) {
      this.wsService
        .command('unsubscribe_from_project_events', {
          project: this.subscribedProject,
        })
        .subscribe();
    }
  }

  public onNotificationClosed() {
    this.store.dispatch(setNotificationClosed({ notificationClosed: true }));
  }

  public acceptInvitationSlug() {
    this.store.dispatch(
      acceptInvitationSlug({
        slug: this.state.get('project').slug,
      })
    );
  }
}
