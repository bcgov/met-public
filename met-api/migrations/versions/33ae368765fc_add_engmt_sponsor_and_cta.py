"""Add sponsor_name and cta_message to engagement and engagement_translation

Revision ID: 33ae368765fc
Revises: f0f7eadf3a40
Create Date: 2024-06-10 10:30:11.057813

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '33ae368765fc'
down_revision = 'f0f7eadf3a40'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('engagement', sa.Column('sponsor_name', sa.String(length=50), nullable=True))
    op.add_column('engagement', sa.Column('cta_message', sa.String(length=50), nullable=True))
    op.add_column('engagement', sa.Column('cta_url', sa.String(length=500), nullable=True))
    op.add_column('engagement_translation', sa.Column('sponsor_name', sa.String(length=50), nullable=True))
    op.add_column('engagement_translation', sa.Column('cta_message', sa.String(length=50), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('engagement_translation', 'cta_message')
    op.drop_column('engagement_translation', 'sponsor_name')
    op.drop_column('engagement', 'cta_url')
    op.drop_column('engagement', 'cta_message')
    op.drop_column('engagement', 'sponsor_name')
    # ### end Alembic commands ###
