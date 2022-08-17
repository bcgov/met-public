"""Super class to handle all operations related to base model."""

from sqlalchemy import ForeignKey
from sqlalchemy.ext.declarative import declared_attr

from .db import db


class RequestMixin(object):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    @declared_attr
    def survey_id(self):
        return db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), nullable=False)

    key = db.Column(db.String(100), primary_key=True, nullable=False)
    type = db.Column(db.String(100))
    label = db.Column(db.String(200))
    request_id = db.Column(db.String(20))
