"""Add widget ID and heading columns to engagement content table

Revision ID: 3dfef900f2e9
Revises: 42641011576a
Create Date: 2024-09-17 02:21:15.304859

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3dfef900f2e9'
down_revision = '42641011576a'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('engagement_content', sa.Column('heading', sa.String(length=60), nullable=False))
    op.add_column('engagement_content', sa.Column('widget_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'engagement_content', 'widget', ['widget_id'], ['id'], ondelete='CASCADE')
    op.alter_column('widget', 'location',
               existing_type=sa.INTEGER(),
               nullable=False)


def downgrade():
    op.alter_column('widget', 'location',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.drop_constraint(None, 'engagement_content', type_='foreignkey')
    op.drop_column('engagement_content', 'widget_id')
    op.drop_column('engagement_content', 'heading')