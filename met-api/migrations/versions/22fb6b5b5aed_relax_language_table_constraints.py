"""
Relax language table constraints.

Revision ID: 22fb6b5b5aed
Revises: ae232e299180
Create Date: 2024-05-27 15:56:23.549731

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '22fb6b5b5aed'
down_revision = 'ae232e299180'
branch_labels = None
depends_on = None

def upgrade():
    op.alter_column('language', 'right_to_left', nullable = True)
    op.alter_column('language', 'code', type_ = sa.String(length=20))

def downgrade():
    op.alter_column('language', 'right_to_left', nullable = False)
    op.alter_column('language', 'code', type_ = sa.String(length=2))
    


