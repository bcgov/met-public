"""Super class to handle all operations related to base model."""

from .db import db
from datetime import datetime

class BaseModel(db.Model):

    __abstract__ = True
    __bind_key__ = 'met_db_analytics'

    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)
    active_flag = db.Column(db.String(1))