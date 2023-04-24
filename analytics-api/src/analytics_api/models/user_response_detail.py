"""user response detail model class.

Manages the user responses for a survey
"""
from sqlalchemy import extract, ForeignKey, func
from flask import jsonify

from .base_model import BaseModel
from .db import db


class UserResponseDetail(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the User Response Detail entity."""

    __tablename__ = 'user_response_detail'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), primary_key=True, nullable=False)
    engagement_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)

    @classmethod
    def get_response_count(
        cls,
        engagement_id
    ):
        """Get user response count for an engagement id."""
        response_count = (db.session.query(func.count(UserResponseDetail.id))
                                 .filter(UserResponseDetail.engagement_id == engagement_id)
                                 .filter(UserResponseDetail.is_active == True)
        )

        return response_count.all()


    @classmethod
    def get_response_count_by_created_month(
        cls,
        engagement_id
    ):
        """Get user response count for an engagement id grouped by created month."""
        response_count_by_created_month = (db.session.query(
            extract('month', func.timezone('America/Vancouver', UserResponseDetail.created_date)).label('orderby'),
            func.concat(extract('year', func.timezone('America/Vancouver', UserResponseDetail.created_date)),
                        '-',
                        func.to_char(func.timezone('America/Vancouver', UserResponseDetail.created_date), "FMMon")
                        ).label('showdataby'),
            func.count(UserResponseDetail.id).label('responses'))
            .filter(UserResponseDetail.engagement_id == engagement_id)
            .filter(UserResponseDetail.is_active == True)
            .order_by('orderby')
            .group_by('showdataby', 'orderby').all()
        )
        cols = ['showdataby', 'responses']
        result = [{col: getattr(d, col) for col in cols} for d in response_count_by_created_month]
        return jsonify(result)


    @classmethod
    def get_response_count_by_created_week(
        cls,
        engagement_id
    ):
        """Get user response count for an engagement id grouped by created week."""
        response_count_by_created_week = (db.session.query(
            extract('week', func.timezone('America/Vancouver', UserResponseDetail.created_date)).label('orderby'),
            func.concat(extract('year', func.timezone('America/Vancouver', UserResponseDetail.created_date)),
                        '-',
                        extract('week', func.timezone('America/Vancouver', UserResponseDetail.created_date))
                        ).label('showdataby'),
            func.count(UserResponseDetail.id).label('responses'))
            .filter(UserResponseDetail.engagement_id == engagement_id)
            .filter(UserResponseDetail.is_active == True)
            .order_by('orderby')
            .group_by('showdataby', 'orderby').all()
        )
        cols = ['showdataby', 'responses']
        result = [{col: getattr(d, col) for col in cols} for d in response_count_by_created_week]
        return jsonify(result)
