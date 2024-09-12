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
"""Widget image schema definition."""

from met_api.models.widget_image import WidgetImage as WidgetImageModel

from marshmallow import Schema


class WidgetImageSchema(Schema):
    """This is the schema for the image model."""

    class Meta:  # pylint: disable=too-few-public-methods
        """Images all of the Widget Image fields to a default schema."""

        model = WidgetImageModel
        fields = (
            'id',
            'widget_id',
            'engagement_id',
            'image_url',
            'alt_text',
            'description',
        )
