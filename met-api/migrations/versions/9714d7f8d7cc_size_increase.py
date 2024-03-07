"""size increase

Revision ID: 9714d7f8d7cc
Revises: 1c5883959156
Create Date: 2023-09-06 11:43:37.142580

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '9714d7f8d7cc'
down_revision = '1c5883959156'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('report_setting', 'question_key', type_=sa.String(length=250))
    op.alter_column('report_setting', 'question_type', type_=sa.String(length=250))
    op.alter_column('report_setting', 'question', type_=sa.String(length=250))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###