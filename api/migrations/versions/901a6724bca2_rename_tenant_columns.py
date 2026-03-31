"""rename tenant columns to properly describe their purpose

Revision ID: 901a6724bca2
Revises: 82ca95b4b7c1
Create Date: 2024-06-27 10:48:40.838126

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '901a6724bca2'
down_revision = '82ca95b4b7c1'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('tenant', 'logo_url', new_column_name='hero_image_url')
    op.alter_column('tenant', 'logo_credit', new_column_name='hero_image_credit')
    op.alter_column('tenant', 'logo_description', new_column_name='hero_image_description')


def downgrade():
    op.alter_column('tenant', 'hero_image_url', new_column_name='logo_url')
    op.alter_column('tenant', 'hero_image_credit', new_column_name='logo_credit')
    op.alter_column('tenant', 'hero_image_description', new_column_name='logo_description')
