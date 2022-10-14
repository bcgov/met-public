
"""Service for widget management."""
from met_api.models.widget import Widget
from met_api.schemas.widget import WidgetSchema
from itertools import groupby


class WidgetService:
    """Widget management service."""

    @staticmethod
    def get_widgets_by_engagement_id(engagement_id, grouped_by_type=False):
        """Get widget by external id."""
        widget_schema = WidgetSchema(many=True)
        widgets_records = Widget.get_widgets_by_engagement_id(engagement_id)
        widgets = widget_schema.dump(widgets_records)

        if grouped_by_type:
            sorted_widgets = sorted(widgets, key=lambda widget: widget.get('widget_type_id'))

            grouped_widgets = [{'widget_type_id': key, 'items': list(result)}
                               for key, result in groupby(sorted_widgets, key=lambda widget: widget.get('widget_type_id'))]
            return grouped_widgets
        return widgets

    @staticmethod
    def create_widget(data: WidgetSchema):
        """Create widget."""
        return Widget.create_widget(data)

    @staticmethod
    def create_widgets_bulk(data: WidgetSchema):
        """Create widget."""
        return Widget.creat_all_widgets(data)
