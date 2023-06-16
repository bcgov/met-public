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
"""Constants definitions."""

from enum import Enum


class Groups(Enum):
    """Enumeration representing user groups."""

    EAO_IT_ADMIN = 'Superuser'
    EAO_TEAM_MEMBER = 'Member'
    EAO_REVIEWER = 'Reviewer'
    EAO_IT_VIEWER = 'Viewer'

    @staticmethod
    def get_name_by_value(value):
        """Get the name of a group by its value."""
        for group in Groups:
            if group.value == value:
                return group.name
        raise ValueError('No matching key found for the given value.')


TENANT_ID_HEADER = 'tenant-id'

GROUP_NAME_MAPPING = {group.name: group.value for group in Groups}
