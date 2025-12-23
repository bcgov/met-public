"""Engagement Details Tab translation model class.

Manages the Engagement Details Tab Translations.
"""

from __future__ import annotations
from datetime import datetime
from typing import Optional
from sqlalchemy import UniqueConstraint
from .base_model import BaseModel
from .db import db
from .engagement_details_tab import EngagementDetailsTab


class EngagementDetailsTabTranslation(BaseModel):
    """Definition of the Engagement Details Tab Translation entity."""

    __tablename__ = 'engagement_details_tab_translations'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    language_id = db.Column(db.Integer, db.ForeignKey('language.id', ondelete='CASCADE'), nullable=False)
    engagement_details_tab_id = db.Column(
        db.Integer, db.ForeignKey('engagement_details_tabs.id', ondelete='CASCADE'), nullable=False
    )
    label = db.Column(db.String(20), nullable=False)
    slug = db.Column(db.String(20), nullable=False)
    heading = db.Column(db.String(60), nullable=False)
    body = db.Column(db.Text, nullable=False)

    # Add a unique constraint on engagement_details_tab_id and language_id
    # An engagement details tab has only one version in a particular language
    __table_args__ = (
        UniqueConstraint(
            'engagement_details_tab_id',
            'language_id',
            name='_engagement_details_tab_language_uc',
        ),
    )

    @classmethod
    def find_by_engagement_and_language(
        cls,
        engagement_id: int,
        language_id: int,
    ) -> list['EngagementDetailsTabTranslation']:
        """Get a details tab translation by inputting the engagement ID and language ID."""
        return (
            db.session.query(cls)
            .join(EngagementDetailsTab, EngagementDetailsTab.id == cls.engagement_details_tab_id)
            .filter(
                EngagementDetailsTab.engagement_id == engagement_id,
                cls.language_id == language_id,
            )
            .order_by(EngagementDetailsTab.sort_index.asc())
            .all()
        )

    @classmethod
    def bulk_insert_details_tab_translations(cls, insert_mappings: list) -> None:
        """Insert multiple engagement details tab translations."""
        db.session.bulk_insert_mappings(cls, insert_mappings)
        db.session.commit()

    @classmethod
    def bulk_update_details_tab_translations(cls, update_mappings: list) -> None:
        """Update multiple engagement details tab translations."""
        db.session.bulk_update_mappings(cls, update_mappings)
        db.session.commit()

    @classmethod
    def update_details_tab_translation(cls, engagement_id: int, translation_id: int, translation_data: dict
                                       ) -> Optional['EngagementDetailsTabTranslation']:
        """Update a single details tab translation."""
        translation = (
            db.session.query(cls)
            .join(EngagementDetailsTab, EngagementDetailsTab.id == cls.engagement_details_tab_id)
            .filter(cls.id == translation_id, EngagementDetailsTab.engagement_id == engagement_id)
            .first()
        )
        if not translation:
            return None

        translation_data['updated_date'] = datetime.now()
        for k, v in translation_data.items():
            setattr(translation, k, v)
        db.session.commit()
        db.session.refresh(translation)
        return translation

    @classmethod
    def delete_translations_by_ids(cls, translation_ids: set) -> None:
        """Delete multiple translations by ID."""
        db.session.query(cls).filter(cls.id.in_(translation_ids)).delete(synchronize_session=False)
        db.session.commit()

    @classmethod
    def delete_details_tab_translation(cls, engagement_id: int, translation_id: int) -> int:
        """Delete a single details tab translation by engagement ID and translation ID."""
        translation = (
            db.session.query(cls)
            .join(EngagementDetailsTab, EngagementDetailsTab.id == cls.engagement_details_tab_id)
            .filter(cls.id == translation_id, EngagementDetailsTab.engagement_id == engagement_id)
            .first()
        )
        if not translation:
            return False

        db.session.delete(translation)          # object-level delete (unit of work)
        db.session.commit()
        return True
