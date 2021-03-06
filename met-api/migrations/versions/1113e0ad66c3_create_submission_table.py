"""Create submission table

Revision ID: 1113e0ad66c3
Revises: fc570c0faace
Create Date: 2022-07-06 15:33:00.098038

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '1113e0ad66c3'
down_revision = 'fc570c0faace'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('submission',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('submission_json', postgresql.JSONB(astext_type=sa.Text()), server_default='{}', nullable=False),
    sa.Column('survey_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('created_date', sa.DateTime(), nullable=True),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['survey_id'], ['survey.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['user.id']),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('submission')
    # ### end Alembic commands ###
