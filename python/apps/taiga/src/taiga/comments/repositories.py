# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2023-present Kaleidos INC

from typing import Literal, TypedDict
from uuid import UUID

from taiga.base.db.models import Model, QuerySet, get_contenttype_for_model
from taiga.comments.models import Comment
from taiga.users.models import User

##########################################################
# filters and querysets
##########################################################


DEFAULT_QUERYSET = Comment.objects.all()


class CommentFilters(TypedDict, total=False):
    id: UUID
    content_object: Model


async def _apply_filters_to_queryset(
    qs: QuerySet[Comment],
    filters: CommentFilters = {},
) -> QuerySet[Comment]:
    filter_data = dict(filters.copy())

    if "content_object" in filters:
        content_object = filter_data.pop("content_object")
        filter_data["object_content_type"] = await get_contenttype_for_model(content_object)
        filter_data["object_id"] = content_object.id  # type: ignore[attr-defined]

    return qs.filter(**filter_data)


CommentSelectRelated = list[
    Literal[
        "created_by",
    ]
]


async def _apply_select_related_to_queryset(
    qs: QuerySet[Comment],
    select_related: CommentSelectRelated = ["created_by"],
) -> QuerySet[Comment]:
    return qs.select_related(*select_related)


CommentPrefetchRelated = list[
    Literal[
        "content_object",
    ]
]


async def _apply_prefetch_related_to_queryset(
    qs: QuerySet[Comment],
    prefetch_related: CommentPrefetchRelated,
) -> QuerySet[Comment]:
    return qs.prefetch_related(*prefetch_related)


CommentOrderBy = list[
    Literal[
        "created_at",
        "-created_at",
    ]
]


async def _apply_order_by_to_queryset(
    qs: QuerySet[Comment],
    order_by: CommentOrderBy,
) -> QuerySet[Comment]:
    return qs.order_by(*order_by)


##########################################################
# create comment
##########################################################


async def create_comment(
    content_object: Model,
    text: str,
    created_by: User,
) -> Comment:
    return await Comment.objects.acreate(
        text=text,
        created_by=created_by,
        content_object=content_object,
    )


##########################################################
# list comments
##########################################################


async def list_comments(
    filters: CommentFilters = {},
    select_related: CommentSelectRelated = [],
    order_by: CommentOrderBy = ["-created_at"],
    offset: int | None = None,
    limit: int | None = None,
) -> list[Comment]:
    qs = await _apply_filters_to_queryset(qs=DEFAULT_QUERYSET, filters=filters)
    qs = await _apply_select_related_to_queryset(qs=qs, select_related=select_related)
    qs = await _apply_order_by_to_queryset(order_by=order_by, qs=qs)

    if limit is not None and offset is not None:
        limit += offset

    return [c async for c in qs[offset:limit]]


##########################################################
# get comment
##########################################################


async def get_comment(
    filters: CommentFilters = {},
    select_related: CommentSelectRelated = [],
    prefetch_related: CommentPrefetchRelated = [],
) -> Comment | None:
    qs = await _apply_filters_to_queryset(qs=DEFAULT_QUERYSET, filters=filters)
    qs = await _apply_select_related_to_queryset(qs=qs, select_related=select_related)
    qs = await _apply_prefetch_related_to_queryset(qs=qs, prefetch_related=prefetch_related)

    try:
        return await qs.aget()
    except Comment.DoesNotExist:
        return None


##########################################################
# update comment
##########################################################

# TODO


##########################################################
# delete comment
##########################################################


async def delete_comments(filters: CommentFilters = {}) -> int:
    qs = await _apply_filters_to_queryset(qs=DEFAULT_QUERYSET, filters=filters)
    count, _ = await qs.adelete()
    return count


##########################################################
# misc
##########################################################


async def get_total_comments(filters: CommentFilters = {}) -> int:
    qs = await _apply_filters_to_queryset(qs=DEFAULT_QUERYSET, filters=filters)
    return await qs.acount()