"""Service for widget Document management."""
from http import HTTPStatus
from typing import List

from met_api.exceptions.business_exception import BusinessException
from met_api.models.subscribe_item import SubscribeItem as SubscribeItemsModel
from met_api.models.widgets_subscribe import WidgetSubscribe as WidgetSubscribeModel


class WidgetSubscribeService:
    """Widget Subscribe management service."""

    @staticmethod
    def get_subscribe_by_widget_id(widget_id):
        """Get subscribe items by widget id."""
        subscribe = WidgetSubscribeModel.get_all_by_widget_id(widget_id)
        return subscribe

    @staticmethod
    def create_subscribe(widget_id, subscribe_details: dict):
        """Create subscribes for the widget."""
        subscribe = WidgetSubscribeService._create_subscribe_model(widget_id, subscribe_details)
        subscribe_items = subscribe_details.get('items', [])
        if subscribe_items:
            WidgetSubscribeService._create_subscribe_item_models(subscribe_items, subscribe.id)
        subscribe.commit()
        return subscribe

    @staticmethod
    def create_subscribe_items(widget_id, subscribe_id, subscribe_item_details):
        """Create subscribes for the widget."""
        subscribe: WidgetSubscribeModel = WidgetSubscribeModel.find_by_id(subscribe_id)
        if subscribe.widget_id != widget_id:
            raise BusinessException(
                error='Invalid widgets and subscribe',
                status_code=HTTPStatus.BAD_REQUEST)
        if subscribe_item_details:
            WidgetSubscribeService._create_subscribe_item_models(subscribe_item_details, subscribe.id)
        subscribe.commit()
        return subscribe

    @staticmethod
    def _create_subscribe_model(widget_id, subscribe_details: dict):
        subscribe = WidgetSubscribeModel()
        subscribe.widget_id = widget_id
        subscribe.type = subscribe_details.get('type')
        sort_index = WidgetSubscribeService._find_higest_sort_index(widget_id)
        subscribe.sort_index = sort_index + 1
        subscribe.flush()
        return subscribe

    @staticmethod
    def _find_higest_sort_index(widget_id):
        # find the highest sort order of the widget subscribe
        sort_index = 0
        widget_subscribes = WidgetSubscribeModel.get_all_by_widget_id(widget_id)
        if widget_subscribes:
            # Find the largest in the existing widget subscribes
            sort_index = max(widget_subscribe.sort_index for widget_subscribe in widget_subscribes)
        return sort_index

    @staticmethod
    def _create_subscribe_item_models(subscribe_items: List, widget_subscribes_id):
        item_list = []
        for subscribe in subscribe_items:
            subscribe_item = WidgetSubscribeService._create_subscribe_item(subscribe, widget_subscribes_id)
            item_list.append(subscribe_item)
        SubscribeItemsModel.save_subscribe_items(item_list)

    @staticmethod
    def _create_subscribe_item(subscribe, widget_subscribe_id):
        subscribe_item = SubscribeItemsModel()
        subscribe_item.description = subscribe.get('description')
        subscribe_item.call_to_action_text = subscribe.get('call_to_action_text')
        subscribe_item.call_to_action_type = subscribe.get('call_to_action_type')
        subscribe_item.widget_subscribe_id = widget_subscribe_id
        return subscribe_item

    @staticmethod
    def update_subscribe_item(widget_id, subscribe_id, item_id, request_json):
        """Update subscribe Items."""
        subscribe: WidgetSubscribeModel = WidgetSubscribeModel.find_by_id(subscribe_id)
        if subscribe.widget_id != widget_id:
            raise BusinessException(
                error='Invalid widgets and subscribe',
                status_code=HTTPStatus.BAD_REQUEST)
        subscribe_item: SubscribeItemsModel = SubscribeItemsModel.find_by_id(item_id)
        if subscribe_item.widget_subscribes_id != subscribe_id:
            raise BusinessException(
                error='Invalid widgets and subscribe',
                status_code=HTTPStatus.BAD_REQUEST)

        WidgetSubscribeService._update_from_dict(subscribe_item, request_json)
        subscribe_item.commit()

        return SubscribeItemsModel.find_by_id(item_id)

    @staticmethod
    def delete_subscribe(subscribe_id, widget_id) -> None:
        """Delete an subscribe."""
        subscribe: WidgetSubscribeModel = WidgetSubscribeModel.find_by_id(subscribe_id)
        if subscribe.widget_id != widget_id:
            raise BusinessException(
                error='Invalid widgets and subscribe',
                status_code=HTTPStatus.BAD_REQUEST)

        subscribe.delete()

    @staticmethod
    # TODO Move this to common.
    def _update_from_dict(subscribe_item: SubscribeItemsModel, input_dict):
        """Update the model using dict."""
        for key, value in input_dict.items():
            if hasattr(subscribe_item, key):
                setattr(subscribe_item, key, value)

    @staticmethod
    def update_widget_subscribes_sorting(widget_id, widget_subscribes: list, user_id):
        """Update widget subscribes sorting in bulk."""
        widget_subscribe_ids = [widget_subscribe.get('id') for widget_subscribe in widget_subscribes]
        widget_subscribes_db = WidgetSubscribeModel.get_all_by_widget_id(widget_id)

        widget_subscribes_update_mapping = [{
            'id': widget_subscribe_db.id,
            'sort_index': widget_subscribe_ids.index(widget_subscribe_db.id) + 1,
            'updated_by': user_id
        } for widget_subscribe_db in widget_subscribes_db]

        updated_widget_subscribes = WidgetSubscribeModel.update_widget_subscribes_bulk(widget_subscribes_update_mapping)
        return updated_widget_subscribes

    def save_widget_subscribes_bulk(self, widget_id, widget_subscribes: list, user_id):
        """Save widget subscribes."""
        self.update_widget_subscribes_sorting(widget_id, widget_subscribes, user_id)
        return widget_subscribes
