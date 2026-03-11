"""Add subscribe section fields to engagement.

Revision ID: 1d3f0c9e7a21
Revises: 45a555233a81
Create Date: 2026-03-10 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = '1d3f0c9e7a21'
down_revision = '45a555233a81'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('engagement', sa.Column('subscribe_section_header', sa.String(length=60), nullable=True))
    op.add_column(
        'engagement',
        sa.Column('subscribe_section_description', postgresql.JSON(astext_type=sa.Text()), nullable=True),
    )
    op.add_column(
        'engagement',
        sa.Column('subscribe_consent_message', postgresql.JSON(astext_type=sa.Text()), nullable=True),
    )

    op.execute(
        sa.text(
            """
            UPDATE engagement
            SET subscribe_consent_message = consent_message
            WHERE subscribe_consent_message IS NULL
              AND consent_message IS NOT NULL
            """
        )
    )


def downgrade():
    op.drop_column('engagement', 'subscribe_consent_message')
    op.drop_column('engagement', 'subscribe_section_description')
    op.drop_column('engagement', 'subscribe_section_header')
