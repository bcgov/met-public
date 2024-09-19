"""Added description_title column to engagement table.

Revision ID: df693f5ddaf9
Revises: 9c1743047332
Create Date: 2024-09-18 15:33:39.791300

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'df693f5ddaf9'
down_revision = '9c1743047332'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('engagement_translation', sa.Column('description_title', sa.String(length=255), nullable=True))
    op.add_column('engagement', sa.Column('description_title', sa.String(length=255), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('engagement_translation', 'description_title')
    op.drop_column('engagement', 'description_title')
    # ### end Alembic commands ###
