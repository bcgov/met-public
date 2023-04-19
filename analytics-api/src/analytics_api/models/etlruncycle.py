"""etlruncycle model class.

Manages the etlruncycle
"""
from datetime import datetime
from sqlalchemy import update


from .db import db


class EtlRunCycle(db.Model):  # pylint: disable=too-few-public-methods
    """Definition of the etlruncycle entity."""

    __tablename__ = 'etl_runcycle'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    packagename = db.Column(db.String(100))
    startdatetime = db.Column(db.DateTime, default=datetime.utcnow)
    enddatetime = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.String(3000))
    success = db.Column(db.Boolean(), default=True)