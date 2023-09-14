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
"""Constants for export comments to sheet."""
from enum import Enum


class RejectionReason(Enum):
    """Rejection Reason."""

    has_personal_info = 'Contains personal information'
    has_profanity = 'Contains profanity or inappropriate language'
    has_threat = 'Contains threat/menace'
