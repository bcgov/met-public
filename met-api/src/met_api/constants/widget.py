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
"""Constants of feedback."""
from enum import IntEnum


class WidgetType(IntEnum):
    """Widget types enum."""

    WHO_IS_LISTENING = 1
    DOCUMENTS = 2
    PHASES = 3
    SUBSCRIBE = 4
    EVENTS = 5
    Map = 6
    Video = 7
    Timeline = 9
    Poll = 10
