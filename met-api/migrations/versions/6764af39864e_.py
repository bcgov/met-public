"""

Revision ID: 6764af39864e
Revises: ffac8f5b4288
Create Date: 2022-12-13 19:47:27.460920

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '6764af39864e'
down_revision = 'ffac8f5b4288'
branch_labels = None
depends_on = None


def upgrade():
    # reset users type
    update_reset_access_type_query = f"update met_users set access_type = null where 0=0"
    op.execute(update_reset_access_type_query)
    # ### end Alembic commands ###


def downgrade():
    # no downgrade
    print ("no downgrade")
