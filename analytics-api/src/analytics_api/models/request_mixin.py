"""Super class to handle all operations related to base model."""

from sqlalchemy import ForeignKey
from sqlalchemy.ext.declarative import declared_attr

from .db import db


class RequestMixin:  # pylint: disable=too-few-public-methods
    """Super class to handle all operations related to base model."""

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    @declared_attr
    def survey_id(self):
        """Survey id column."""
        return db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), nullable=False)

    key = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(100))
    label = db.Column(db.String(200))
    request_id = db.Column(db.String(250))
    postion = db.Column(db.Integer)
