
"""Service for cac form management."""
from met_api.constants.subscribe_types import SubscribeTypes
from met_api.models import CACForm as CACFormModel
from met_api.models.widget import Widget as WidgetModal
from met_api.models.widgets_subscribe import WidgetSubscribe as WidgetSubscribeModel


class CACFormService:
    """CAC form management service."""

    @staticmethod
    def create_form_submission(engagement_id, widget_id, form_data):
        """Create a form submission."""
        widget = WidgetModal.find_by_id(widget_id)
        if widget.engagement_id != engagement_id:
            raise ValueError('Form belongs to another engagement')

        widget_subscribe = WidgetSubscribeModel.get_all_by_type(SubscribeTypes.SIGN_UP.name, widget_id)

        if not widget_subscribe:
            raise ValueError('Form not found for this engagement')

        cac_form = CACFormModel(
            engagement_id=engagement_id,
            understand=form_data['understand'],
            terms_of_reference=form_data['terms_of_reference'],
            first_name=form_data['first_name'],
            last_name=form_data['last_name'],
            city=form_data['city'],
            email=form_data['email'],
        )

        cac_form.save()
        return {
            'id': cac_form.id,
            'engagement_id': cac_form.engagement_id,
            'created_date': cac_form.created_date,
            'updated_date': cac_form.updated_date,
            'created_by': cac_form.created_by,
            'updated_by': cac_form.updated_by,
        }
