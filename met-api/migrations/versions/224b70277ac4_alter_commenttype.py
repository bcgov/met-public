"""alter commenttype

Revision ID: 224b70277ac4
Revises: 5110026db916
Create Date: 2022-10-05 11:00:13.349968

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '224b70277ac4'
down_revision = '5110026db916'
branch_labels = None
depends_on = None


def upgrade():
    op.execute('ALTER TYPE public.commenttype ADD VALUE IF NOT EXISTS \'NONE\' AFTER \'Else\';')


def downgrade():
    # alter type will not be reverted since it does not impact the structure.
    pass
