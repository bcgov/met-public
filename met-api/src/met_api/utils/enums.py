# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Enum definitions."""
from enum import Enum, IntEnum


class ContentType(Enum):
    """Http Content Types."""

    JSON = 'application/json'
    FORM_URL_ENCODED = 'application/x-www-form-urlencoded'
    PDF = 'application/pdf'


class WidgetDocumentType(Enum):
    """Document Types."""

    FILE = 'file'
    FOLDER = 'folder'


class MembershipStatus(Enum):
    """User Membership status."""

    ACTIVE = 1
    INACTIVE = 2


class GeneratedDocumentTypes(IntEnum):
    """Document Types."""

    COMMENT_SHEET = 1


class LoginSource(Enum):
    """Login Source."""

    IDIR = 'idir'


class KeycloakGroups(Enum):
    """Login Source."""

    EAO_IT_ADMIN = 'Superuser'
    EAO_IT_VIEWER = 'Viewer'
    EAO_TEAM_MEMBER = 'Member'


class KeycloakGroupName(Enum):
    """Keycloak group names."""

    EAO_IT_ADMIN = 'EAO_IT_ADMIN'
    EAO_IT_VIEWER = 'EAO_IT_VIEWER'
    EAO_TEAM_MEMBER = 'EAO_TEAM_MEMBER'
