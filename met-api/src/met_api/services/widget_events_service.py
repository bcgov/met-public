"""Service for widget Document management."""
from http import HTTPStatus
from typing import List

from met_api.exceptions.business_exception import BusinessException
from met_api.models.event_item import EventItem as EventItemsModel
from met_api.models.widget_events import WidgetEvents as WidgetEventsModel


class WidgetEventsService:
    """Widget Event management service."""

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
        event.flush()
        return event

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
        event_item.title = event.get('title')
        event_item.venue = event.get('venue')
        event_item.location = event.get('location')
        event_item.start_date = event.get('start_date')
        event_item.end_date = event.get('end_date')
        event_item.url = event.get('url')
        event_item.url_label = event.get('url_label')
        event_item.widget_events_id = widget_events_id
        return event_item
