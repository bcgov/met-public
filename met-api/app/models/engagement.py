from .db import  db, ma
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.sql.expression import distinct
from .default_method_result import DefaultMethodResult


class Engagement(db.Model):
    # Name of the table in our database
    __tablename__ = 'engagement'
    
    id= db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(50))
    description = db.Column(db.String(50))
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    status_id = db.Column(db.Integer, ForeignKey('engagement_status.id', ondelete='CASCADE'))
    created_date = db.Column(db.DateTime, default=datetime.utcnow())
    updated_date = db.Column(db.DateTime, onupdate=datetime.utcnow())
    published_date = db.Column(db.DateTime, nullable=True)
    user_id = db.Column(db.Integer, ForeignKey('user.id', ondelete='CASCADE'))

    @classmethod
    def get_engagement(cls,engagement_id):
        engagement_schema = EngagementSchema()            
        request = db.session.query(Engagement).filter_by(id=engagement_id).first()
        return engagement_schema.dump(request) 
        
    @classmethod
    def get_all_engagements(cls):
        engagements_schema = EngagementSchema(many=True)
        query = db.session.query(Engagement).order_by(Engagement.id.asc()).all()
        return engagements_schema.dump(query)  

    @classmethod
    def save_engagement(cls, engagement) -> DefaultMethodResult: 
        new_engagement = Engagement(
            title=engagement["title"], 
            description=engagement['description'],
            start_date=engagement['start_date'], 
            end_date=engagement['end_date'], 
            status_id=1, 
            user_id=1, 
            updated_date= datetime.utcnow(), 
            published_date=engagement['published_date']
        )
        db.session.add(new_engagement)
        db.session.commit()
        
        return DefaultMethodResult(True, 'Engagement Added', new_engagement.id)
    
class EngagementSchema(ma.Schema):
    class Meta:
        fields = ('id', 'title', 'description', 'start_date', 'end_date', 'status_id', 'user_id', 'updated_date', 'published_date')
    