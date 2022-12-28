"""Document template model class.

Manages document templates
"""
from sqlalchemy import ForeignKey
from datetime import datetime

from .db import db, ma
from .base_model import BaseModel


class GeneratedDocumentTemplate(BaseModel):
    __tablename__ = 'generated_document_template'
    # Defining the columns

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type_id = db.Column(db.Integer, ForeignKey('generated_document_type.id'), nullable=False)
    cdogs_hash_code = db.Column(db.String(64), nullable=True, unique=True)
    extension = db.Column(db.String(10), nullable=False)

    @classmethod
    def get_template_by_type(cls, type_id: int, extension: str = "xlsx"):
        """Given a type and optionally an extension, return the template."""

        query = cls.query.filter_by(type_id = type_id). \
            filter(GeneratedDocumentTemplate.extension == extension)

        return query.one_or_none()

class GeneratedDocumentTemplateSchema(ma.Schema):
    class Meta:
        model = GeneratedDocumentTemplate
        exclude = []
