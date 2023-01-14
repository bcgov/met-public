"""merge heads

Revision ID: d86a682d7096
Revises: 242c9f0364df, 4c72047de4d3
Create Date: 2023-01-12 19:33:57.854477

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd86a682d7096'
down_revision = ('242c9f0364df', '4c72047de4d3')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
