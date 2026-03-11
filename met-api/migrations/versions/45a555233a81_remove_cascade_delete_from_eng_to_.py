"""Remove cascade delete from eng to survey and widget to widget type.

Revision ID: 45a555233a81
Revises: f4a8b2e91c30
Create Date: 2026-03-04 16:30:22.520315

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '45a555233a81'
down_revision = 'f4a8b2e91c30'
branch_labels = None
depends_on = None


def upgrade():
    _drop_matching_foreign_keys('survey', 'engagement_id', 'engagement')
    op.create_foreign_key(
        'survey_engagement_id_fkey',
        'survey',
        'engagement',
        ['engagement_id'],
        ['id'],
        ondelete='SET NULL'
    )

    _drop_matching_foreign_keys('widget', 'widget_type_id', 'widget_type')
    op.create_foreign_key(
        'widget_widget_type_id_fkey',
        'widget',
        'widget_type',
        ['widget_type_id'],
        ['id'],
        ondelete='RESTRICT'
    )


def downgrade():
    _drop_matching_foreign_keys('survey', 'engagement_id', 'engagement')
    op.create_foreign_key(
        'survey_engagement_id_fkey',
        'survey',
        'engagement',
        ['engagement_id'],
        ['id'],
        ondelete='CASCADE'
    )

    _drop_matching_foreign_keys('widget', 'widget_type_id', 'widget_type')
    op.create_foreign_key(
        'widget_widget_type_id_fkey',
        'widget',
        'widget_type',
        ['widget_type_id'],
        ['id'],
        ondelete='CASCADE'
    )


def _drop_matching_foreign_keys(table_name, local_column, referred_table):
    """Drop FK constraints for a specific local column and referenced table."""
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    foreign_keys = inspector.get_foreign_keys(table_name)

    for foreign_key in foreign_keys:
        name = foreign_key.get('name')
        constrained_columns = foreign_key.get('constrained_columns') or []
        current_referred_table = foreign_key.get('referred_table')

        if (
            name
            and local_column in constrained_columns
            and current_referred_table == referred_table
        ):
            op.drop_constraint(name, table_name, type_='foreignkey')
