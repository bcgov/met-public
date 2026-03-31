"""Add edit_languages to admin group

Revision ID: 82ca95b4b7c1
Revises: c5dc2bb998ea
Create Date: 2024-06-16 14:08:26.743948

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '82ca95b4b7c1'
down_revision = 'c5dc2bb998ea'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("INSERT INTO user_role (created_date, updated_date, id, name, description) VALUES ('{0}', '{0}', 40, 'edit_languages', 'Role to edit tenant languages.')".format(sa.func.now()))
    op.execute("INSERT INTO group_role_mapping (created_date, updated_date, id, role_id, group_id) VALUES ('{0}', '{0}', 62, 40, 1)".format(sa.func.now()))


def downgrade():
    op.execute("DELETE FROM group_role_mapping WHERE id = 62")
    op.execute("DELETE FROM user_role WHERE id = 40")
