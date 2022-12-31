"""Document template model class.

Manages document templates
"""
from sqlalchemy import ForeignKey

from .db import db
from .base_model import BaseModel


class GeneratedDocumentTemplate(BaseModel):
    """Definition of the Generated Document template entity."""

    __tablename__ = 'generated_document_template'
    # Defining the columns

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type_id = db.Column(db.Integer, ForeignKey('generated_document_type.id'), nullable=False)
    hash_code = db.Column(db.String(64), nullable=True, unique=True)
    extension = db.Column(db.String(10), nullable=False)

    @classmethod
    def get_document_template_by_id(cls, document_template_id):
        """Get a document template bt id."""
        document_template = db.session.query(GeneratedDocumentTemplate) \
            .filter(GeneratedDocumentTemplate.id == document_template_id) \
            .first()
        return document_template

    @classmethod
    def get_template_by_type(cls, type_id: int, extension: str = 'xlsx'):
        """Given a type and optionally an extension, return the template."""
        query = cls.query.filter_by(type_id=type_id). \
            filter(GeneratedDocumentTemplate.extension == extension)

        return query.one_or_none()

    @classmethod
    def get_document_templates(cls):
        """Get a document types."""
        document_type = db.session.query(GeneratedDocumentTemplate).all()
        return document_type
