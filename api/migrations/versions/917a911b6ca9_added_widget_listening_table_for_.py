"""Added widget_listening table for storing values particular to the listening widget instance, but not related to contacts.

Revision ID: 917a911b6ca9
Revises: 70a410c85b24
Create Date: 2024-10-01 15:34:13.253066

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '917a911b6ca9'
down_revision = '70a410c85b24'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('widget_listening',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('widget_id', sa.Integer(), nullable=True),
    sa.Column('engagement_id', sa.Integer(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['engagement_id'], ['engagement.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['widget_id'], ['widget.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('widget_translation', sa.Column('listening_description', sa.Text(), nullable=True))


def downgrade():
    op.drop_column('widget_translation', 'listening_description')
    op.drop_table('widget_listening')
