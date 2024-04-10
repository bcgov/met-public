"""Remove default taxon data from GDX tenant

Revision ID: e4d15a1af865
Revises: f8bc8ce202f3
Create Date: 2024-02-08 12:40:09.456210

"""
from alembic import op
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, DateTime, Boolean, Text
from datetime import datetime, timezone


# revision identifiers, used by Alembic.
revision = 'e4d15a1af865'
down_revision = 'f8bc8ce202f3'
branch_labels = None
depends_on = None

tenant_id = 1  # GDX tenant

# ad-hoc table definition for metadata taxa so we can manipulate its data
engagement_metadata_taxa_table = table(
    'engagement_metadata_taxa',
    column('id', Integer),
    column('tenant_id', Integer),
    column('name', String(64)),
    column('description', String(256)),
    column('freeform', Boolean),
    column('data_type', String(64)),
    column('default_value', Text),
    column('one_per_engagement', Boolean),
    column('position', Integer),
    column('created_date', DateTime),
    column('updated_date', DateTime),
    column('created_by', String(50)),
    column('updated_by', String(50)),
)


# Data to be removed (or inserted if downgrading)
taxa_data = [
    {
        'position': 0,
        'tenant_id': tenant_id,
        'name': 'keywords',
        'description': 'Keywords for categorizing the engagement',
        'freeform': True,
        'one_per_engagement': False,
        'data_type': 'text',
    },
    {
        'position': 1,
        'tenant_id': tenant_id,
        'name': 'description',
        'description': 'Description of the engagement',
        'freeform': True,
        'data_type': 'long_text',
        'one_per_engagement': True,
    },
    {
        'position': 2,
        'tenant_id': tenant_id,
        'name': 'jira_ticket_url',
        'description': 'URL of the Jira ticket for this engagement',
        'freeform': True,
        'data_type': 'text',
        'one_per_engagement': True,
    },
    {
        'position': 3,
        'tenant_id': tenant_id,
        'name': 'pmo_project_number',
        'description': 'PMO project number',
        'freeform': True,
        'data_type': 'text',
        'one_per_engagement': True,
    },
    {
        'position': 4,
        'tenant_id': tenant_id,
        'name': 'engagement_category',
        'description': 'Category of the engagement',
        'data_type': 'text',
        'freeform': False,
        'one_per_engagement': False,
    },
    {
        'position': 5,
        'tenant_id': tenant_id,
        'name': 'engagement_method',
        'description': 'Method of engagement',
        'data_type': 'text',
        'default_value': "Survey",
        'freeform': False,
        'one_per_engagement': False,
    },
    {
        'position': 6,
        'tenant_id': tenant_id,
        'name': 'language',
        'description': 'Language of the engagement',
        'data_type': 'text',
        'default_value': "English",
        'freeform': False,
        'one_per_engagement': False,
    },
    {
        'position': 7,
        'tenant_id': tenant_id,
        'name': 'ministry',
        'description': 'Ministry of the engagement',
        'freeform': False,
        'data_type': 'text',
        'one_per_engagement': True,
    },
]


def upgrade():
    for taxa in taxa_data:
        op.execute(
            engagement_metadata_taxa_table.delete().where(
                engagement_metadata_taxa_table.c.name == taxa['name']
            )
        )


def downgrade():
    for taxa in taxa_data:
        taxa['created_date'] = datetime.now(timezone.utc)
        taxa['updated_date'] = datetime.now(timezone.utc)

    # Perform bulk insert
    op.bulk_insert(engagement_metadata_taxa_table, taxa_data)
