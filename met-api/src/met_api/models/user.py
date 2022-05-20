import datetime

from .db import db, ma


class User(db.Model):
    # Name of the table in our database
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(50))
    middle_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50))
    email_id = db.Column(db.String(50))
    contact_number = db.Column(db.String(50), nullable=True)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_date = db.Column(db.DateTime, onupdate=datetime.datetime.utcnow)
    engagement_id = db.relationship('Engagement', backref='user', cascade="all, delete")


class UserSchema(ma.Schema):
    class Meta:
        fields = (
        'id', 'first_name', 'middle_name', 'last_name', 'email_id', 'contact_number', 'created_date', 'updated_date')
