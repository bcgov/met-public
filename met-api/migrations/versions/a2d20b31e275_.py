"""empty message

Revision ID: a2d20b31e275
Revises: 
Create Date: 2022-05-06 11:21:08.457737

"""
from alembic import op
import sqlalchemy as sa
from datetime import datetime

# revision identifiers, used by Alembic.
revision = 'a2d20b31e275'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    user_table = op.create_table('user',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('first_name', sa.String(length=50), nullable=True),
    sa.Column('middle_name', sa.String(length=50), nullable=True),
    sa.Column('last_name', sa.String(length=50), nullable=True),
    sa.Column('email_id', sa.String(length=50), nullable=True),
    sa.Column('contact_number', sa.String(length=50), nullable=True),
    sa.Column('created_date', sa.DateTime(), nullable=True),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    
    op.create_table('engagement',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(length=50), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('start_date', sa.DateTime(), nullable=True),
    sa.Column('end_date', sa.DateTime(), nullable=True),
    sa.Column('status_id', sa.Integer(), nullable=True),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('created_date', sa.DateTime(), nullable=True),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('published_date', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    
    engagement_status_table = op.create_table('engagement_status',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('status_name', sa.String(length=50), nullable=True),
    sa.Column('description', sa.String(length=50), nullable=True),
    sa.Column('created_date', sa.DateTime(), nullable=True),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    
    op.bulk_insert(engagement_status_table, [
        {'id': 1, 'status_name': 'draft', 'description': 'Test Description', 'created_date': datetime.utcnow(), 'updated_date': datetime.utcnow()}
    ])
    
    op.bulk_insert(user_table, [
        {'id': 1, 'first_name': 'A', 'middle_name': 'B', 'last_name': 'C', 'email_id': 1, 'contact_number': 1, 'created_date': datetime.utcnow(), 'updated_date': datetime.utcnow()}
    ])
    
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('engagement_status')
    op.drop_table('engagement')
    op.drop_table('user')
    # ### end Alembic commands ###
