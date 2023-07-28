"""Tests to verify the Widget Subscribe API end-point.
Test-Suite to ensure that the Widget Subscribe API endpoint is working as expected.
"""
import json
from faker import Faker
from met_api.utils.enums import ContentType
from tests.utilities.factory_scenarios import TestSubscribeInfo, TestJwtClaims, TestWidgetInfo
from tests.utilities.factory_utils import factory_auth_header, factory_engagement_model, factory_widget_model

fake = Faker()


def test_create_subscribe(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that widget subscribe can be POSTed."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget1['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget1)
    subscribe_info = TestSubscribeInfo.subscribe_info_1.value
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    data = {
        **subscribe_info,
        'widget_id': widget.id,
    }

    rv = client.post(
        f'/api/widgets/{widget.id}/subscribe',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == 200
    assert rv.json.get('type') == subscribe_info.get('type')
    response_subscribe_items = rv.json.get('subscribe_items')
    assert len(response_subscribe_items) == 1
    assert response_subscribe_items[0].get(
        'description') == subscribe_info.get('description')


def test_get_subscribe(client, jwt, session):  # pylint:disable=unused-argument
    """Assert that a widget's subscription can be retrieved."""
    engagement = factory_engagement_model()
    TestWidgetInfo.widget_subscribe['engagement_id'] = engagement.id
    widget = factory_widget_model(TestWidgetInfo.widget_subscribe)
    subscribe_info = TestSubscribeInfo.subscribe_info_1.value
    headers = factory_auth_header(jwt=jwt, claims=TestJwtClaims.no_role)

    data = {
        **subscribe_info,
        'widget_id': widget.id,
    }
    rv = client.post(
        f'/api/widgets/{widget.id}/subscribe',
        data=json.dumps(data),
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == 200

    rv = client.get(
        f'/api/widgets/{widget.id}/subscribe',
        headers=headers,
        content_type=ContentType.JSON.value
    )
    assert rv.status_code == 200
    assert rv.json.get('type') == subscribe_info.get('type')
