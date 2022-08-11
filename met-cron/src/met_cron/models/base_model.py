"""Super class to handle all operations related to base model."""

from datetime import datetime

from .db import db


class BaseModel(db.Model):
    __abstract__ = True
    __bind_key__ = 'met_db_analytics'

    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    active_flag = db.Column(db.String(1))

    @classmethod
    def find_by_id(cls, identifier: int):
        """Return model by id."""
        return cls.query.get(identifier)

    @classmethod
    def find_by_survey_id(cls, identifier: int):
        """Return model by id."""
        return cls.query.get(identifier)
