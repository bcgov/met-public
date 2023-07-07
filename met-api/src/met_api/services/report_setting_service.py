"""Service for report setting management."""

from met_api.models.report_setting import ReportSetting as ReportSettingModel
from met_api.models.survey import Survey as SurveyModel
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
    def refresh_report_setting(cls, report_setting_data):
        """Refresh report setting."""
        if report_setting_data.get('form_json', None) is None:
            raise ValueError('No question available on survey to access settings')

        survey_id = report_setting_data.get('id', None)

        form_json = report_setting_data.get('form_json', None)
        form_type = form_json.get('display', None)

        is_single_page_survey = form_type == 'form'
        is_multi_page_survey = form_type == 'wizard'
        survey_question_keys = []

        if is_single_page_survey:
            form_components = form_json.get('components', None)
            cls._extract_form_component(survey_id, form_components, survey_question_keys)

        if is_multi_page_survey:
            pages = form_json.get('components', None)
            for page in pages:
                form_components = page.get('components', None)
                cls._extract_form_component(survey_id, form_components, survey_question_keys)

        cls._delete_questions_removed_from_form(survey_id, survey_question_keys)

        return report_setting_data

    @classmethod
    def _extract_form_component(cls, survey_id, form_components, survey_question_keys):
        """Loop through the form json to extract each form component."""
        for component in form_components:
            component_type = component.get('type', None)
            has_valid_question_type = cls._validate_component_type(component_type)
            if has_valid_question_type:
                cls._check_for_survey_type_component(survey_id, component, survey_question_keys)

    @staticmethod
    def _validate_component_type(component_type):
        """Check if the component type is among the type that will be displayed on the dashboard."""
        component_type = component_type.lower()

        if component_type in (FormIoComponentType.RADIO.value, FormIoComponentType.CHECKBOX.value,
                              FormIoComponentType.SELECTLIST.value, FormIoComponentType.SURVEY.value,
                              FormIoComponentType.TEXTAREA.value, FormIoComponentType.TEXTFIELD.value):
            return True

        return False

    @classmethod
    def _check_for_survey_type_component(cls, survey_id, component, survey_question_keys):
        # Check if the component type is SURVEY then loop through each question to extract the survey questions
        if component['type'] == FormIoComponentType.SURVEY.value:
            questions = component['questions']
            if not questions:
                return

            for question in questions:
                cls._create_or_update_data_for_survey_type(survey_id, component, question,
                                                           survey_question_keys)
        else:
            cls._create_or_update_data(survey_id, component, survey_question_keys)

    @staticmethod
    def _create_or_update_data(survey_id, component, survey_question_keys) -> ReportSettingModel:
        report_setting = ReportSettingModel.find_by_question_key(survey_id, component['key'])
        survey_question_keys.append(component['key'])

        # Update the record if its existing
        if report_setting:
            report_setting.question_id = component['id']
            report_setting.question = component['label']
        else:
            # Create the record if its not existing
            report_setting = ReportSettingModel(survey_id=survey_id,
                                                question_id=component['id'],
                                                question_key=component['key'],
                                                question_type=component['type'],
                                                question=component['label'],
                                                display=True
                                                )

        report_setting.save()

    @staticmethod
    def _create_or_update_data_for_survey_type(survey_id, component, question,
                                               survey_question_keys) -> ReportSettingModel:
        # For component type SURVEY the unique identifier is a combination of key and value. The key for each
        # question will be same as its part of a single component within form json
        report_setting = ReportSettingModel.find_by_question_key(survey_id,
                                                                 component['key'] + '-' + question['value'])
        survey_question_keys.append(component['key'] + '-' + question['value'])

        # Update the record if its existing
        if report_setting:
            report_setting.question_id = component['id'] + '-' + question['value']
            report_setting.question_key = component['key'] + '-' + question['value']
            report_setting.question = component['label']
        else:
            # Create the record if its not existing
            report_setting = ReportSettingModel(survey_id=survey_id,
                                                question_id=component['id'] + '-' + question['value'],
                                                question_key=component['key'] + '-' + question['value'],
                                                question_type=component['type'],
                                                question=question['label'],
                                                display=True
                                                )

        report_setting.save()

    @classmethod
    def _delete_questions_removed_from_form(cls, survey_id, survey_question_keys):
        # Loop through the data from report setting and delete any record which does not exist on
        # survey form. This will happen if a existing survey question is deleted from the survey
        report_settings = cls.get_report_setting(survey_id)
        for report_setting in report_settings:
            if report_setting['question_key'] not in survey_question_keys:
                ReportSettingModel.delete_report_settings(survey_id, report_setting['question_key'])

    @classmethod
    def update_report_setting(cls, survey_id, new_report_settings):
        """Update report setting."""
        survey = SurveyModel.find_by_id(survey_id)
        if not survey:
            raise KeyError(f'No survey found for {survey_id}')
        for setting in new_report_settings:
            report_setting_id = setting.get('id', None)
            report_setting = ReportSettingModel.find_by_id(report_setting_id)
            if not report_setting:
                raise ValueError(f'No report setting found for {report_setting_id}')
            if report_setting.survey_id != survey_id:
                raise KeyError(f'Report setting {report_setting.id} does not belong to survey {survey_id}')

            report_setting.display = setting.get('display', None)
            report_setting.save()

        return new_report_settings
