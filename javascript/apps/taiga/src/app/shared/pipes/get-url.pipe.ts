/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../utils/utils-service.service';

@Pipe({ name: 'getUrl' })
export class getUrlPipe implements PipeTransform {
  constructor(private utilsService: UtilsService) {}
  public transform(commands: number[] | string[] | string) {
    return this.utilsService.getUrl(commands);
  }
}
