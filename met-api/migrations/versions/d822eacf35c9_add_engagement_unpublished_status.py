""" Add unpublished status to engagement

Revision ID: d822eacf35c9
Revises: 7ebd9ecfccdd
Create Date: 2023-09-15 15:34:32.854902

"""
from datetime import datetime
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'd822eacf35c9'
down_revision = '7ebd9ecfccdd'
branch_labels = None
depends_on = None


def upgrade():
    engagement_status = sa.table('engagement_status',
        sa.column('id', sa.Integer),
        sa.column('status_name', sa.String),
        sa.column('description', sa.String),
        sa.column('created_date', sa.DateTime),
        sa.column('updated_date', sa.DateTime))

    op.bulk_insert(engagement_status, [
        {'id': 5, 'status_name': 'Unpublished', 'description': 'Unpublished and hidden', 'created_date': datetime.utcnow(), 'updated_date': datetime.utcnow()}
    ])


def downgrade():
    conn = op.get_bind()
    conn.execute('DELETE FROM engagement_status WHERE id=5')
