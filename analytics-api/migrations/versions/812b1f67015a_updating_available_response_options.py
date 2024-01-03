"""updating_available_response_options

Revision ID: 812b1f67015a
Revises: e7fdf769e8ff
Create Date: 2023-11-30 09:50:55.874798

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '812b1f67015a'
down_revision = 'e7fdf769e8ff'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('available_response_option', 'request_key', type_=sa.Text())
    op.alter_column('available_response_option', 'request_id', type_=sa.Text())
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('available_response_option', 'request_key', type_=sa.String(length=100))
    op.alter_column('available_response_option', 'request_id', type_=sa.String(length=20))
    # ### end Alembic commands ###
