
"""Service for widget management."""
from met_api.models.widget_item import WidgetItem
from met_api.models.widget import Widget
from met_api.schemas.widget import WidgetSchema
from met_api.schemas.widget_item import WidgetItemSchema


class WidgetService:
    """Widget management service."""

    @staticmethod
    def get_widgets_by_engagement_id(engagement_id):
        """Get widgets by engagement id."""
        widget_schema = WidgetSchema(many=True)
        widgets_records = Widget.get_widgets_by_engagement_id(engagement_id)
        widgets = widget_schema.dump(widgets_records)
        return widgets

    @staticmethod
    def create_widget(data: Widget):
        """Create widget item."""
        return Widget.create_widget(data)

    @staticmethod
    def create_widget_item(data: WidgetItemSchema):
        """Create widget item."""
        return WidgetItem.create_widget_item(data)

    @staticmethod
    def create_widget_items_bulk(data: WidgetItemSchema):
        """Create widget items in bulk."""
        created_widgets_records = WidgetItem.creat_all_widget_items(data)
        return WidgetItemSchema(many=True).dump(created_widgets_records)
