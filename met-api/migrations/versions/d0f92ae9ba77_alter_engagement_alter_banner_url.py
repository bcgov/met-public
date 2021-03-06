"""Alter engagement alter banner_url

Revision ID: d0f92ae9ba77
Revises: 2545d45bb29c
Create Date: 2022-06-27 13:36:48.323235

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd0f92ae9ba77'
down_revision = '2545d45bb29c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('engagement', sa.Column('banner_filename', sa.String(), nullable=True))
    op.drop_column('engagement', 'banner_url')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('engagement', sa.Column('banner_url', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_column('engagement', 'banner_filename')
    # ### end Alembic commands ###
