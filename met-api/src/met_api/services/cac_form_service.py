
"""Service for cac form management."""
from typing import Optional
from met_api.constants.subscribe_types import SubscribeTypes
from met_api.models import CACForm as CACFormModel
from met_api.models.engagement import Engagement as EngagementModel
from met_api.models.widget import Widget as WidgetModal
from met_api.models.widgets_subscribe import WidgetSubscribe as WidgetSubscribeModel
from met_api.services import authorization
from met_api.services.document_generation_service import DocumentGenerationService
from met_api.utils.enums import GeneratedDocumentTypes, MembershipType
from met_api.utils.roles import Role


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

    @classmethod
    def export_cac_form_submissions_to_spread_sheet(cls, engagement_id):
        """Export comments to spread sheet."""
        engagement: Optional[EngagementModel] = EngagementModel.find_by_id(engagement_id)
        if not engagement:
            raise KeyError('Engagement not found')

        one_of_roles = (
            MembershipType.TEAM_MEMBER.name,
            Role.EXPORT_CAC_FORM_TO_SHEET.value
        )
        authorization.check_auth(one_of_roles=one_of_roles, engagement_id=engagement.id)

        cac_forms = CACFormModel.get_all_by_engagement_id(engagement_id)
        formatted_comments = [
            {
                'understand': form.understand,
                'termsOfReference': form.terms_of_reference,
                'firstName': form.first_name,
                'lastName': form.last_name,
                'city': form.city,
                'email': form.email,
            }
            for form in cac_forms]

        data = {
            'forms': formatted_comments
        }

        document_options = {
            'document_type': GeneratedDocumentTypes.CAC_FORM_SHEET.value,
            'template_name': 'cac_form_submissions.xlsx',
            'convert_to': 'csv',
            'report_name': 'cac_form_submissions'
        }
        return DocumentGenerationService().generate_document(data=data, options=document_options)
