# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Manager for widget listening schema."""

from met_api.models.widget_listening import WidgetListening as WidgetListeningModel

from marshmallow import Schema
from marshmallow_sqlalchemy.fields import Nested

class WidgetListeningSchema(Schema):  # pylint: disable=too-many-ancestors, too-few-public-methods
    """This is the schema for the widget listening model."""

    class Meta:  # pylint: disable=too-few-public-methods
        """All of the fields in the Widget Listening schema."""

        model = WidgetListeningModel
        fields = ('id', 'engagement_id', 'widget_id', 'description')
