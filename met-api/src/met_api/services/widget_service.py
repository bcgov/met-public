
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
    def create_widget(widget_data, engagement_id, user_id):
        """Create widget item."""
        widget_data['created_by'] = user_id
        widget_data['updated_by'] = user_id
        if widget_data.get('engagement_id', None) != int(engagement_id):
            raise ValueError('widget data has engagement id for a different engagement')
        created_widget = Widget.create_widget(widget_data)
        return WidgetSchema().dump(created_widget)

    @staticmethod
    def create_widget_item(widget_item_data):
        """Create widget item."""
        return WidgetItem.create_widget_item(widget_item_data)

    @staticmethod
    def create_widget_items_bulk(widget_items: list, widget_id, user_id):
        """Create widget items in bulk."""
        widget = Widget.get_widget_by_id(widget_id)
        if not widget:
            raise KeyError('Widget ' + widget_id + ' does not exist')

        for item in widget_items:
            item['created_by'] = user_id
            item['updated_by'] = user_id

        created_widgets_records = WidgetItem.creat_all_widget_items(widget_items)
        return WidgetItemSchema(many=True).dump(created_widgets_records)
