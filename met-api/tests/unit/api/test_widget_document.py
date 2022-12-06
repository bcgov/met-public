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

from faker import Faker
import pytest

from met_api.utils.enums import ContentType, DocumentType
from tests.utilities.factory_scenarios import TestJwtClaims, TestWidgetDocumentInfo, TestWidgetInfo
from tests.utilities.factory_utils import (
    factory_auth_header, factory_document_model, factory_engagement_model, factory_widget_model)

fake = Faker()


@pytest.mark.parametrize('document_info', [TestWidgetDocumentInfo.document1, TestWidgetDocumentInfo.document2])
def test_create_documents(client, jwt, session, document_info):  # pylint:disable=unused-argument
    """Assert that widget items can be POSTed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    data = {
        **document_info,
        'widget_id': widget.id,
    }

    rv = client.post(
        f'/api/widgets/{widget.id}/documents',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == 200


def test_get_document(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that widget items can be POSTed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    document = factory_document_model({
        **TestWidgetDocumentInfo.document1,
        'widget_id': widget.id,
    })

    rv = client.get(
        f'/api/widgets/{widget.id}/documents',
        headers=headers,
        content_type=ContentType.JSON.value
    )

    assert rv.status_code == 200
    assert rv.json.get('result').get('children')[0].get('id') == document.id


def test_assert_tree_structure_invalid(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that widget items can be POSTed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    file_doc = factory_document_model({
        **TestWidgetDocumentInfo.document2,
        'widget_id': widget.id
    })

    folder = {**TestWidgetDocumentInfo.document1, 'widget_id': widget.id, 'parent_document_id': file_doc.id}

    rv = client.post(
        f'/api/widgets/{widget.id}/documents',
        data=json.dumps(folder),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    # TODO once we remove action result , this should be HTTP 400
    assert rv.status_code == 500


def test_assert_tree_structure(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that widget items can be POSTed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)

    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    folder = factory_document_model({
        **TestWidgetDocumentInfo.document1,
        'widget_id': widget.id,
    })
    document_file = dict(TestWidgetDocumentInfo.document2)
    document_file['parent_document_id'] = folder.id
    document_file['widget_id'] = widget.id
    file_doc = factory_document_model(document_file)

    rv = client.get(
        f'/api/widgets/{widget.id}/documents',
        headers=headers,
        content_type=ContentType.JSON.value
    )

    assert rv.status_code == 200
    expected_folder_element = rv.json.get('result').get('children')[0]
    assert expected_folder_element.get('id') == folder.id
    assert expected_folder_element.get('title') == folder.title
    assert expected_folder_element.get('type') == DocumentType.FOLDER.value
    expected_file_element = expected_folder_element.get('children')[0]
    assert expected_file_element.get('id') == file_doc.id
    assert expected_file_element.get('title') == file_doc.title
    assert expected_file_element.get('type') == DocumentType.FILE.value


def test_patch_documents(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that a document can be PATCHed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)
    TestWidgetDocumentInfo.document1['widget_id'] = widget.id
    document = factory_document_model(TestWidgetDocumentInfo.document1)
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    document_edits = {
        'title': fake.word(),
        'url': None,
    }

    rv = client.patch(f'/api/widgets/{widget.id}/documents/{document.id}',
                      data=json.dumps(document_edits),
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200

    rv = client.get(
        f'/api/widgets/{widget.id}/documents',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == 200
    assert rv.json.get('result').get('children')[0].get('title') == document_edits.get('title')


def test_delete_documents(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that a document can be PATCHed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)
    TestWidgetDocumentInfo.document1['widget_id'] = widget.id
    document = factory_document_model(TestWidgetDocumentInfo.document1)
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    rv = client.delete(f'/api/widgets/{widget.id}/documents/{document.id}',
                      headers=headers, content_type=ContentType.JSON.value)

    assert rv.status_code == 200
