"""add_position_to_request

Revision ID: e62ba34dc486
Revises: b2ee16c80e7c
Create Date: 2022-10-04 18:05:24.133332

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'e62ba34dc486'
down_revision = 'b2ee16c80e7c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('request_type_option', sa.Column('postion', sa.Integer(), nullable=True))
    op.add_column('request_type_radio', sa.Column('postion', sa.Integer(), nullable=True))
    op.add_column('request_type_selectbox', sa.Column('postion', sa.Integer(), nullable=True))
    op.add_column('request_type_textarea', sa.Column('postion', sa.Integer(), nullable=True))
    op.add_column('request_type_textfield', sa.Column('postion', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('request_type_textfield', 'postion')
    op.drop_column('request_type_textarea', 'postion')
    op.drop_column('request_type_selectbox', 'postion')
    op.drop_column('request_type_radio', 'postion')
    op.drop_column('request_type_option', 'postion')
    # ### end Alembic commands ###
