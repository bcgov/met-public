"""Service for widget management."""
from api.constants.membership_type import MembershipType
from api.models.widget import Widget as WidgetModel
from api.models.widget_item import WidgetItem
from api.schemas.widget import WidgetSchema
from api.schemas.widget_item import WidgetItemSchema
from api.services import authorization
from api.utils.roles import Role


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
    def create_widget(widget_data, engagement_id):
        """Create widget item."""
        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_ENGAGEMENT.value
        )
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

        if widget_data.get('engagement_id', None) != int(engagement_id):
            raise ValueError('widget data has engagement id for a different engagement')

        created_widget = WidgetModel.create_widget(widget_data)
        return WidgetSchema().dump(created_widget)

    @staticmethod
    def update_widget(engagement_id, widget_id: list, widget_data: dict, user_id=None):
        """Update widget."""
        WidgetService._verify_widget(widget_id)

        widget_data['updated_by'] = user_id

        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_ENGAGEMENT.value
        )
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

        updated_widget = WidgetModel.update_widget(engagement_id, widget_id, widget_data)
        return WidgetSchema().dump(updated_widget)

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
        widget: WidgetModel = self.get_widget_by_id(widget_id)

        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_ENGAGEMENT.value
        )

        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=widget.engagement_id)

        widget_items_db = WidgetItem.get_widget_items_by_widget_id(widget_id)

        self.delete_removed_widget_items(widget_items, widget_items_db)
        self.create_added_widget_items(widget_items, widget_items_db, user_id)
        self.update_widget_items_sorting(widget_items, widget_id, user_id)
        return widget_items

    @staticmethod
    def delete_widget(engagement_id, widget_id):
        """Remove widget from engagement."""
        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EDIT_ENGAGEMENT.value
        )

        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement_id)

        widgets = WidgetModel.remove_widget(engagement_id, widget_id)
        if not widgets:
            raise ValueError('Widget to remove was not found')
        return widgets
