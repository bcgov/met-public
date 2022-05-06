from .db import  db, ma
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey

class Engagement(db.Model):
    # Name of the table in our database
    __tablename__ = 'engagement'
    
    id= db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(50))
    description = db.Column(db.String(50))
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    status_id = db.Column(db.Integer, ForeignKey('engagement_status.id', ondelete='CASCADE')),
    created_by = db.Column(db.Integer, ForeignKey('user.id', ondelete='CASCADE')),
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)
    published_date = db.Column(db.DateTime, nullable=True)

    user = relationship('User', foreign_keys='Engagement.created_by')
    engagement_status = relationship('EngagementStatus', foreign_keys='Engagement.status_id')
        
    @classmethod
    def get_engagement(cls,engagement_id):   
        engagement_schema = EngagementSchema()            
        request = db.session.query(Engagement).filter_by(engagement_id=engagement_id).first()
        return engagement_schema.dump(request)
    
class EngagementSchema(ma.Schema):
    class Meta:
        fields = ('engagement_id', 'title', 'description', 'start_date', 'end_date', 'status_id', 'created_by', 'updated_date', 'published_date')
    