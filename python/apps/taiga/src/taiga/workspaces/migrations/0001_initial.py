# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos Ventures SL

# Generated by Django 4.1 on 2022-08-09 12:02

import django.contrib.postgres.fields
import django.db.models.deletion
import taiga.base.db.models
import taiga.base.db.models.fields
import taiga.base.utils.datetime
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Workspace",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        blank=True,
                        default=taiga.base.db.models.uuid_generator,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=40, verbose_name="name")),
                (
                    "slug",
                    taiga.base.db.models.fields.LowerSlugField(
                        blank=True, max_length=250, unique=True, verbose_name="slug"
                    ),
                ),
                ("color", models.IntegerField(default=1, verbose_name="color")),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="created at"),
                ),
                (
                    "modified_at",
                    models.DateTimeField(auto_now=True, verbose_name="modified at"),
                ),
                (
                    "is_premium",
                    models.BooleanField(blank=True, default=False, verbose_name="is premium"),
                ),
            ],
            options={
                "verbose_name": "workspace",
                "verbose_name_plural": "workspaces",
                "ordering": ["name", "id"],
            },
        ),
        migrations.CreateModel(
            name="WorkspaceRole",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        blank=True,
                        default=taiga.base.db.models.uuid_generator,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=200, verbose_name="name")),
                (
                    "slug",
                    taiga.base.db.models.fields.LowerSlugField(blank=True, max_length=250, verbose_name="slug"),
                ),
                (
                    "permissions",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.TextField(choices=[("view_workspace", "View workspace")]),
                        blank=True,
                        default=list,
                        null=True,
                        size=None,
                        verbose_name="permissions",
                    ),
                ),
                (
                    "order",
                    models.BigIntegerField(
                        default=taiga.base.utils.datetime.timestamp_mics,
                        verbose_name="order",
                    ),
                ),
                (
                    "is_admin",
                    models.BooleanField(default=False, verbose_name="is_admin"),
                ),
                (
                    "workspace",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="roles",
                        to="workspaces.workspace",
                        verbose_name="workspace",
                    ),
                ),
            ],
            options={
                "verbose_name": "workspace role",
                "verbose_name_plural": "workspace roles",
                "ordering": ["order", "slug"],
                "unique_together": {("slug", "workspace")},
            },
        ),
        migrations.CreateModel(
            name="WorkspaceMembership",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        blank=True,
                        default=taiga.base.db.models.uuid_generator,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(auto_now_add=True, verbose_name="created at"),
                ),
                (
                    "role",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="memberships",
                        to="workspaces.workspacerole",
                        verbose_name="role",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="workspace_memberships",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="user",
                    ),
                ),
                (
                    "workspace",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="memberships",
                        to="workspaces.workspace",
                        verbose_name="workspace",
                    ),
                ),
            ],
            options={
                "verbose_name": "workspace membership",
                "verbose_name_plural": "workspace memberships",
                "ordering": ["workspace", "user"],
                "unique_together": {("user", "workspace")},
            },
        ),
        migrations.AddField(
            model_name="workspace",
            name="members",
            field=models.ManyToManyField(
                related_name="workspaces",
                through="workspaces.WorkspaceMembership",
                to=settings.AUTH_USER_MODEL,
                verbose_name="members",
            ),
        ),
        migrations.AddField(
            model_name="workspace",
            name="owner",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="owned_workspaces",
                to=settings.AUTH_USER_MODEL,
                verbose_name="owner",
            ),
        ),
        migrations.AlterIndexTogether(
            name="workspace",
            index_together={("name", "id")},
        ),
    ]