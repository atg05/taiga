/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { Membership } from './membership.model';
export interface Invitation extends Partial<Membership> {
  email: string;
}
export interface Contact {
  email: string;
  username: string;
  fullName: string;
}
export interface InvitationRequest {
  email: string;
  role?: string;
  roleSlug?: string;
}

export interface InvitationResponse {
  userId: number | null;
  projectId: number;
  roleId: number;
  email: string;
}