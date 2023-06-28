"""Report setting model class.

Used to store the setting for each question on the survey. Based on the value for the column display the 
questions will either be displayed/hidden on the dashboard
"""
from __future__ import annotations

from sqlalchemy import ForeignKey
from .base_model import BaseModel
from .db import db


class ReportSetting(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the report setting entity."""

    __tablename__ = 'report_setting'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), nullable=False)
    question_id = db.Column(db.String(250))
    question_key = db.Column(db.String(100))
    question_type = db.Column(db.String(100))
    question = db.Column(db.String(200))
    display = db.Column(db.Boolean, default=True)

    @classmethod
    def get_report_settings_by_survey_id(cls, survey_id):
        """Return report setting by survey id."""
        report_settings = db.session.query(ReportSetting) \
            .filter(ReportSetting.survey_id == survey_id) \
            .all()
        return report_settings
