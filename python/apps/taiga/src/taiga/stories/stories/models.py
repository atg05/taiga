# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos Ventures SL

from taiga.base.db import models
from taiga.base.db.mixins import CreatedMetaInfoMixin
from taiga.base.occ.models import VersionedMixin
from taiga.projects.references.mixins import ProjectReferenceMixin


class Story(models.BaseModel, ProjectReferenceMixin, VersionedMixin, CreatedMetaInfoMixin):
    title = models.CharField(max_length=500, null=False, blank=False, verbose_name="title")
    order = models.DecimalField(
        max_digits=16, decimal_places=10, default=100, null=False, blank=False, verbose_name="order"
    )
    project = models.ForeignKey(
        "projects.Project",
        null=False,
        blank=False,
        related_name="stories",
        on_delete=models.CASCADE,
        verbose_name="project",
    )
    workflow = models.ForeignKey(
        "workflows.Workflow",
        null=False,
        blank=False,
        related_name="stories",
        on_delete=models.CASCADE,
        verbose_name="workflow",
    )
    status = models.ForeignKey(
        "workflows.WorkflowStatus",
        null=False,
        blank=False,
        related_name="stories",
        on_delete=models.CASCADE,
        verbose_name="status",
    )
    # assignees = models.ManyToManyField(
    #     "users.User",
    #     related_name="assigned_stories",
    #     through="stories.StoryAssigned",
    #     through_fields=("project", "user"),
    #     verbose_name="members",
    # )

    class Meta:
        verbose_name = "story"
        verbose_name_plural = "stories"
        constraints = ProjectReferenceMixin.Meta.constraints
        indexes = ProjectReferenceMixin.Meta.indexes
        ordering = ["project", "workflow", "status", "order"]

    def __str__(self) -> str:
        return f"#{self.ref} {self.title}"

    def __repr__(self) -> str:
        return f"<Story #{self.ref}>"