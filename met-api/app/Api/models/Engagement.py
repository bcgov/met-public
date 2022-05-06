from flask.app import Flask
from sqlalchemy.sql.schema import ForeignKey
from .db import  db, ma
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import text

class Engagement(db.Model):
    # Name of the table in our database
    __tablename__ = 'Engagements'
    
    engagement_id= db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(50))
    description = db.Column(db.String(50))
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
        
    @classmethod
    def get_engagement(cls,engagement_id):   
        engagement_schema = EngagementSchema()            
        request = db.session.query(Engagement).filter_by(engagement_id=engagement_id).first()
        return engagement_schema.dump(request)
    
class EngagementSchema(ma.Schema):
    class Meta:
        fields = ('engagement_id', 'title', 'description', 'start_date', 'end_date')
    