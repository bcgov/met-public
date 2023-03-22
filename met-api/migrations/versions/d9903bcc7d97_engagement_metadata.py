"""engagement metadata

Revision ID: d9903bcc7d97
Revises: 5423fd515e04
Create Date: 2023-03-22 08:50:47.710761

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'd9903bcc7d97'
down_revision = '5423fd515e04'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('engagement', sa.Column('parent_id', sa.String(length=50), nullable=True))
    op.add_column('engagement', sa.Column('project_metadata', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('engagement', 'project_metadata')
    op.drop_column('engagement', 'parent_id')
    # ### end Alembic commands ###
