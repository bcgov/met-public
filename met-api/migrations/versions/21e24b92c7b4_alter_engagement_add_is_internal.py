"""Alter engagement Add is_internal

Revision ID: 21e24b92c7b4
Revises: 2b75eb893e6b
Create Date: 2023-05-12 13:26:05.950118

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '21e24b92c7b4'
down_revision = '2b75eb893e6b'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('engagement', sa.Column('is_internal', sa.Boolean(), nullable=True))
    op.execute('UPDATE engagement SET is_internal = false')
    op.alter_column('engagement', 'is_internal',
               existing_type=sa.Boolean(),
               nullable=False)


def downgrade():
    op.drop_column('engagement', 'is_internal')
