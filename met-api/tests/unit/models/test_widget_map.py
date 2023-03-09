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
"""Tests for the Org model.

Test suite to ensure that the widget map model routines are working as expected.
"""

from faker import Faker

from met_api.models.widget_map import WidgetMap as WidgetMapModel


fake = Faker()


def test_map_creation(session):
    """Assert that a map can be created and fetched."""
    map = WidgetMapModel(id=1, widget_id=1, engagement_id=1, longitude=1, latitude=1)
    description = fake.paragraph(nb_sentences=3)
    session.add(map)
    session.commit()
    assert map.id is not None
    widget_map_in_db = WidgetMapModel.find_by_id(map.id)
    assert widget_map_in_db.description == description


def test_get_map_by_external_id(session):
    """Assert that an map can be created and fetched."""
    description = fake.paragraph(nb_sentences=3)
    map = WidgetMapModel(id=1, widget_id=1, engagement_id=1, longitude=1, latitude=1)
    session.add(map)
    session.commit()
    assert map.id is not None
    map_in_db = WidgetMapModel.get_map(map.widget_id)
    assert map_in_db.description== description
    assert map_in_db.id == map.id


def test_update_map_from_dict(session):
    """Assert that update_user returns none."""
    invalid_id = fake.random_number(digits=5)
    new_map = WidgetMapModel.update_map(invalid_id, {})
    assert new_map is None


def test_update_map_from_dict_valid(session):
    """Assert that an map can be created and fetched."""
    description = fake.paragraph(nb_sentences=3)
    external_id = str(fake.random_number(digits=5))
    map_dict = {
        'description': description,
        'latitude': 1,
        'longitude': 1,
        'widget_id': 1,
        'engagement_id': external_id,
    }
    new_map = WidgetMapModel.create_map(map_dict)
    assert new_map.description == description
    new_description = 'updated description'
    updated_map = WidgetMapModel.update_map(new_map.id, {'description': new_description
                                                       })
    assert updated_map.description == new_description
