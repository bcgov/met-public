"""Added enum value for Timeline Widget.

Revision ID: c09e77fde608
Revises: 3e4dc76a96ab
Create Date: 2023-12-06 11:46:20.934373

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'c09e77fde608'
down_revision = '3e4dc76a96ab'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('timeline_event', sa.Column('created_date', sa.DateTime(), nullable=False))
    op.add_column('timeline_event', sa.Column('updated_date', sa.DateTime(), nullable=True))
    op.add_column('timeline_event', sa.Column('created_by', sa.String(length=50), nullable=True))
    op.add_column('timeline_event', sa.Column('updated_by', sa.String(length=50), nullable=True))
    
    op.add_column('widget_timeline', sa.Column('created_date', sa.DateTime(), nullable=False))
    op.add_column('widget_timeline', sa.Column('updated_date', sa.DateTime(), nullable=True))
    op.add_column('widget_timeline', sa.Column('created_by', sa.String(length=50), nullable=True))
    op.add_column('widget_timeline', sa.Column('updated_by', sa.String(length=50), nullable=True))

    widget_type_table = sa.table('widget_type',
        sa.Column('id', sa.Integer),
        sa.Column('name', sa.String),
        sa.Column('description', sa.String))

    op.bulk_insert(
        widget_type_table,
        [
            {
                'id': 8,
                'name': 'CAC Form',
                'description': 'Add a CAC Form to your project',
            },
            {
                'id': 9,
                'name': 'Timeline',
                'description': 'Create a timeline for a series of events',
            },
        ]
    )

def downgrade():
    op.drop_column('widget_timeline', 'updated_by')
    op.drop_column('widget_timeline', 'created_by')
    op.drop_column('widget_timeline', 'updated_date')
    op.drop_column('widget_timeline', 'created_date')
    op.drop_column('timeline_event', 'updated_by')
    op.drop_column('timeline_event', 'created_by')
    op.drop_column('timeline_event', 'updated_date')
    op.drop_column('timeline_event', 'created_date')
    op.delete(widget_type_table).filter_by(id=8)
    op.delete(widget_type_table).filter_by(id=9)
