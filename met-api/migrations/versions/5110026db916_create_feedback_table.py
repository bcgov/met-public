"""Create feedback table

Revision ID: 5110026db916
Revises: ba02399c821c
Create Date: 2022-10-03 12:35:55.742573

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5110026db916'
down_revision = 'ba02399c821c'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('feedback',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('created_date', sa.DateTime(), nullable=True),
        sa.Column('rating', sa.Enum('VerySatisfied', 'Satisfied', 'Neutral', 'Unsatisfied', 'VeryUnsatisfied', name='ratingtype'), nullable=False),
        sa.Column('comment_type', sa.Enum('Issue', 'Idea', 'Else', name='commenttype'), nullable=True),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('feedback')
