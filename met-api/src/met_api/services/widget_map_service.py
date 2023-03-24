"""Service for Widget Map management."""
from http import HTTPStatus

from met_api.exceptions.business_exception import BusinessException
from met_api.models.widget_map import WidgetMap as WidgetMapModel
from met_api.services.shapefile_service import ShapefileService


class WidgetMapService:
    """Widget Map management service."""

    @staticmethod
    def get_map(widget_id):
        """Get map by widget id."""
        widget_map = WidgetMapModel.get_map(widget_id)
        return widget_map

    @staticmethod
    def create_map(widget_id, map_details: dict, shape_file):
        """Create map for the widget."""
        geojson = None
        if shape_file:
            geojson = ShapefileService().convert_to_geojson(shape_file)
        widget_map = WidgetMapService._create_map_model(widget_id, map_details, geojson, shape_file.filename)
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

    @staticmethod
    def _create_map_model(widget_id, map_data: dict, geojson=None, filename=None):
        map_model: WidgetMapModel = WidgetMapModel()
        map_model.widget_id = widget_id
        map_model.marker_label = map_data.get('marker_label')
        map_model.latitude = map_data.get('latitude')
        map_model.longitude = map_data.get('longitude')
        map_model.engagement_id = map_data.get('engagement_id')
        if filename:
            map_model.file_name = filename
        if geojson:
            map_model.geojson = geojson
        map_model.flush()
        return map_model
