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
from enum import Enum


class FormIoComponentType(Enum):
    """FormIO Component Types."""

    RADIOS = 'simpleradios'
    SIMPLE_CHECKBOXES = 'simplecheckboxes'
    SELECTBOXES = 'selectboxes'
    CHECKBOX = 'checkbox'
    TEXT = 'text'
    SIMPLE_TEXTFIELD = 'simpletextfield'
    TEXTFIELD = 'textfield'
    SIMPLE_TEXT_AREA = 'simpletextarea'
    TEXT_AREA = 'textarea'


RADIO_TYPES = (FormIoComponentType.SIMPLE_CHECKBOXES.value,)
SELECTBOXES_TYPES = (FormIoComponentType.SIMPLE_CHECKBOXES.value, FormIoComponentType.CHECKBOX.value, FormIoComponentType.SELECTBOXES.value)
TEXT_TYPES = (FormIoComponentType.TEXT.value, FormIoComponentType.SIMPLE_TEXTFIELD.value, FormIoComponentType.TEXTFIELD.value)
TEXT_AREA_TYPES = (FormIoComponentType.SIMPLE_TEXT_AREA,FormIoComponentType.TEXT_AREA)
