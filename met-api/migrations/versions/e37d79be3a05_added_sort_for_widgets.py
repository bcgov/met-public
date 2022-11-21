"""added sort for widgets

Revision ID: e37d79be3a05
Revises: 9f86fdcfb248
Create Date: 2022-11-20 17:25:42.697782

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e37d79be3a05'
down_revision = '9f86fdcfb248'
branch_labels = None
depends_on = None


def upgrade():
    # ### Add Sort index to widget.###
    op.add_column('widget', sa.Column('sort_index', sa.Integer(), nullable=False, server_default='1'))
    # ### end Alembic commands ###


def downgrade():
    # ### Remove the sort index column. ###
    op.drop_column('widget', 'sort_index')
    # ### end Alembic commands ###
