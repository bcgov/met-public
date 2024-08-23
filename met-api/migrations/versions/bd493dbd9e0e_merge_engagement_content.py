"""Merge the engagement_summary_content and engagement_custom_content tables into the engagement_content table

Revision ID: bd493dbd9e0e
Revises: 901a6724bca2
Create Date: 2024-08-21 10:06:44.377763

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from sqlalchemy.sql import table, column
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'bd493dbd9e0e'
down_revision = '901a6724bca2'
branch_labels = None
depends_on = None


def upgrade():
    # Create new columns in the engagement_content table
    op.add_column('engagement_content', sa.Column('text_content', sa.Text(), nullable=True))
    op.add_column('engagement_content', sa.Column('json_content', sa.JSON(), nullable=True))

    # Reference the existing tables

    engagement_content = table('engagement_content',
        column('id', sa.Integer),
        column('text_content', sa.Text),
        column('json_content', sa.JSON)
    )

    engagement_summary_content = table('engagement_summary_content',
        column('engagement_content_id', sa.Integer),
        column('content', sa.Text),
        column('rich_content', sa.JSON)
    )

    engagement_custom_content = table('engagement_custom_content',
        column('engagement_content_id', sa.Integer),
        column('custom_text_content', sa.Text),
        column('custom_json_content', sa.JSON)
    )

    # Copy data from the old tables to the new columns in engagement_content
    op.execute(
        engagement_content.update()
        .where(engagement_content.c.id == engagement_summary_content.c.engagement_content_id)
        .values({
            'text_content': engagement_summary_content.c.content,
            'json_content': engagement_summary_content.c.rich_content
        })
    )

    op.execute(
        engagement_content.update()
        .where(engagement_content.c.id == engagement_custom_content.c.engagement_content_id)
        .values({
            'text_content': engagement_custom_content.c.custom_text_content,
            'json_content': engagement_custom_content.c.custom_json_content
        })
    )

    # Drop old tables
    op.drop_table('engagement_custom_content')
    op.drop_table('engagement_summary_content')

    # Drop the content_type column and icon name as they're no longer needed
    op.drop_column('engagement_content', 'content_type')
    op.drop_column('engagement_content', 'icon_name')


def downgrade():
    # Recreate the old tables
    op.create_table('engagement_summary_content',
    sa.Column('created_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('updated_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('content', sa.TEXT(), autoincrement=False, nullable=False),
    sa.Column('rich_content', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=False),
    sa.Column('engagement_content_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('engagement_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_by', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('updated_by', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['engagement_content_id'], ['engagement_content.id'], name='engagement_summary_content_engagement_content_id_fkey', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['engagement_id'], ['engagement.id'], name='engagement_summary_content_engagement_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='engagement_summary_content_pkey')
    )
    
    op.create_table('engagement_custom_content',
    sa.Column('created_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('updated_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('custom_text_content', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('custom_json_content', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=True),
    sa.Column('engagement_content_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('engagement_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('created_by', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('updated_by', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['engagement_content_id'], ['engagement_content.id'], name='engagement_custom_content_engagement_content_id_fkey', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['engagement_id'], ['engagement.id'], name='engagement_custom_content_engagement_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='engagement_custom_content_pkey')
    )

    # Drop new columns in engagement_content table
    op.drop_column('engagement_content', 'json_content')
    op.drop_column('engagement_content', 'text_content')

    # Re-add the content_type and icon_name columns
    op.add_column('engagement_content', sa.Column('icon_name', sa.Text(), autoincrement=False, nullable=True))
    op.add_column('engagement_content', sa.Column('content_type', postgresql.ENUM('Summary', 'Custom', name='engagementcontenttype'), autoincrement=False))
