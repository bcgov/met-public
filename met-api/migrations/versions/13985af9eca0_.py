"""

Revision ID: 13985af9eca0
Revises: 21e24b92c7b4
Create Date: 2023-05-17 09:51:00.350393

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '13985af9eca0'
down_revision = '21e24b92c7b4'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('tenant', sa.Column('title', sa.String(length=30), nullable=False, server_default="Modern Engagement"))
    op.add_column('tenant', sa.Column('logo_url', sa.String(length=300), nullable=True))
    op.alter_column('tenant', 'description',
               existing_type=sa.String(100),
               type_=sa.String(300))
    op.execute('UPDATE tenant SET description = \'British Columbia\'\'s environmental assessment process provides opportunities for Indigenous Nations, government agencies and the public to influence the outcome of environmental assessments in British Columbia.\' WHERE short_name = \'EAO\';')


def downgrade():
    op.drop_column('tenant', 'logo_url')
    op.drop_column('tenant', 'title')
