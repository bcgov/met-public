"""add reject reason

Revision ID: ffac8f5b4288
Revises: 2b12a6cd987a
Create Date: 2022-12-07 12:11:33.172817

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ffac8f5b4288'
down_revision = '2b12a6cd987a'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('submission', sa.Column('has_personal_info', sa.Boolean(), nullable=True))
    op.add_column('submission', sa.Column('has_profanity', sa.Boolean(), nullable=True))
    op.add_column('submission', sa.Column('rejected_reason_other', sa.String(length=50), nullable=True))
    op.add_column('submission', sa.Column('has_threat', sa.Boolean(), nullable=True))


def downgrade():
    op.drop_column('submission', 'has_threat')
    op.drop_column('submission', 'rejected_reason_other')
    op.drop_column('submission', 'has_profanity')
    op.drop_column('submission', 'has_personal_info')
