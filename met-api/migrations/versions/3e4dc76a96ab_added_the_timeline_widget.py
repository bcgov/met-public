"""Added the Timeline Widget.

Revision ID: 3e4dc76a96ab
Revises: 02ff8ecc6b91
Create Date: 2023-12-05 17:04:46.304368

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from met_api.constants.timeline_event_status import TimelineEventStatus

# revision identifiers, used by Alembic.
revision = '3e4dc76a96ab'
down_revision = '02ff8ecc6b91'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('widget_timeline',
    sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
    sa.Column('engagement_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['engagement_id'], ['engagement.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    )
    op.create_table('timeline_event',
    sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True, nullable=False),
    sa.Column('engagement_id', sa.Integer(), nullable=False),
    sa.Column('timeline_id', sa.Integer(), nullable=False),
    sa.Column('status', sa.Enum(TimelineEventStatus), nullable=True),
    sa.Column('position', sa.Integer(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('time', sa.String(length=255), nullable=True),
    sa.ForeignKeyConstraint(['engagement_id'], ['engagement.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['timeline_id'], ['widget_timeline.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    )

def downgrade():
    op.drop_table('widget_timeline')
    op.drop_table('timeline_event')
