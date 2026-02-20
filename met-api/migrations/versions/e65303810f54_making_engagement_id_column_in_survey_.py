"""Making engagement_id column in Survey table nullable again.

Revision ID: e65303810f54
Revises: 6b80c03ea472
Create Date: 2026-02-19 17:55:07.103147

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e65303810f54'
down_revision = '6b80c03ea472'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('survey', 'engagement_id',
               existing_type=sa.INTEGER(),
               nullable=True)


def downgrade():
    op.alter_column('survey', 'engagement_id',
               existing_type=sa.INTEGER(),
               nullable=False)
