"""Service for widget Document management."""
from http import HTTPStatus
from typing import List

from met_api.exceptions.business_exception import BusinessException
from met_api.models.event_item import EventItem as EventItemsModel
from met_api.models.widget_events import WidgetEvents as WidgetEventsModel


class WidgetEventsService:
    """Widget Event management service."""

    @staticmethod
    def get_by_id(event_id: int):
        """Get widget event by id."""
        return WidgetEventsModel.find_by_id(event_id)

    @staticmethod
    def get_event_by_widget_id(widget_id):
        """Get documents by widget id."""
        events = WidgetEventsModel.get_all_by_widget_id(widget_id)
        return events

    @staticmethod
    def create_event(widget_id, event_details: dict):
        """Create events for the widget."""
        event = WidgetEventsService._create_event_model(widget_id, event_details)
        event_items = event_details.get('items', [])
        if event_items:
            WidgetEventsService._create_event_item_models(event_items, event.id)
        event.commit()
        return event

    @staticmethod
    def get_event_item_by_id(event_item_id: int):
        """Get event item by id."""
        return EventItemsModel.find_by_id(event_item_id)

    @staticmethod
    def create_event_items(widget_id, event_id, event_item_details):
        """Create events for the widget."""
        event: WidgetEventsModel = WidgetEventsModel.find_by_id(event_id)
        if event.widget_id != widget_id:
            raise BusinessException(
                error='Invalid widgets and event',
                status_code=HTTPStatus.BAD_REQUEST)
        if event_item_details:
            WidgetEventsService._create_event_item_models(event_item_details, event.id)
        event.commit()
        return event

    @staticmethod
    def _create_event_model(widget_id, event_details: dict):
        event = WidgetEventsModel()
        event.widget_id = widget_id
        event.title = event_details.get('title')
        event.type = event_details.get('type')
        sort_index = WidgetEventsService._find_higest_sort_index(widget_id)
        event.sort_index = sort_index + 1
        event.flush()
        return event

    @staticmethod
    def _find_higest_sort_index(widget_id):
        # find the highest sort order of the widget event
        sort_index = 0
        widget_events = WidgetEventsModel.get_all_by_widget_id(widget_id)
        if widget_events:
            # Find the largest in the existing widget events
            sort_index = max(widget_event.sort_index for widget_event in widget_events)
        return sort_index

    @staticmethod
    def _create_event_item_models(event_items: List, widget_events_id):
        item_list = []
        for event in event_items:
            event_item = WidgetEventsService._create_event_item(event, widget_events_id)
            item_list.append(event_item)
        EventItemsModel.save_event_items(item_list)

    @staticmethod
    def _create_event_item(event, widget_events_id):
        event_item = EventItemsModel()
        event_item.description = event.get('description')
        event_item.location_name = event.get('location_name')
        event_item.location_address = event.get('location_address')
        event_item.start_date = event.get('start_date')
        event_item.end_date = event.get('end_date')
        event_item.url = event.get('url')
        event_item.url_label = event.get('url_label')
        event_item.widget_events_id = widget_events_id
        return event_item

    @staticmethod
    def update_event_item(widget_id, event_id, item_id, request_json):
        """Update event Items."""
        event: WidgetEventsModel = WidgetEventsModel.find_by_id(event_id)
        if event.widget_id != widget_id:
            raise BusinessException(
                error='Invalid widgets and event',
                status_code=HTTPStatus.BAD_REQUEST)
        event_item: EventItemsModel = EventItemsModel.find_by_id(item_id)
        if event_item.widget_events_id != event_id:
            raise BusinessException(
                error='Invalid widgets and event',
                status_code=HTTPStatus.BAD_REQUEST)

        WidgetEventsService._update_from_dict(event_item, request_json)
        event_item.commit()

        return EventItemsModel.find_by_id(item_id)

    @staticmethod
    def delete_event(event_id, widget_id) -> None:
        """Delete an event."""
        event: WidgetEventsModel = WidgetEventsModel.find_by_id(event_id)
        if event.widget_id != widget_id:
            raise BusinessException(
                error='Invalid widgets and event',
                status_code=HTTPStatus.BAD_REQUEST)

        event.delete()

    @staticmethod
    # TODO Move this to common.
    def _update_from_dict(event_item: EventItemsModel, input_dict):
        """Update the model using dict."""
        for key, value in input_dict.items():
            if hasattr(event_item, key):
                setattr(event_item, key, value)

    @staticmethod
    def update_widget_events_sorting(widget_id, widget_events: list, user_id):
        """Update widget events sorting in bulk."""
        widget_event_ids = [widget_event.get('id') for widget_event in widget_events]
        widget_events_db = WidgetEventsModel.get_all_by_widget_id(widget_id)

        widget_events_update_mapping = [{
            'id': widget_event_db.id,
            'sort_index': widget_event_ids.index(widget_event_db.id) + 1,
            'updated_by': user_id
        } for widget_event_db in widget_events_db]

        updated_widget_events = WidgetEventsModel.update_widget_events_bulk(widget_events_update_mapping)
        return updated_widget_events

    def save_widget_events_bulk(self, widget_id, widget_events: list, user_id):
        """Save widget events."""
        self.update_widget_events_sorting(widget_id, widget_events, user_id)
        return widget_events
