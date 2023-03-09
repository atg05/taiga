# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2023-present Kaleidos INC

import uuid

import pytest
from taiga.workspaces.memberships import repositories
from tests.utils import factories as f

pytestmark = pytest.mark.django_db(transaction=True)


##########################################################
# create_workspace_memberhip
##########################################################


async def test_create_workspace_membership():
    user = await f.create_user()
    workspace = await f.create_workspace()

    membership = await repositories.create_workspace_membership(user=user, workspace=workspace)

    assert membership.user_id == user.id
    assert membership.workspace_id == workspace.id


##########################################################
# get_workspace_membership
##########################################################


async def test_get_workspace_membership():
    user = await f.create_user()
    workspace = await f.create_workspace(created_by=user)

    membership = await repositories.get_workspace_membership(
        filters={"user_id": user.id, "workspace_id": workspace.id}, select_related=["workspace", "user"]
    )
    assert membership.workspace == workspace
    assert membership.user == user


async def test_get_workspace_membership_none():
    membership = await repositories.get_workspace_membership(
        filters={"user_id": uuid.uuid1(), "workspace_id": uuid.uuid1()}
    )
    assert membership is None
