# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2023-present Kaleidos INC

from taiga.base.utils.datetime import aware_utcnow
from taiga.base.utils.files import File
from taiga.commons.storage.models import StoragedObject


async def create_storaged_object(
    file: File,
) -> StoragedObject:
    return await StoragedObject.objects.acreate(file=file)


def mark_storaged_object_as_deleted(
    storaged_object: StoragedObject,
) -> None:
    storaged_object.deleted_at = aware_utcnow()
    storaged_object.save(update_fields=["deleted_at"])
