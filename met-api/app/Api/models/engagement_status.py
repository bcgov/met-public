from flask.app import Flask
from sqlalchemy.sql.schema import ForeignKey
from .db import  db, ma
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import text
import datetime

class EngagementStatus(db.Model):
    # Name of the table in our database
    __tablename__ = 'engagement_status'
    
    id= db.Column(db.Integer, primary_key=True, autoincrement=True)
    status_name = db.Column(db.String(50))
    description = db.Column(db.String(50))
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)
    