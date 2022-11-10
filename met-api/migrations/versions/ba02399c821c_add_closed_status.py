"""update status and user

Revision ID: ec504565fab3
Revises: d0f92ae9ba77
Create Date: 2022-06-29 13:34:24.214735

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime


# revision identifiers, used by Alembic.
revision = 'ba02399c821c'
down_revision = 'cb965cb4a3ad'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()

    engagement_status = sa.table('engagement_status',
        sa.column('id', sa.Integer),
        sa.column('status_name', sa.String),
        sa.column('description', sa.String),
        sa.column('created_date', sa.DateTime),
        sa.column('updated_date', sa.DateTime))

    op.bulk_insert(engagement_status, [
        {'id': 3, 'status_name': 'Closed', 'description': 'The engagement period is over', 'created_date': datetime.utcnow(), 'updated_date': datetime.utcnow()}
    ])
    
    conn.execute('SELECT setval(\'engagement_status_id_seq\', 3);')


def downgrade():
    conn = op.get_bind()

    conn.execute('DELETE FROM public.engagement_status WHERE id=3')    
    conn.execute('SELECT setval(\'engagement_status_id_seq\', 2);')
