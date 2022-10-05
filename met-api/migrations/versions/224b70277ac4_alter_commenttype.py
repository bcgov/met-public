"""alter commenttype

Revision ID: 224b70277ac4
Revises: 5110026db916
Create Date: 2022-10-05 11:00:13.349968

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '224b70277ac4'
down_revision = '5110026db916'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('feedback', 'comment_type', type_=sa.Text())
    op.execute('DROP TYPE public.commenttype;')
    op.execute('CREATE TYPE public.commenttype AS ENUM (\'Issue\', \'Idea\', \'Else\', \'NONE\');')    
    op.alter_column('feedback', 'comment_type', type_=sa.Enum('Issue', 'Idea', 'Else', 'NONE', name='commenttype'), postgresql_using='comment_type::commenttype')


def downgrade():
    # alter type will not be reverted since it does not impact the structure.
    pass
