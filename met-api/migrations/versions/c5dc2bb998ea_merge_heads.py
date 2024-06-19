"""
Merge alembic revisions that:
- Add sponsor_name and cta_message to engagement and engagement_translation
- Add the list of supported languages and create a table to map them to tenants when selected

Revision ID: c5dc2bb998ea
Revises: 33ae368765fc, c656f3f82334
Create Date: 2024-06-16 13:40:10.729948

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c5dc2bb998ea'
down_revision = ('33ae368765fc', 'c656f3f82334')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
