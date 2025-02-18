# -*- coding: utf-8 -*-
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Copyright (c) 2023-present Kaleidos INC


from taiga.base.services.exceptions import TaigaServiceException


class TaigaValidationError(TaigaServiceException):
    ...


class InvalidWorkflowStatusError(TaigaServiceException):
    ...


class NonExistingMoveToStatus(TaigaServiceException):
    ...


class SameMoveToStatus(TaigaServiceException):
    ...


class MaxNumWorkflowCreatedError(TaigaServiceException):
    ...
