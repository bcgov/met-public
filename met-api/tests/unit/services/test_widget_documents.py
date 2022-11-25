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
"""Tests for the Widget service.

Test suite to ensure that the Widget service routines are working as expected.
"""

from faker import Faker

from met_api.services.widget_documents_service import WidgetDocumentService
from tests.utilities.factory_scenarios import TestWidgetDocumentInfo, TestWidgetInfo
from tests.utilities.factory_utils import factory_document_model, factory_engagement_model, factory_widget_model


fake = Faker()
date_format = '%Y-%m-%d'


def test_get_document_by_widget_id(session):  # pylint:disable=unused-argument
    """Assert that documents can be fetched."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)

    factory_document_model({
        **TestWidgetDocumentInfo.document1,
        'widget_id': widget.id,
    })

    factory_document_model({
        **TestWidgetDocumentInfo.document2,
        'widget_id': widget.id,
    })

    documents_root = WidgetDocumentService.get_document_by_widget_id(widget.id)

    documents = documents_root.get('children')

    assert len(documents) == 2


def test_create_document(session):  # pylint:disable=unused-argument
    """Assert that documents can be fetched."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)

    document = WidgetDocumentService.create_document(widget.id, TestWidgetDocumentInfo.document1)

    assert document != None
