
from .db import  db, ma
from datetime import datetime

class EngagementStatus(db.Model):
    # Name of the table in our database
    __tablename__ = 'engagement_status'
    
    id= db.Column(db.Integer, primary_key=True, autoincrement=True)
    status_name = db.Column(db.String(50))
    description = db.Column(db.String(50))
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow)    
    engagement_status_id = db.relationship('Engagement', backref= 'engagement_status', cascade="all, delete")
    
class EngagementStatusSchema(ma.Schema):
    class Meta:
        fields = ('id', 'status_name', 'description', 'created_date', 'updated_date')
    
    