# Copyright © 2021 Province of British Columbia
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
"""Constants of engagement status."""
from enum import Enum, IntEnum


class Status(IntEnum):
    """Enum of engagement status."""

    Draft = 1
    Published = 2
    Closed = 3
    Scheduled = 4
    Unpublished = 5


class EngagementDisplayStatus(IntEnum):
    """Enum of engagement display status."""

    Draft = 1
    Published = 2
    Closed = 3
    Scheduled = 4
    Upcoming = 5
    Open = 6
    Unpublished = 7


class SubmissionStatus(IntEnum):
    """Enum of engagement submission status."""

    Upcoming = 1
    Open = 2
    Closed = 3
    ViewResults = 4


class EngagementViewSections(Enum):
    """Enum of sections that can be displayed in the engagement view."""

    HERO = 'hero'
    DESCRIPTION = 'description'
    CONTENT_TABS = 'contentTabs'
    PROVIDE_FEEDBACK = 'provideFeedback'
