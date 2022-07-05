"""update status and user

Revision ID: ec504565fab3
Revises: d0f92ae9ba77
Create Date: 2022-06-29 13:34:24.214735

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime


# revision identifiers, used by Alembic.
revision = 'ec504565fab3'
down_revision = 'd0f92ae9ba77'
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

    conn.execute('UPDATE public.user SET first_name=\'MET\', middle_name=\'\', last_name=\'System\' WHERE id=1')

    conn.execute(
        engagement_status.update()
        .where(engagement_status.c.id==1)
        .values({'status_name': 'Draft', 'description': 'Not ready to the public'}))

    op.bulk_insert(engagement_status, [
        {'id': 2, 'status_name': 'Published', 'description': 'Visible to the public', 'created_date': datetime.utcnow(), 'updated_date': datetime.utcnow()}
    ])
    
    conn.execute('SELECT setval(\'engagement_status_id_seq\', 2);')
    # ### end Alembic commands ###


def downgrade():
    conn = op.get_bind()

    conn.execute('UPDATE public.engagement_status SET status_name=\'draft\', description=\'Test Description\' WHERE id=1')
    conn.execute('UPDATE public.user SET first_name=\'A\', middle_name=\'B\', last_name=\'C\' WHERE id=1')
    conn.execute('DELETE FROM public.engagement_status WHERE id=2')
    
    conn.execute('SELECT setval(\'engagement_status_id_seq\', 1);')
    # ### end Alembic commands ###
