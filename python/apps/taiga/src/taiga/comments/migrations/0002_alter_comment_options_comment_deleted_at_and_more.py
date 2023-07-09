# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2023-present Kaleidos INC

# Generated by Django 4.1.3 on 2023-07-10 11:44

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("comments", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="comment",
            options={
                "ordering": ["object_content_type", "object_id", "-created_at"],
                "verbose_name": "comment",
                "verbose_name_plural": "comments",
            },
        ),
        migrations.AddField(
            model_name="comment",
            name="deleted_at",
            field=models.DateTimeField(blank=True, null=True, verbose_name="deleted at"),
        ),
        migrations.AddField(
            model_name="comment",
            name="deleted_by",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to=settings.AUTH_USER_MODEL,
                verbose_name="deleted by",
            ),
        ),
    ]
