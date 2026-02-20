"""Added selected survey column to engagement, added relationship in survey model, modified engagement surveys.

Revision ID: 6b80c03ea472
Revises: 6261697b7a20
Create Date: 2026-02-11 18:05:03.488297

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6b80c03ea472'
down_revision = '6261697b7a20'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('engagement', sa.Column('selected_survey_id', sa.Integer(), nullable=True))
    op.create_foreign_key('engagement_selected_survey_fk', 'engagement', 'survey', ['selected_survey_id'], ['id'], ondelete='SET NULL')
    op.alter_column('survey', 'engagement_id',
               existing_type=sa.INTEGER(),
               nullable=False)

def downgrade():
    op.alter_column('survey', 'engagement_id',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.drop_constraint('engagement_selected_survey_fk', 'engagement', type_='foreignkey')
    op.drop_column('engagement', 'selected_survey_id')
