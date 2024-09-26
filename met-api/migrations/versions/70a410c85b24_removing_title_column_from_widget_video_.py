"""Removing title column from widget_video table.

Revision ID: 70a410c85b24
Revises: 58923bf5bda6
Create Date: 2024-09-25 18:53:39.741012

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '70a410c85b24'
down_revision = '58923bf5bda6'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column('widget_translation', 'video_title')
    op.drop_column('widget_video', 'title')


def downgrade():
    op.add_column('widget_video', sa.Column('title', sa.TEXT(), autoincrement=False, nullable=True))
    op.add_column('widget_translation', sa.Column('video_title', sa.TEXT(), autoincrement=False, nullable=True))
