"""user response detail model class.

Manages the user responses for a survey
"""
from flask import jsonify
from sqlalchemy import Date, ForeignKey, cast, extract, func
from sqlalchemy.sql.expression import true

from .base_model import BaseModel
from .db import db


class UserResponseDetail(BaseModel):  # pylint: disable=too-few-public-methods
    """Definition of the User Response Detail entity."""

    __tablename__ = 'user_response_detail'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    survey_id = db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), nullable=False)
    engagement_id = db.Column(db.Integer)
    participant_id = db.Column(db.Integer)

    @classmethod
    def get_response_count(
        cls,
        engagement_id
    ):
        """Get user response count for an engagement id."""
        response_count = (db.session.query(UserResponseDetail)
                          .filter(UserResponseDetail.engagement_id == engagement_id)
                          .filter(UserResponseDetail.is_active == true()))

        return response_count.count()

    @classmethod
    def get_response_count_by_created_month(
        cls,
        engagement_id,
        search_options=None
    ):
        """Get user response count for an engagement id grouped by created month."""
        filters = [UserResponseDetail.engagement_id == engagement_id, UserResponseDetail.is_active == true()]

        if search_options:
            filters = cls._append_search_options_filters(filters, search_options)

        response_count_by_created_month = (db.session.query(
            extract('month', func.timezone('America/Vancouver', UserResponseDetail.created_date)).label('orderby'),
            func.concat(extract('year', func.timezone('America/Vancouver', UserResponseDetail.created_date)),
                        '-',
                        func.to_char(func.timezone('America/Vancouver', UserResponseDetail.created_date), 'FMMon')
                        ).label('showdataby'),
            func.count(UserResponseDetail.id).label('responses'))
            .filter(*filters)
            .order_by('orderby')
            .group_by('showdataby', 'orderby').all()
        )
        cols = ['showdataby', 'responses']
        result = [{col: getattr(d, col) for col in cols} for d in response_count_by_created_month]
        return jsonify(result)

    @classmethod
    def get_response_count_by_created_week(
        cls,
        engagement_id,
        search_options=None
    ):
        """Get user response count for an engagement id grouped by created week."""
        filters = [UserResponseDetail.engagement_id == engagement_id, UserResponseDetail.is_active == true()]

        if search_options:
            filters = cls._append_search_options_filters(filters, search_options)

        response_count_by_created_week = (db.session.query(
            extract('week', func.timezone('America/Vancouver', UserResponseDetail.created_date)).label('orderby'),
            func.concat(extract('year', func.timezone('America/Vancouver', UserResponseDetail.created_date)),
                        '-',
                        extract('week', func.timezone('America/Vancouver', UserResponseDetail.created_date))
                        ).label('showdataby'),
            func.count(UserResponseDetail.id).label('responses'))
            .filter(*filters)
            .order_by('orderby')
            .group_by('showdataby', 'orderby').all()
        )
        cols = ['showdataby', 'responses']
        result = [{col: getattr(d, col) for col in cols} for d in response_count_by_created_week]
        return jsonify(result)

    @staticmethod
    def _append_search_options_filters(filters, search_options):
        if search_options.get('from_date'):
            filters.append(cast(UserResponseDetail.created_date, Date) >= search_options.get('from_date'))

        if search_options.get('to_date'):
            filters.append(cast(UserResponseDetail.created_date, Date) <= search_options.get('to_date'))

        return filters
