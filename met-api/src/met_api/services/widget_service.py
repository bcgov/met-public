"""Service for widget management."""
from http import HTTPStatus

from met_api.exceptions.business_exception import BusinessException
from met_api.models.widget import Widget as WidgetModel
from met_api.models.widget_item import WidgetItem
from met_api.schemas.widget import WidgetSchema
from met_api.schemas.widget_item import WidgetItemSchema


class WidgetService:
    """Widget management service."""

    @staticmethod
    def get_widgets_by_engagement_id(engagement_id):
        """Get widgets by engagement id."""
        widget_schema = WidgetSchema(many=True)
        widgets_records = WidgetModel.get_widgets_by_engagement_id(engagement_id)
        widgets = widget_schema.dump(widgets_records)
        return widgets

    @staticmethod
    def get_widget_items_by_widget_id(widget_id):
        """Get widget items by widget id."""
        widget_item_schema = WidgetItemSchema(many=True)
        widget_items_records = WidgetItem.get_widget_items_by_widget_id(widget_id)
        widget_items = widget_item_schema.dump(widget_items_records)
        return widget_items

    @staticmethod
    def create_widget(widget_data, engagement_id, user_id):
        """Create widget item."""
        widget_data['created_by'] = user_id
        widget_data['updated_by'] = user_id
        if widget_data.get('engagement_id', None) != int(engagement_id):
            raise ValueError('widget data has engagement id for a different engagement')

        sort_index = WidgetService._find_higest_sort_index(engagement_id)

        widget_data['sort_index'] = sort_index + 1
        created_widget = WidgetModel.create_widget(widget_data)
        return WidgetSchema().dump(created_widget)

    @staticmethod
    def _find_higest_sort_index(engagement_id):
        # find the highest sort order of the engagement
        sort_index = 0
        widgets = WidgetModel.get_widgets_by_engagement_id(engagement_id)
        if widgets:
            # Find the largest in the existing widgest
            sort_index = max(widget.sort_index for widget in widgets)
        return sort_index

    @staticmethod
    def sort_widget(engagement_id, widgets: list, user_id=None):
        """Sort widgets."""
        WidgetService._validate_widget_ids(engagement_id, widgets)

        widget_sort_mappings = [{
            'id': widget.get('id'),
            'sort_index': index + 1,
            'updated_by': user_id
        } for index, widget in enumerate(widgets)
        ]

        WidgetModel.update_widgets(widget_sort_mappings)

    @staticmethod
    def update_widget(engagement_id, widget_id: list, widget_data: dict, user_id=None):
        """Sort widgets."""
        WidgetService._verify_widget(widget_id)

        widget_data['updated_by'] = user_id

        updated_widget = WidgetModel.update_widget(engagement_id, widget_id, widget_data)
        return WidgetSchema().dump(updated_widget)

    @staticmethod
    def _validate_widget_ids(engagement_id, widgets):
        """Validate if widget ids belong to the engagement."""
        eng_widgets = WidgetModel.get_widgets_by_engagement_id(engagement_id)
        widget_ids = [widget.id for widget in eng_widgets]
        input_widget_ids = [widget_item.get('id') for widget_item in widgets]
        if len(set(widget_ids) - set(input_widget_ids)) > 0:
            raise BusinessException(
                error='Invalid widgets.',
                status_code=HTTPStatus.BAD_REQUEST)

    @staticmethod
    def _verify_widget(widget_id):
        """Verify if widget exists."""
        widget = WidgetModel.get_widget_by_id(widget_id)
        if not widget:
            raise KeyError('Widget ' + widget_id + ' does not exist')
        return widget

    @staticmethod
    def create_widget_items_bulk(widget_items: list, user_id):
        """Create widget items in bulk."""
        for item in widget_items:
            item['created_by'] = user_id
            item['updated_by'] = user_id

        created_widgets_records = WidgetItem.create_all_widget_items(widget_items)
        return WidgetItemSchema(many=True).dump(created_widgets_records)

    def create_added_widget_items(self, widget_items: list, widget_items_db: list, user_id):
        """Get the widgets to add and send them to be inserted in DB."""
        widget_items_db_data_ids = [widget_item.widget_data_id for widget_item in widget_items_db]

        widget_items_to_add = [widget_item for widget_item in widget_items
                               if widget_item.get('widget_data_id') not in widget_items_db_data_ids]
        if len(widget_items_to_add) > 0:
            self.create_widget_items_bulk(widget_items_to_add, user_id)
        return widget_items_to_add

    @staticmethod
    def delete_removed_widget_items(widget_items_to_remain: list, widget_items_db: list):
        """Get the widgets to be deleted and send them to be deleted from DB."""
        widget_items_to_remain_data_ids = [widget_item.get('widget_data_id') for widget_item in widget_items_to_remain]

        wiget_items_ids_to_delete = [widget_item.id for widget_item in widget_items_db
                                     if widget_item.widget_data_id not in widget_items_to_remain_data_ids]
        if len(wiget_items_ids_to_delete) > 0:
            WidgetItem.delete_widget_items(wiget_items_ids_to_delete)

        return wiget_items_ids_to_delete

    @staticmethod
    def update_widget_items_sorting(widget_items: list, widget_id, user_id):
        """Update widget items sorting in bulk."""
        widget_data_ids = [widget_item.get('widget_data_id') for widget_item in widget_items]
        widget_items_db = WidgetItem.get_widget_items_by_widget_id(widget_id)

        widget_items_update_mapping = [{
            'id': widget_item_db.id,
            'sort_index': widget_data_ids.index(widget_item_db.widget_data_id) + 1,
            'updated_by': user_id
        } for widget_item_db in widget_items_db]

        updated_widgets_records = WidgetItem.update_widget_items_bulk(widget_items_update_mapping)
        return updated_widgets_records

    @staticmethod
    def get_widget_by_id(widget_id):
        """Get widget by id."""
        widget = WidgetModel.get_widget_by_id(widget_id)
        if not widget:
            raise KeyError('Widget ' + widget_id + ' does not exist')
        return widget

    def save_widget_items_bulk(self, widget_items: list, widget_id, user_id):
        """Save widget items."""
        self.get_widget_by_id(widget_id)

        widget_items_db = WidgetItem.get_widget_items_by_widget_id(widget_id)

        self.delete_removed_widget_items(widget_items, widget_items_db)
        self.create_added_widget_items(widget_items, widget_items_db, user_id)
        self.update_widget_items_sorting(widget_items, widget_id, user_id)
        return widget_items

    @staticmethod
    def delete_widget(engagement_id, widget_id):
        """Remove widget from engagement."""
        widgets = WidgetModel.remove_widget(engagement_id, widget_id)
        if not widgets:
            raise ValueError('Widget to remove was not found')
        return widgets
