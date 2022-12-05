"""Widget Documents model class.

Manages the Widget Documents
"""
from __future__ import annotations

from typing import List

from sqlalchemy.sql.schema import ForeignKey
import sqlalchemy as sa

from .base_model import BaseModel
from .db import db


class WidgetDocuments(BaseModel):  # pylint: disable=too-few-public-methods
    """Widget Documents table."""

    __tablename__ = 'widget_documents'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(50))
    type = db.Column(db.String(50), comment='File or Folder identifier')
    parent_document_id = db.Column(db.Integer, ForeignKey('widget_documents.id'))
    url = db.Column(db.String(2000))
    # defines the sorting within the specific widget.Not the overall sorting.
    sort_index = db.Column(db.Integer, nullable=True, default=1)
    widget_id = db.Column(db.Integer, ForeignKey('widget.id', ondelete='CASCADE'), nullable=True)

    @classmethod
    def get_all_by_widget_id(cls, widget_id) -> List[WidgetDocuments]:
        """Get a survey."""
        docs = db.session.query(WidgetDocuments) \
            .filter(WidgetDocuments.widget_id == widget_id) \
            .all()
        return docs

    @classmethod
    def edit_widget_document(cls, widget_id, id, widget_document_data: dict) -> WidgetDocuments:
        """Update document."""
        widget_document = db.session.query(WidgetDocuments) \
            .filter(WidgetDocuments.widget_id == widget_id, WidgetDocuments.id == id)
        widgetdocuments: WidgetDocuments = widget_document.first()
        if not widgetdocuments:
            return None
        widget_document.update(widget_document_data)
        db.session.commit()
        return widgetdocuments

    @classmethod
    def remove_widget_document(cls, widget_id, id) -> WidgetDocuments:
        """Remove document from a document widget."""
        deletedocument = db.session.query(WidgetDocuments) \
            .filter(WidgetDocuments.widget_id == widget_id, \
                sa.or_(WidgetDocuments.id == id , WidgetDocuments.parent_document_id == id)) \
            .delete()
        db.session.commit()
        return deletedocument
