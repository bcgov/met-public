"""Service for Widget Map management."""
from http import HTTPStatus
from met_api.exceptions.business_exception import BusinessException
from met_api.models.map import Map as WidgetMapModel


class WidgetMapService:
    """Widget Map management service."""

    @staticmethod
    def get_map(widget_id):
        """Get map by widget id."""
        map = WidgetMapModel.get_map(widget_id)
        return map

    @staticmethod
    def create_map(map_details: dict):
        """Create map for the widget."""
        map = WidgetMapService.create_map(map_details)
        return map
     
    @staticmethod
    def update_map(widget_id, request_json):
        """Update map widget."""
        map: WidgetMapModel = WidgetMapModel.update_map(widget_id, request_json)
        if map.widget_id != widget_id:
            raise BusinessException(
                error='Invalid widgets and map',
                status_code=HTTPStatus.BAD_REQUEST)
        return WidgetMapModel.update_map(widget_id)