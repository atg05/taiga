# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2021-present Kaleidos Ventures SL

from typing import Any, Dict, Generic, List, Type, TypeVar, Union

from fastapi import status
from pydantic import BaseModel
from pydantic.generics import GenericModel

from . import codes

#
# Error types to model additional responses in OpenAPI (Swagger)
#

T = TypeVar("T")


class GenericListError(BaseModel):
    code: str
    detail: List[Dict[str, Any]] = [{"loc": ["string"], "msg": "string", "type": "string"}]
    message: str


class GenericSingleError(BaseModel):
    code: str
    detail: str = "string"
    message: str


class ErrorResponse(GenericModel, Generic[T]):
    error: T


class NotFoundErrorModel(GenericSingleError):
    code: str = codes.EX_NOT_FOUND.code
    message: str = codes.EX_NOT_FOUND.message


class UnprocessableEntityModel(GenericListError):
    code: str = codes.EX_VALIDATION_ERROR.code
    message: str = codes.EX_VALIDATION_ERROR.message


class UnauthorizedErrorModel(GenericSingleError):
    code: str = codes.EX_AUTHORIZATION.code
    message: str = codes.EX_AUTHORIZATION.message


ErrorsDict = Dict[Union[int, str], Dict[str, Type[ErrorResponse[Any]]]]

ERROR_RESPONSE_401 = ErrorResponse[UnauthorizedErrorModel]
ERROR_RESPONSE_422 = ErrorResponse[UnprocessableEntityModel]
ERROR_RESPONSE_404 = ErrorResponse[NotFoundErrorModel]

ERROR_401: ErrorsDict = {status.HTTP_401_UNAUTHORIZED: {"model": ERROR_RESPONSE_401}}
ERROR_422: ErrorsDict = {status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": ERROR_RESPONSE_422}}
ERROR_404: ErrorsDict = {status.HTTP_404_NOT_FOUND: {"model": ERROR_RESPONSE_404}}
