"""add_widget_type_document

Revision ID: 9f86fdcfb248
Revises: 7faee53e6759
Create Date: 2022-11-16 13:58:32.284108

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9f86fdcfb248'
down_revision = '7faee53e6759'
branch_labels = None
depends_on = None


def upgrade():
    widget_type_table = sa.table('widget_type',
        sa.Column('id', sa.Integer),
        sa.Column('name', sa.String),
        sa.Column('description', sa.String))

    op.bulk_insert(widget_type_table, [
        {'id': 2, 'name': 'Documents', 'description': 'Displays important documents on the engagement'}
    ])


def downgrade():
    conn = op.get_bind()

    conn.execute('DELETE FROM widget_type WHERE id=2')