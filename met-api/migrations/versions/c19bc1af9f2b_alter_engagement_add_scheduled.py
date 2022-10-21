"""alter engagement add scheduled

Revision ID: c19bc1af9f2b
Revises: 6ce7831704cb
Create Date: 2022-10-21 11:43:06.798995

"""
from datetime import datetime
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c19bc1af9f2b'
down_revision = '6ce7831704cb'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('engagement', sa.Column('scheduled_date', sa.DateTime(), nullable=True))

    engagement_status = sa.table('engagement_status',
        sa.column('id', sa.Integer),
        sa.column('status_name', sa.String),
        sa.column('description', sa.String),
        sa.column('created_date', sa.DateTime),
        sa.column('updated_date', sa.DateTime))

    op.bulk_insert(engagement_status, [
        {'id': 4, 'status_name': 'Scheduled', 'description': 'Scheduled to the published', 'created_date': datetime.utcnow(), 'updated_date': datetime.utcnow()}
    ])


def downgrade():
    conn = op.get_bind()
    op.drop_column('engagement', 'scheduled_date')
    conn.execute('DELETE FROM public.engagement_status WHERE id=4')
