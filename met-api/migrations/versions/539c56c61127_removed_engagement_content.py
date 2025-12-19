"""Removed engagement_content and engagement_content_translation, added engagement_details_tab_translations.

Revision ID: 539c56c61127
Revises: b3b8faea29c8
Create Date: 2025-12-16 16:36:34.206764

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '539c56c61127'
down_revision = 'b3b8faea29c8'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('engagement_details_tab_translations',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('language_id', sa.Integer(), nullable=False),
    sa.Column('engagement_details_tab_id', sa.Integer(), nullable=False),
    sa.Column('label', sa.String(length=20), nullable=False),
    sa.Column('slug', sa.String(length=20), nullable=False),
    sa.Column('heading', sa.String(length=60), nullable=False),
    sa.Column('body', sa.Text(), nullable=False),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['engagement_details_tab_id'], ['engagement_details_tabs.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['language_id'], ['language.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('engagement_details_tab_id', 'language_id', name='_engagement_details_tab_language_uc')
    )

    op.drop_table('engagement_content_translation')
    op.drop_table('engagement_content')

def downgrade():
    op.create_table('engagement_content',
    sa.Column('created_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('updated_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('title', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('engagement_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('sort_index', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('is_internal', sa.BOOLEAN(), autoincrement=False, nullable=False),
    sa.Column('created_by', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('updated_by', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('text_content', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('json_content', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['engagement_id'], ['engagement.id'], name='engagement_content_engagement_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='engagement_content_pkey')
    )
    op.create_table('engagement_content_translation',
    sa.Column('created_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('updated_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('language_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('engagement_content_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('content_title', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('custom_text_content', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('custom_json_content', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=True),
    sa.Column('created_by', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('updated_by', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['engagement_content_id'], ['engagement_content.id'], name='engagement_content_translation_engagement_content_id_fkey', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['language_id'], ['language.id'], name='engagement_content_translation_language_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='engagement_content_translation_pkey'),
    sa.UniqueConstraint('engagement_content_id', 'language_id', name='_engagement_content_language_uc')
    )
    op.drop_table('engagement_details_tab_translations')
