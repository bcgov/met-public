"""
Add the list of supported languages and create a table to map them to tenants when selected.

Revision ID: c656f3f82334
Revises: 22fb6b5b5aed
Create Date: 2024-05-28 15:45:56.151488

"""
from alembic import op
import sqlalchemy as sa
import json


# revision identifiers, used by Alembic.
revision = 'c656f3f82334'
down_revision = '22fb6b5b5aed'
branch_labels = None
depends_on = None

with open("migrations/supported_languages.json", "r") as read_file:
    data = json.load(read_file)

def upgrade():
    for index, value in enumerate(data):
        op.execute("INSERT INTO language (created_date, updated_date, id, name, code) VALUES ('{0}', '{0}', '{1}', '{2}', '{3}')".format(sa.func.now(), index, value['language'], value['iso_code']))
    op.create_table('language_tenant_mapping',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('language_id', sa.Integer(), nullable=True),
    sa.Column('tenant_id', sa.Integer(), nullable=True),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['language_id'], ['language.id']),
    sa.ForeignKeyConstraint(['tenant_id'], ['tenant.id']),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('language_id', 'tenant_id')
    )

def downgrade():
    op.execute("DELETE FROM language")
    op.drop_table('language_tenant_mapping')