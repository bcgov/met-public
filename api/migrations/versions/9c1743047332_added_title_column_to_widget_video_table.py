"""added title column to widget_video table.

Revision ID: 9c1743047332
Revises: e706db763790
Create Date: 2024-09-16 13:09:41.765003

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9c1743047332'
down_revision = 'e706db763790'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('widget_translation', sa.Column('video_title', sa.Text(), nullable=True))
    op.add_column('widget_video', sa.Column('title', sa.Text(), nullable=True))


def downgrade():
    op.drop_column('widget_translation', 'video_title')
    op.drop_column('widget_video', 'title')
