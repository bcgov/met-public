from .db import  db, ma
from datetime import datetime
from sqlalchemy.sql.schema import ForeignKey
from .default_method_result import DefaultMethodResult

class Engagement(db.Model):
    # Name of the table in our database
    __tablename__ = 'engagement'
    
    id= db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50))
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
    def create_engagement(cls, engagement) -> DefaultMethodResult:
        new_engagement = Engagement(
            name=engagement["name"], 
            description=engagement['description'],
            start_date=engagement['start_date'], 
            end_date=engagement['end_date'], 
            status_id=1, 
            user_id=1,
            created_date= datetime.utcnow(),
            updated_date= datetime.utcnow(), 
            published_date=None)
        db.session.add(new_engagement)
        db.session.commit()
        
        return DefaultMethodResult(True, 'Engagement Added', new_engagement.id)
    
    @classmethod
    def update_engagement(cls, engagement) -> DefaultMethodResult:
        updated_fields = dict(
            name=engagement["name"], 
            description=engagement['description'],
            start_date=engagement['start_date'], 
            end_date=engagement['end_date'], 
            updated_date= datetime.utcnow(),
        )
        Engagement.query.filter_by(id=engagement['id']).update(updated_fields)
        db.session.commit()

        return DefaultMethodResult(True, 'Engagement Updated', engagement['id'])        
    
class EngagementSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'description', 'start_date', 'end_date', 'status_id', 'user_id', 'updated_date', 'published_date')
    