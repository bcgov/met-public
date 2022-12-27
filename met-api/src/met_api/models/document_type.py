"""Document type model class.

Manages document types
"""
from .db import db, ma
from .base_model import BaseModel


class DocumentType(BaseModel):
    __tablename__ = 'document_type'
    # Defining the columns

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(30), nullable=False, unique=False)
    description = db.Column(db.String(100), unique=False, nullable=True)

    @classmethod
    def get_document_type_by_name(cls, name: str):
        """Given a type and optionally an extension, return the template."""

        query = cls.query.filter_by(name = name)

        return query.one_or_none()

    # def save(self):
    #     """Save and commit."""
    #     db.session.add(self)
    #     db.session.flush()
    #     db.session.commit()

    #     return self

class DocumentTypeSchema(ma.Schema):
    class Meta:
        model = DocumentType
        exclude = []
