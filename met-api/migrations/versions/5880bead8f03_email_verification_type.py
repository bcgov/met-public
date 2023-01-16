"""Email verification type

Revision ID: 5880bead8f03
Revises: 242c9f0364df
Create Date: 2023-01-16 14:34:48.541883

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5880bead8f03'
down_revision = '242c9f0364df'
branch_labels = None
depends_on = None


def upgrade():
    op.execute('CREATE TYPE emailverificationtype AS ENUM (\'Survey\', \'RejectedComment\', \'Subscribe\');')    
    op.add_column('email_verification', sa.Column('type', sa.Enum('Survey', 'RejectedComment', 'Subscribe', name='emailverificationtype'), nullable=True))
    op.execute('UPDATE email_verification SET type = \'RejectedComment\' WHERE submission_id IS NOT NULL;')    
    op.execute('UPDATE email_verification SET type = \'Survey\' WHERE type IS NULL;')    
    op.alter_column('email_verification', sa.Column('type', sa.Enum('Survey', 'RejectedComment', 'Subscribe', name='emailverificationtype'), nullable=False))



def downgrade():
    op.drop_column('email_verification', 'type')
