"""Rework engagement metadata 

Revision ID: ec0128056a33
Revises: bd0eb0d25caf
Create Date: 2023-12-18 18:37:08.781433

"""
from enum import auto
from alembic import op
from regex import F
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from flask import current_app

from met_api.models.tenant import Tenant as TenantModel


# revision identifiers, used by Alembic.
revision = 'ec0128056a33'
down_revision = 'bd0eb0d25caf'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('engagement_metadata_taxa',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False, unique=True, autoincrement=True),
    sa.Column('tenant_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=64), nullable=True),
    sa.Column('description', sa.String(length=256), nullable=True),
    sa.Column('freeform', sa.Boolean(), nullable=False),
    sa.Column('data_type', sa.String(length=64), nullable=True),
    sa.Column('default_value', sa.Text(), nullable=True),
    sa.Column('one_per_engagement', sa.Boolean(), nullable=True),
    sa.Column('position', sa.Integer(), nullable=False),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['tenant_id'], ['tenant.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='pk_engagement_metadata_taxa'),
    sa.UniqueConstraint('id', name='uq_engagement_metadata_taxa_id')
    )
    # remove old primary key constraint from engagement_metadata.engagement_id
    op.drop_constraint('engagement_metadata_pkey', 'engagement_metadata', type_='primary')
    op.create_index(op.f('ix_engagement_metadata_taxa_position'), 'engagement_metadata_taxa', ['position'], unique=False)
    op.add_column('engagement_metadata', sa.Column('id', sa.Integer(), nullable=False))
    # add new primary key constraint on engagement_metadata.id
    op.create_primary_key('pk_engagement_metadata', 'engagement_metadata', ['id'])
    # add autoincrement to engagement_metadata.id by creating a sequence
    op.execute('CREATE SEQUENCE engagement_metadata_id_seq START 1')
    op.execute('ALTER TABLE engagement_metadata ALTER COLUMN id SET DEFAULT nextval(\'engagement_metadata_id_seq\')')
    op.execute('ALTER SEQUENCE engagement_metadata_id_seq OWNED BY engagement_metadata.id')
    # remove not-null constraint from engagement_metadata.engagement_id
    op.alter_column('engagement_metadata', 'engagement_id', existing_type=sa.INTEGER(), nullable=True)

    op.add_column('engagement_metadata', sa.Column('taxon_id', sa.Integer(), nullable=False))
    op.add_column('engagement_metadata', sa.Column('value', sa.Text(), nullable=False))
    op.create_foreign_key('fk_engagement_meta_taxon', 'engagement_metadata', 'engagement_metadata_taxa', ['taxon_id'], ['id'], ondelete='CASCADE')
    op.drop_column('engagement_metadata', 'project_tracking_id')
    # add default taxa for default tenant
    default_short_name = current_app.config.get('DEFAULT_TENANT_SHORT_NAME')
    tenant_id = TenantModel.find_by_short_name(default_short_name).id
    taxa = [
        {
            'name': 'keywords',
            'description': 'Keywords for categorizing the engagement',
            'freeform': True,
            'one_per_engagement': False,
            'data_type': 'text',
        },
        {
            'name': 'description',
            'description': 'Description of the engagement',
            'freeform': True,
            'data_type': 'long_text',
        },
        {
            'name': 'jira_ticket_url',
            'description': 'URL of the Jira ticket for this engagement',
            'freeform': True,
            'data_type': 'text',
        },
        {
            'name': 'pmo_project_number',
            'description': 'PMO project number',
            'freeform': True,
            'data_type': 'text',
        },
        {
            'name': 'engagement_category',
            'description': 'Category of the engagement',
            'data_type': 'text',
            'one_per_engagement': False,
        },
        {
            'name': 'engagement_method',
            'description': 'Method of engagement',
            'data_type': 'text',
            'default_value': "Survey",
            'one_per_engagement': False,
        },
        {
            'name': 'language',
            'description': 'Language of the engagement',
            'data_type': 'text',
            'default_value': "English",
            'one_per_engagement': False,
        },
        {
            'name': 'ministry',
            'description': 'Ministry of the engagement',
            'data_type': 'text',
        }
    ]
    for index, taxon in enumerate(taxa):
        op.execute(
            sa.text('INSERT INTO engagement_metadata_taxa (tenant_id, name, description, freeform, data_type, default_value, one_per_engagement, position, created_date, updated_date) '
                    'VALUES (:tenant_id, :name, :description, :freeform, :data_type, :default_value, :one_per_engagement, :position, now(), now())')
            .params(
                tenant_id=tenant_id,
                name=taxon['name'],
                description=taxon['description'],
                freeform=taxon.get('freeform', False),
                data_type=taxon['data_type'],
                default_value=taxon.get('default_value'),
                one_per_engagement=taxon.get('one_per_engagement', True),
                position=index + 1,
            )
        )

    # ### end Alembic commands ###


def downgrade():
    op.add_column('engagement_metadata', sa.Column('project_tracking_id', sa.VARCHAR(length=100), autoincrement=False, nullable=True))
    op.alter_column('engagement_metadata', 'engagement_id', existing_type=sa.INTEGER(), nullable=False)
    op.drop_constraint('fk_engagement_meta_taxon', 'engagement_metadata', type_='foreignkey')
    op.drop_column('engagement_metadata', 'value')
    op.drop_column('engagement_metadata', 'taxon_id')
    # remove primary key constraint from engagement_metadata.id
    op.drop_constraint('pk_engagement_metadata', 'engagement_metadata', type_='primary')
    op.drop_column('engagement_metadata', 'id')
    op.drop_index(op.f('ix_engagement_metadata_taxa_position'), table_name='engagement_metadata_taxa')
    # add primary key constraint to engagement_metadata.engagement_id
    op.create_primary_key('pk_engagement_metadata', 'engagement_metadata', ['engagement_id'])
    op.drop_table('engagement_metadata_taxa')
    # ### end Alembic commands ###
