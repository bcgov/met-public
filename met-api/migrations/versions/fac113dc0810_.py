"""empty message

Revision ID: fac113dc0810
Revises: 6764af39864e
Create Date: 2022-12-27 11:50:50.236802

"""
from datetime import datetime
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fac113dc0810'
down_revision = '6764af39864e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    document_type = op.create_table('generated_document_type',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=30), nullable=False),
    sa.Column('description', sa.String(length=100), nullable=True),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('modified_by_id', sa.String(length=50), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    document_template = op.create_table('generated_document_template',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('type_id', sa.Integer(), nullable=False),
    sa.Column('cdogs_hash_code', sa.String(length=64), nullable=True),
    sa.Column('extension', sa.String(length=10), nullable=False),
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('modified_by_id', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['type_id'], ['generated_document_type.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('cdogs_hash_code')
    )
    op.drop_index('ix_user_username', table_name='met_users')
    op.create_index(op.f('ix_met_users_username'), 'met_users', ['username'], unique=False)
    
    op.bulk_insert(document_type, [
        {'id': 1, 'name': 'comment_sheet', 'description': 'Comments export for staff', "created_date": datetime.utcnow()}
    ])
    
    op.bulk_insert(document_template, [
        {'id': 1, 'type_id': 1, 'cdogs_hash_code': None, "extension": "xlsx", "created_date": datetime.utcnow()}
    ])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_met_users_username'), table_name='met_users')
    op.create_index('ix_user_username', 'met_users', ['username'], unique=False)
    op.drop_table('document_template')
    op.drop_table('document_type')
    # ### end Alembic commands ###
