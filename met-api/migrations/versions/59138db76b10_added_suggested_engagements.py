"""Added suggested engagements.

Revision ID: 59138db76b10
Revises: 45a555233a81
Create Date: 2026-03-11 14:20:06.750069

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '59138db76b10'
down_revision = '45a555233a81'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'suggested_engagements',
        sa.Column('id', sa.Integer(), autoincrement=True, primary_key=True),
        sa.Column('engagement_id', sa.Integer(), nullable=False, comment='Parent engagement ID'),
        sa.Column('suggested_engagement_id', sa.Integer(), nullable=False),
        sa.Column('sort_index', sa.Integer(), nullable=False),
        sa.Column('created_by', sa.String(length=50), nullable=True),
        sa.Column('updated_by', sa.String(length=50), nullable=True),
        sa.Column('created_date', sa.DateTime(), nullable=True),
        sa.Column('updated_date', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['engagement_id'], ['engagement.id'], name='parent_engagement_id_fkey', ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['suggested_engagement_id'], ['engagement.id'], name='suggested_engagement_id_fkey', ondelete='CASCADE'),
        sa.UniqueConstraint('engagement_id', 'sort_index', name='uq_suggested_sort_index', deferrable=True, initially='DEFERRED'),
        sa.UniqueConstraint('engagement_id', 'suggested_engagement_id', name='uq_suggested_no_duplicates'),
        sa.CheckConstraint('engagement_id <> suggested_engagement_id', name='ck_no_self_link'),
    )

    op.add_column('engagement', sa.Column('more_engagements_heading', sa.String(length=60), nullable=True))

def downgrade():
    op.drop_table('suggested_engagements')
    op.drop_column('engagement', 'more_engagements_heading')