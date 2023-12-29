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
"""Manager for widget timeline schema."""

from met_api.models.widget_timeline import WidgetTimeline as WidgetTimelineModel
from met_api.models.timeline_event import TimelineEvent as TimelineEventModel

from marshmallow import Schema
from marshmallow_sqlalchemy.fields import Nested

class TimelineEventSchema(Schema):  # pylint: disable=too-many-ancestors, too-few-public-methods
    """This is the schema for the timeline event model."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Events all of the Widget timeline event fields to a default schema."""

        model = TimelineEventModel
        fields = ('id', 'engagement_id', 'widget_id', 'timeline_id', 'description', 'time', 'position', 'status')


class WidgetTimelineSchema(Schema):  # pylint: disable=too-many-ancestors, too-few-public-methods
    """This is the schema for the timeline model."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Timelines all of the Widget timeline fields to a default schema."""

        model = WidgetTimelineModel
        fields = ('id', 'engagement_id', 'widget_id', 'title', 'description', 'events')
    
    events = Nested(TimelineEventSchema, many=True)
