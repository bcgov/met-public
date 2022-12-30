"""Document type model class.

Manages document types
"""
from .db import db, ma
from .base_model import BaseModel


class GeneratedDocumentType(BaseModel):
    """Definition of the Generated Document type entity."""

    __tablename__ = 'generated_document_type'
    # Defining the columns

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(30), nullable=False, unique=False)
    description = db.Column(db.String(100), unique=False, nullable=True)

    @classmethod
    def get_document_type_by_id(cls, document_type_id):
        """Get a document type bt id."""
        document_type = db.session.query(GeneratedDocumentType) \
            .filter(GeneratedDocumentType.id == document_type_id) \
            .first()
        return document_type

    @classmethod
    def get_document_types(cls):
        """Get a document types."""
        document_type = db.session.query(GeneratedDocumentType).all()
        return document_type

class GeneratedDocumentTypeSchema(ma.Schema):
    class Meta:
        model = GeneratedDocumentType
        exclude = []
