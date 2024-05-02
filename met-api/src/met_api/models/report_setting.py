"""Report setting model class.

Used to store the setting for each question on the survey. Based on the value for the column display the
questions will either be displayed/hidden on the dashboard
"""
from __future__ import annotations

from sqlalchemy import ForeignKey
from met_api.schemas.report_setting import ReportSettingSchema

from .base_model import BaseModel
from .db import db


class ReportSetting(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the report setting entity."""

    __tablename__ = 'report_setting'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), nullable=False)
    question_id = db.Column(db.Text())
    question_key = db.Column(db.Text())
    question_type = db.Column(db.Text())
    question = db.Column(db.Text())
    display = db.Column(db.Boolean, default=True,
                        comment='Flag to identify if the question needs to be diplayed on the dashboard.')

    @classmethod
    def find_by_survey_id(cls, survey_id):
        """Return report setting by survey id."""
        report_settings = db.session.query(ReportSetting) \
            .filter(ReportSetting.survey_id == survey_id) \
            .all()
        return report_settings

    @classmethod
    def find_by_question_key(cls, survey_id, question_key):
        """Return report setting by survey id."""
        report_settings = db.session.query(ReportSetting) \
            .filter(ReportSetting.survey_id == survey_id, ReportSetting.question_key == question_key).first()
        return report_settings

    @staticmethod
    def __create_new_report_settings_entity(survey_id, report_setting: ReportSettingSchema):
        """Create new comment entity."""
        return ReportSetting(
            survey_id=survey_id,
            question_id=report_setting.question_id,
            question_key=report_setting.question_key,
            question_type=report_setting.question_type,
            question=report_setting.question,
            display=report_setting.display
        )

    @classmethod
    def add_all_report_settings(cls, survey_id, report_settings: list, session=None) -> list[ReportSetting]:
        """Create report setting."""
        new_report_setting = [cls.__create_new_report_settings_entity(survey_id, report_setting)
                              for report_setting in report_settings]
        if session is None:
            db.session.add_all(new_report_setting)
            db.session.commit()
        else:
            session.add_all(new_report_setting)
        return new_report_setting

    @classmethod
    def delete_report_settings(cls, survey_id, question_keys: list) -> ReportSetting:
        """Delete report setting by survey id and question key."""
        db.session\
            .query(ReportSetting)\
            .filter(ReportSetting.survey_id == survey_id,
                    ReportSetting.question_key.in_(question_keys))\
            .delete(synchronize_session='fetch')
        db.session.commit()
        return survey_id, question_keys

    @classmethod
    def update_report_settings_bulk(cls, report_settings: list) -> list[ReportSetting]:
        """Save report settings."""
        db.session.bulk_update_mappings(ReportSetting, report_settings)
        db.session.commit()
        return report_settings
