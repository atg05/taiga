/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (c) 2021-present Kaleidos Ventures SL
 */

export type SocialLogins = 'github' | 'gitlab' | 'google';

export interface Config {
  api: string;
  ws: string;
  defaultLanguage: 'en';
  adminEmail: string;
  supportEmail: string;
  emailWs?: string;
  social: {
    [key in SocialLogins]: {
      serverUrl?: string;
      clientId: string;
    };
  };
}
