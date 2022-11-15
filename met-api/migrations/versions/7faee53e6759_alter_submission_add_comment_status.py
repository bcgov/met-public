"""alter submission add comment_status

Revision ID: 7faee53e6759
Revises: 03ee1815f6a6
Create Date: 2022-11-08 10:31:39.240317

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '7faee53e6759'
down_revision = '03ee1815f6a6'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    op.drop_constraint('comment_status_id_fkey', 'comment', type_='foreignkey')
    op.add_column('submission', sa.Column('reviewed_by', sa.String(length=50), nullable=True))
    op.add_column('submission', sa.Column('review_date', sa.DateTime(), nullable=True))
    op.add_column('submission', sa.Column('comment_status_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'submission', 'comment_status', ['comment_status_id'], ['id'], ondelete='SET NULL')

    conn.execute('UPDATE submission s \
                SET reviewed_by=c.reviewed_by, \
                    review_date=c.review_date,\
                    comment_status_id=c.status_id\
                FROM comment c \
                WHERE \
                s.comment_status_id is null AND \
                s.id = c.submission_id')

    op.drop_column('comment', 'reviewed_by')
    op.drop_column('comment', 'review_date')
    op.drop_column('comment', 'status_id')


def downgrade():
    conn = op.get_bind()
    op.drop_constraint(None, 'submission', type_='foreignkey')
    op.add_column('comment', sa.Column('status_id', sa.Integer(), nullable=True))
    op.add_column('comment', sa.Column('review_date', sa.DateTime(), nullable=True))
    op.add_column('comment', sa.Column('reviewed_by', sa.String(length=50), nullable=True))
    op.create_foreign_key('comment_status_id_fkey', 'comment', 'comment_status', ['status_id'], ['id'], ondelete='SET NULL')
    
    conn.execute('UPDATE comment c \
            SET reviewed_by=s.reviewed_by, \
                review_date=s.review_date,\
                status_id=s.comment_status_id\
            FROM submission s \
            WHERE \
            c.status_id is null AND \
            c.submission_id = s.id')

    op.drop_column('submission', 'comment_status_id')
    op.drop_column('submission', 'review_date')
    op.drop_column('submission', 'reviewed_by')
