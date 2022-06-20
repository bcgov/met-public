"""empty message

Revision ID: 05d014ff7410
Revises: eef9cc71cca7
Create Date: 2022-06-20 11:21:12.300505

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '05d014ff7410'
down_revision = 'eef9cc71cca7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('engagement', sa.Column('content', sa.Text(), nullable=False))
    op.add_column('engagement', sa.Column('rich_content', postgresql.JSON(astext_type=sa.Text()), nullable=False))
    op.add_column('engagement', sa.Column('banner_image_link', sa.String(), nullable=True))
    op.alter_column('engagement', 'description',
               existing_type=sa.VARCHAR(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('engagement', 'description',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.drop_column('engagement', 'banner_image_link')
    op.drop_column('engagement', 'rich_content')
    op.drop_column('engagement', 'content')
    # ### end Alembic commands ###
