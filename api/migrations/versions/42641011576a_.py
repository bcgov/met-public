"""Merge revision heads

Revision ID: 42641011576a
Revises: c2a384ddfe6a, bd493dbd9e0e
Create Date: 2024-08-22 17:53:24.806016

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '42641011576a'
down_revision = ('c2a384ddfe6a', 'bd493dbd9e0e')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
