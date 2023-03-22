"""engagement metadata

Revision ID: d9903bcc7d97
Revises: db3ffa0dd6ad
Create Date: 2023-03-22 08:50:47.710761

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'd9903bcc7d97'
down_revision = 'db3ffa0dd6ad'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('email_verification', 'type',
               existing_type=postgresql.ENUM('Survey', 'RejectedComment', 'Subscribe', name='emailverificationtype'),
               nullable=False)
    op.add_column('engagement', sa.Column('parent_id', sa.String(length=50), nullable=True))
    op.add_column('engagement', sa.Column('project_metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    op.alter_column('membership_status_codes', 'created_date',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
    op.alter_column('widget_type', 'created_date',
               existing_type=postgresql.TIMESTAMP(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('widget_type', 'created_date',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
    op.alter_column('membership_status_codes', 'created_date',
               existing_type=postgresql.TIMESTAMP(),
               nullable=True)
    op.drop_column('engagement', 'project_metadata')
    op.drop_column('engagement', 'parent_id')
    op.alter_column('email_verification', 'type',
               existing_type=postgresql.ENUM('Survey', 'RejectedComment', 'Subscribe', name='emailverificationtype'),
               nullable=True)
    # ### end Alembic commands ###
