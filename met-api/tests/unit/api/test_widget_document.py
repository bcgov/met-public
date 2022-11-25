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

"""Tests to verify the Widget API end-point.

Test-Suite to ensure that the Widget endpoint is working as expected.
"""
import json

import pytest

from tests.utilities.factory_scenarios import TestJwtClaims, TestWidgetDocumentInfo, TestWidgetInfo, TestWidgetItemInfo
from tests.utilities.factory_utils import (
    factory_auth_header, factory_document_model, factory_engagement_model, factory_widget_model)


@pytest.mark.parametrize('document_info', [TestWidgetItemInfo.widget_item1])
def test_create_documents(client, jwt, session, document_info):  # pylint:disable=unused-argument
    """Assert that widget items can be POSTed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    data = {
        **TestWidgetDocumentInfo.document1,
        'widget_id': widget.id,
    }
    rv = client.post('/api/widgets/' + str(widget.id) + '/documents', data=json.dumps(data),
                     headers=headers, content_type='application/json')
    assert rv.status_code == 200
    
@pytest.mark.parametrize('document_info', [TestWidgetItemInfo.widget_item1])
def test_get_document(client, jwt, session, document_info):  # pylint:disable=unused-argument
    """Assert that widget items can be POSTed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)    

    document = factory_document_model({
        **TestWidgetDocumentInfo.document1,
        'widget_id': widget.id,
    })
    
    rv = client.get('/api/widgets/' + str(widget.id) + '/documents',
                     headers=headers, content_type='application/json')
    
    assert rv.json.get('result').get('children')[0].get('id') == document.id
    assert rv.status_code == 200
