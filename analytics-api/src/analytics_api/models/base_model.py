"""Super class to handle all operations related to base model."""

from datetime import datetime

from .db import db


class BaseModel(db.Model):
    __abstract__ = True
    __bind_key__ = 'met_db_analytics'

    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean(), default=True)
    runcycle_id = db.Column(db.Integer)

    @classmethod
    def find_by_id(cls, identifier: int):
        """Return model by id."""
        return cls.query.get(identifier)

    @staticmethod
    def commit():
        """Commit the session."""
        db.session.commit()

    def flush(self):
        """Save and flush."""
        db.session.add(self)
        db.session.flush()
        return self

    def save(self):
        """Save and commit."""
        db.session.add(self)
        db.session.flush()
        db.session.commit()
        return self

    @staticmethod
    def rollback():
        """RollBack."""
        db.session.rollback()
