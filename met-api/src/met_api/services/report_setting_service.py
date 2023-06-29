"""Service for report setting management."""
from datetime import datetime

from met_api.models.report_setting import ReportSetting as ReportSettingModel
from met_api.schemas.report_setting import ReportSettingSchema
from met_api.constants.report_setting_type import FormIoComponentType


class ReportSettingService:
    """Report setting management service."""

    @staticmethod
    def get_report_setting(survey_id):
        """Get report setting by survey id."""
        report_setting = ReportSettingModel.find_by_survey_id(survey_id)
        settings = ReportSettingSchema(many=True).dump(report_setting)
        return settings

    @classmethod
    def create_report_setting(cls, report_setting_data, user_id):
        """Create report setting."""
        if report_setting_data.get('form_json', None) is None:
            raise ValueError('No question available on survey to access settings')

        survey_id = report_setting_data.get('id', None)

        form_json = report_setting_data.get('form_json', None)
        form_type = form_json.get('display', None)
        # check and load data for single page survey.
        if form_type == 'form':
            form_components = form_json.get('components', None)
            cls._extract_form_component(survey_id, form_components, user_id)

        # check and load data for multi page survey.
        if form_type == 'wizard':
            pages = form_json.get('components', None)
            for page in pages:
                form_components = page.get('components', None)
                cls._extract_form_component(survey_id, form_components, user_id)

        return report_setting_data

    @classmethod
    def update_report_setting(cls, report_setting_data, user_id):
        """Update report setting."""
        for data in report_setting_data:
            report_setting_id = data.get('id', None)
            report_setting = ReportSettingModel.find_by_id(report_setting_id)
            if not report_setting:
                raise ValueError(f'No report setting found for {report_setting_id}')

            report_setting.display = data.get('display', None)
            report_setting.updated_by = user_id
            report_setting.updated_date = datetime.utcnow()
            report_setting.save()

        return report_setting_data

    @classmethod
    def _extract_form_component(cls, survey_id, form_components, user_id):
        position = 0
        for component in form_components:
            position = position + 1
            component_type = component.get('type', None)
            has_valid_question_type = cls._validate_form_type(component_type)
            if has_valid_question_type:
                cls._check_component_type(survey_id, component, user_id)

    @staticmethod
    def _validate_form_type(component_type):
        component_type = component_type.lower()

        if component_type in (FormIoComponentType.RADIO.value, FormIoComponentType.CHECKBOX.value,
                              FormIoComponentType.SELECTLIST.value, FormIoComponentType.SURVEY.value,
                              FormIoComponentType.TEXTAREA.value, FormIoComponentType.TEXTFIELD.value):
            return True

        return False

    @classmethod
    def _check_component_type(cls, survey_id, component, user_id):
        if component['type'] == FormIoComponentType.SURVEY.value:
            questions = component['questions']
            if not questions:
                return

            for question in questions:
                cls._create_or_update_data_for_survey_type(survey_id, component, user_id, question)
        else:
            cls._create_or_update_data(survey_id, component, user_id)

    @staticmethod
    def _create_or_update_data(survey_id, component, user_id) -> ReportSettingModel:
        report_setting_exists = ReportSettingModel.find_by_question_key(survey_id, component['key'])
        if report_setting_exists:
            report_setting_exists.question_id = component['id']
            report_setting_exists.question = component['label']
            report_setting_exists.updated_date = datetime.utcnow()
            report_setting_exists.save()
        else:
            report_setting = ReportSettingModel(survey_id=survey_id,
                                                question_id=component['id'],
                                                question_key=component['key'],
                                                question_type=component['type'],
                                                question=component['label'],
                                                display=True,
                                                created_by=user_id,
                                                created_date=datetime.utcnow()
                                                )
            report_setting.save()

    @staticmethod
    def _create_or_update_data_for_survey_type(survey_id, component, user_id, question) -> ReportSettingModel:
        report_setting_exists = ReportSettingModel.find_by_question_key(survey_id,
                                                                        component['key'] + '-' + question['value'])
        if report_setting_exists:
            report_setting_exists.question_id = component['id'] + '-' + question['value']
            report_setting_exists.question_key = component['key'] + '-' + question['value']
            report_setting_exists.question = component['label']
            report_setting_exists.updated_date = datetime.utcnow()
            report_setting_exists.save()
        else:
            report_setting = ReportSettingModel(survey_id=survey_id,
                                                question_id=component['id'] + '-' + question['value'],
                                                question_key=component['key'] + '-' + question['value'],
                                                question_type=component['type'],
                                                question=question['label'],
                                                display=True,
                                                created_by=user_id,
                                                created_date=datetime.utcnow()
                                                )
            report_setting.save()
