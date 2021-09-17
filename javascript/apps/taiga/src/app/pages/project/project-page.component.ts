/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { getProject } from '~/app/features/project/actions/project.actions';
import { selectProject } from '~/app/features/project/selectors/project.selectors';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'tg-project',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.css']
})
export class ProjectPageComponent implements OnInit {

  constructor(private store: Store) {}

  public project$ = this.store.select(selectProject);

  public ngOnInit() {
    this.store.dispatch(getProject({id: 1}));
  }

}