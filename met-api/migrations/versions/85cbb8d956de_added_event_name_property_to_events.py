"""Added event_name property to Events.

Revision ID: 85cbb8d956de
Revises: 917a911b6ca9
Create Date: 2025-04-25 16:41:22.316195

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '85cbb8d956de'
down_revision = '917a911b6ca9'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('event_item', sa.Column('event_name', sa.String(length=100), nullable=True))
    op.add_column('event_item_translation', sa.Column('event_name', sa.String(length=100), nullable=True))

def downgrade():
    op.drop_column('event_item_translation', 'event_name')
    op.drop_column('event_item', 'event_name')
