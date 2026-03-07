"""Remove cascade delete from eng to survey and widget to widget type.

Revision ID: 45a555233a81
Revises: 6b80c03ea472
Create Date: 2026-03-04 16:30:22.520315

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '45a555233a81'
down_revision = '6b80c03ea472'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_constraint('survey_engagement_id_fkey', 'survey', type_='foreignkey')
    op.create_foreign_key(
        'survey_engagement_id_fkey',
        'survey',
        'engagement',
        ['engagement_id'],
        ['id'],
        ondelete='SET NULL'
    )

    op.drop_constraint('widget_widget_type_id_fkey', 'widget', type_='foreignkey')
    op.create_foreign_key(
        'widget_widget_type_id_fkey',
        'widget',
        'widget_type',
        ['widget_type_id'],
        ['id'],
        ondelete='RESTRICT'
    )


def downgrade():
    op.drop_constraint('survey_engagement_id_fkey', 'survey', type_='foreignkey')
    op.create_foreign_key(
        'survey_engagement_id_fkey',
        'survey',
        'engagement',
        ['engagement_id'],
        ['id'],
        ondelete='CASCADE'
    )

    op.drop_constraint('widget_widget_type_id_fkey', 'widget', type_='foreignkey')
    op.create_foreign_key(
        'widget_widget_type_id_fkey',
        'widget',
        'widget_type',
        ['widget_type_id'],
        ['id'],
        ondelete='CASCADE'
    )
