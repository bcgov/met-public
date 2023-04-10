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


class RatingType(IntEnum):
    """Rating types enum."""

    NONE = 0
    VerySatisfied = 1
    Satisfied = 2
    Neutral = 3
    Unsatisfied = 4
    VeryUnsatisfied = 5


class CommentType(IntEnum):
    """Comment types enum."""

    NONE = 0
    Issue = 1
    Idea = 2
    Else = 3


class FeedbackSourceType(IntEnum):
    """Source types enum."""

    Public = 0
    Internal = 1
