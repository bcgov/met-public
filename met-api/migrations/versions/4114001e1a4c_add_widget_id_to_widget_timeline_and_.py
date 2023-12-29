"""Add widget_id to widget_timeline and timeline_event tables

Revision ID: 4114001e1a4c
Revises: c09e77fde608
Create Date: 2023-12-11 15:46:30.773046

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '4114001e1a4c'
down_revision = 'c09e77fde608'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('widget_timeline', sa.Column('widget_id', sa.Integer()))
    op.create_foreign_key('timeline_widget_fk', 'widget_timeline', 'widget', ['widget_id'], ['id'], ondelete='CASCADE')
    op.add_column('timeline_event', sa.Column('widget_id', sa.Integer()))
    op.create_foreign_key('event_widget_fk', 'timeline_event', 'widget', ['widget_id'], ['id'], ondelete='CASCADE')

def downgrade():
    op.drop_column('widget_timeline', 'widget_id')
    op.drop_column('timeline_event', 'widget_id')
