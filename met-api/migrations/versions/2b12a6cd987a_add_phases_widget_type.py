"""add phases widget type

Revision ID: 2b12a6cd987a
Revises: 642925969c53
Create Date: 2022-11-23 15:34:53.240556

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2b12a6cd987a'
down_revision = '642925969c53'
branch_labels = None
depends_on = None


def upgrade():
    widget_type_table = sa.table('widget_type',
        sa.Column('id', sa.Integer),
        sa.Column('name', sa.String),
        sa.Column('description', sa.String))

    op.bulk_insert(widget_type_table, [
        {'id': 3, 'name': 'Phases', 'description': 'Displays information about the engagement phase'}
    ])


def downgrade():
    conn = op.get_bind()

    conn.execute('DELETE FROM widget_type WHERE id=3')