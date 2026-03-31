"""Added feedback heading and feedback body columns to engagement table.

Revision ID: 6261697b7a20
Revises: 539c56c61127
Create Date: 2026-02-06 14:12:26.770307

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '6261697b7a20'
down_revision = '539c56c61127'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('engagement', sa.Column('feedback_heading', sa.String(length=60), nullable=True))
    op.add_column('engagement', sa.Column('feedback_body', postgresql.JSON(astext_type=sa.Text()), nullable=True))


def downgrade():
    op.drop_column('engagement', 'feedback_body')
    op.drop_column('engagement', 'feedback_heading')
