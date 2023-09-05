
"""Service for cac form management."""
from met_api.models import CACForm as CACFormModel
from met_api.models.widget import Widget as WidgetModal


class CACFormService:
    """CAC form management service."""

    @staticmethod
    def create_form_submission(engagement_id, widget_id, form_data):
        """Get form by the id."""
        widget = WidgetModal.find_by_id(widget_id)
        if widget.engagement_id != engagement_id:
            raise ValueError('Form belongs to another engagement')

        cac_form = CACFormModel(
            engagement_id=engagement_id,
            widget_id=widget_id,
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
            'widget_id': cac_form.widget_id,
            'created_date': cac_form.created_date,
            'updated_date': cac_form.updated_date,
            'created_by': cac_form.created_by,
            'updated_by': cac_form.updated_by,
        }
