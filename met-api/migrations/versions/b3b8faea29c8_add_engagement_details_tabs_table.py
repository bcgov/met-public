"""Add engagement_details_tabs table

Revision ID: b3b8faea29c8
Revises: 85cbb8d956de
Create Date: 2025-11-28 13:42:36.039948

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b3b8faea29c8'
down_revision = '85cbb8d956de'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('engagement_details_tabs',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('engagement_id', sa.Integer(), nullable=False),
    sa.Column('label', sa.String(length=20), nullable=False),
    sa.Column('slug', sa.String(length=20), nullable=False),
    sa.Column('heading', sa.String(length=60), nullable=False),
    sa.Column('body', sa.JSON(), nullable=False),
    sa.Column('sort_index', sa.Integer(), nullable=False),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['engagement_id'], ['engagement.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('engagement_details_tabs')
