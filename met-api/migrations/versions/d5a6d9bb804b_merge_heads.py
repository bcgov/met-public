"""merge heads

Revision ID: d5a6d9bb804b
Revises: 4f5f91937f5c, d822eacf35c9
Create Date: 2023-09-19 13:12:04.624782

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd5a6d9bb804b'
down_revision = ('4f5f91937f5c', 'd822eacf35c9')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
