"""Super class to handle all operations related to base model."""

from sqlalchemy import ForeignKey
from sqlalchemy.ext.declarative import declared_attr

from .db import db


class ResponseMixin(object):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    """
      Response needs to have additonal fields as   
          request_key = simpletextfield,checkbox,simplecheckboxes
          value = actual user value
          request_id = mapping to questions.Id from the reuqst table.Helps with groupiing
      """

    @declared_attr
    def survey_id(self):
        return db.Column(db.Integer, ForeignKey('survey.id', ondelete='CASCADE'), nullable=False)

    user_id = db.Column(db.Integer)
    request_key = db.Column(db.String(100), primary_key=True, nullable=False)
    value = db.Column(db.Text())
    request_id = db.Column(db.String(20))
