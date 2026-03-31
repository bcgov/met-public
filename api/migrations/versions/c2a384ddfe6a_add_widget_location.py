"""Add locations to widgets

Revision ID: c2a384ddfe6a
Revises: 901a6724bca2
Create Date: 2024-08-21 16:04:25.726651

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c2a384ddfe6a'
down_revision = '901a6724bca2'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('widget', sa.Column('location', sa.Integer(), nullable=True))


def downgrade():
    op.drop_column('widget', 'location')
