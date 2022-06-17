/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

import { NumberSymbol } from '@angular/common';
import { Membership } from './membership.model';
export interface Invitation extends Partial<Membership> {
  email: string;
}
export interface Contact {
  email?: string;
  username: string;
  fullName: string;
  isMember?: boolean;
  isAddedToList?: boolean;
}
export interface InvitationRequest {
  email?: string;
  username?: string;
  roleSlug?: string;
}

export interface InvitationResponse {
  invitations: Invitation[];
  alreadyMembers: NumberSymbol;
}

export interface InvitationInfo {
  status: 'pending' | 'accepted' | 'cacelled';
  email: string;
  existingUser: boolean;
  project: {
    name: string;
    slug: string;
    isAnon: boolean;
  };
}

export interface InvitationParams {
  email: string;
  project: string;
  projectInvitationToken: string;
  slug: string;
  acceptProjectInvitation: boolean;
}

export interface SearchUserRequest {
  text: string;
  project?: string;
  excludedUsers?: string[];
  offset?: number;
  limit?: number;
}
