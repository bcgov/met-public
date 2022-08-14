# Copyright © 2019 Province of British Columbia
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Service to do ETL on e."""
from datetime import datetime, timedelta
from typing import List

from flask import current_app

from met_cron.models.db import db
from met_cron.models.request_type_radio import RequestTypeRadio as MetRequestTypeRadioModel
from met_cron.models.request_type_selectbox import RequestTypeSelectbox as MetRequestTypeSelectBoxesModel
from met_cron.models.request_type_textarea import RequestTypeTextarea as MetRequestTypeTextAreaModel
from met_cron.models.request_type_textfield import RequestTypeTextfield as MetRequestTypeTextModel
from met_cron.models.survey import Survey as EtlSurveyModel
from met_api.models.survey import Survey as MetSurveyModel
from met_cron.utils import FormIoComponentType


class SurveyEtlService:  # pylint: disable=too-few-public-methods
    """ETL Service on Surveys."""

    @staticmethod
    def do_etl_surveys():
        """Run ETL on Survey and Survey inputs."""

        new_surveys = SurveyEtlService._get_updated_surveys()

        if not new_surveys:
            current_app.logger.info('No updated Surveys Found')
            return
        current_app.logger.info('Total updated surveys Found : %s.', len(new_surveys))

        SurveyEtlService._do_etl_survey_data(new_surveys)
        # SurveyEtlService._do_etl_survey_inputs(new_surveys)
        # commit after both jobs are done
        db.session.commit()

    @staticmethod
    def _get_updated_surveys():
        time_delta_in_minutes: int = int(current_app.config.get('TIME_DELTA_IN_MINUTES'))
        time_delta = datetime.utcnow() - timedelta(minutes=time_delta_in_minutes)
        new_surveys = db.session.query(MetSurveyModel).filter(MetSurveyModel.updated_date > time_delta).all()
        return new_surveys

    @staticmethod
    def _do_etl_survey_data(new_surveys: List[MetSurveyModel]):
        """Perform the ETL for Survey.

        Check if it already exists in DB
        If Yes, Inactivate the existing one , Create new  one
        If No, create it
        """
        survey: MetSurveyModel
        for survey in new_surveys:
            current_app.logger.info('Processing updated survey: %s.', survey.id)
            existing_survey: EtlSurveyModel
            if existing_survey := EtlSurveyModel.find_by_source_id(survey.id):
                current_app.logger.info('Found existing Surveys in Analytics DB: %s.', existing_survey)
                EtlSurveyModel.deactivate_by_source_id(survey.id)
            SurveyEtlService._load_survey_obj(survey)

    @staticmethod
    def _do_etl_survey_inputs(surveys: List[MetSurveyModel]):
        """Perform the ETL on survey form and extract to questions.

        1.Extract data out of survey.form_json.
        2.Iterate form_json.components.
        3.Check Type and save to db
        """

        for survey in surveys:
            if survey.form_json is None:
                # throw error or notify by logging
                current_app.logger.info('Survey Found without form_json: %s.Skipping it', survey.id)
                continue

            # check already if questions exists in DB for this survey.
            # update all MetRequestTypeRadioModel active_flag to N
            SurveyEtlService._inactivate_old_questions(survey.id)

            # extract data out of survey.form_json and save now
            for component in survey.form_json['components']:
                current_app.logger.info('Survey: %s.Processing component with id %s and type: %s and label %s ',
                                        survey.id,
                                        component.get('id', None), component.get('type', None),
                                        component.get('label', None))
                model_type = SurveyEtlService._identify_form_type(component.get('type', None))
                current_app.logger.info(
                    'Survey: %s.Model Type component with id %s and type: %s mapped to db object type: %s ',
                    survey.id,
                    component.get('id', None), component.get('type', None),
                    model_type)
                if model_type:
                    SurveyEtlService._create_input_model(component, model_type, survey)

    @staticmethod
    def _identify_form_type(component_type):
        model_type = None
        if component_type == FormIoComponentType.RADIOS.value:  # TODO dict and pick from it
            # radio save only the question label
            model_type = MetRequestTypeSelectBoxesModel
        elif component_type == FormIoComponentType.CHECKBOXES.value:
            # select box save only the question label
            model_type = MetRequestTypeSelectBoxesModel
        elif component_type == FormIoComponentType.TEXT.value or component_type == FormIoComponentType.SIMPLE_TEXT.value:
            model_type = MetRequestTypeTextModel
            # select box save only the question label

        return model_type

    @staticmethod
    def _create_input_model(component, model_name, survey):
        form_model: model_name = model_name(
            survey_id=survey.id,
            engagement_id=survey.engagement_id,
            id=component['id'],
            label=component['label'],
            active_flag='R',
            key=component['key'],
            type=component['type']
        )
        db.session.add(form_model)
        return form_model

    @staticmethod
    def _inactivate_old_questions(survey_id):
        deactive_flag = {'active_flag': 'N'}
        current_app.logger.info('Inactivating Surve: %s questions if any', survey_id)
        db.session.query(MetRequestTypeRadioModel).filter(MetRequestTypeRadioModel.survey_id == survey_id).update(
            deactive_flag)
        db.session.query(MetRequestTypeSelectBoxesModel).filter(
            MetRequestTypeSelectBoxesModel.survey_id == survey_id).update(deactive_flag)
        db.session.query(MetRequestTypeTextModel).filter(MetRequestTypeTextModel.survey_id == survey_id).update(
            deactive_flag)
        db.session.query(MetRequestTypeTextAreaModel).filter(
            MetRequestTypeTextAreaModel.survey_id == survey_id).update(deactive_flag)

    @staticmethod
    def _load_survey_obj(existing_survey):
        survey: EtlSurveyModel = EtlSurveyModel()
        survey.name = existing_survey.name
        survey.source_survey_id = existing_survey.id
        survey.engagement_id = existing_survey.engagement_id
        survey.active_flag = True
        survey.flush()
        current_app.logger.info('Created New Survey: %s.', survey.id)
        return survey
