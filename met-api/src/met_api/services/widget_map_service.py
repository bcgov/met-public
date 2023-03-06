"""Service for Widget Map management."""
from http import HTTPStatus
from datetime import datetime
from met_api.exceptions.business_exception import BusinessException
from met_api.models.map import WidgetMap as WidgetMapModel

class WidgetMapService:
    """Widget Map management service."""
    
    @staticmethod
    def _create_map_model(widget_id, map_data: dict):
        map = WidgetMapModel()
        map.widget_id = widget_id
        map.title = map_data.get('title')
        map.latitude = map_data.get('latitude')
        map.title = map_data.get('longitude')
        map.engagement_id = map_data.get('engagement_id')
        map.created_date=datetime.utcnow(),
        map.updated_date=datetime.utcnow(),
        map.created_by=map_data.get('created_by', None),
        map.updated_by=map_data.get('updated_by', None),
        map.flush()
        return map

    @staticmethod
    def get_map(widget_id):
        """Get map by widget id."""
        widget_map = WidgetMapModel.get_map(widget_id)
        return widget_map

    @staticmethod
    def create_map(widget_id, map_details: dict):
        """Create map for the widget."""
        widget_map = WidgetMapModel._create_map_model(widget_id, map_details)
        widget_map.commit()
        return widget_map

    @staticmethod
    def update_map(widget_id, request_json):
        """Update map widget."""
        widget_map: WidgetMapModel = WidgetMapModel.update_map(widget_id, request_json)
        if widget_map.widget_id != widget_id:
            raise BusinessException(
                error='Invalid widgets and map',
                status_code=HTTPStatus.BAD_REQUEST)
        return WidgetMapModel.update_map(widget_id, request_json)
    

