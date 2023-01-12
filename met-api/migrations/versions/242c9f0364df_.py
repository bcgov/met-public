"""add subscribe widget type

Revision ID: 242c9f0364df
Revises: 17bae2d586fb
Create Date: 2023-01-12 12:17:27.360418

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '242c9f0364df'
down_revision = '17bae2d586fb'
branch_labels = None
depends_on = None


def upgrade():
    widget_type_table = sa.table('widget_type',
        sa.Column('id', sa.Integer),
        sa.Column('name', sa.String),
        sa.Column('description', sa.String))

    op.bulk_insert(widget_type_table, [
        {'id': 4, 'name': 'Subscribe', 'description': 'Allows users to subscribe to an engagement'}
    ])


def downgrade():
    conn = op.get_bind()
    conn.execute('DELETE FROM widget_type WHERE id=4')
