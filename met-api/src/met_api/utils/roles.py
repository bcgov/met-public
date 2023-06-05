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
"""Role definitions."""
from enum import Enum


class Role(Enum):
    """User Role."""

    PUBLIC_USER = 'public_user'
    ANONYMOUS_USER = 'anonymous_user'

    # STAFF Based roles
    CREATE_TENANT = 'create_tenant'
    VIEW_TENANT = 'view_tenant'
    VIEW_USERS = 'view_users'
    CREATE_ADMIN_USER = 'create_admin_user'
    CREATE_TEAM = 'create_team'
    CREATE_ENGAGEMENT = 'create_engagement'
    CREATE_SURVEY = 'create_survey'
    CLONE_SURVEY = 'clone_survey'
    PUBLISH_ENGAGEMENT = 'publish_engagement'
    VIEW_ENGAGEMENT = 'view_engagement'
    VIEW_PRIVATE_ENGAGEMENTS = 'view_private_engagements'
    EDIT_ENGAGEMENT = 'edit_engagement'
    REVIEW_COMMENTS = 'review_comments'
    ACCESS_DASHBOARD = 'access_dashboard'
    VIEW_MEMBERS = 'view_members'
    EDIT_MEMBERS = 'edit_members'
    VIEW_ALL_SURVEYS = 'view_all_surveys'
    EDIT_ALL_SURVEYS = 'edit_all_surveys'
    EDIT_DRAFT_ENGAGEMENT = 'edit_draft_engagement'
    EDIT_SCHEDULED_ENGAGEMENT = 'edit_scheduled_engagement'
    EDIT_UPCOMING_ENGAGEMENT = 'edit_upcoming_engagement'
    EDIT_OPEN_ENGAGEMENT = 'edit_open_engagement'
    EDIT_CLOSED_ENGAGEMENT = 'edit_closed_engagement'
    VIEW_UNAPPROVED_COMMENTS = 'view_unapproved_comments'  # can view unapproved comments
