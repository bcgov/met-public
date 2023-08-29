"""kc attribute script

Revision ID: f037908194df
Revises: 04e6c48187da
Create Date: 2023-08-27 22:50:02.047232

"""
from typing import List

from alembic import op
import sqlalchemy as sa

from met_api.models import StaffUser
from met_api.services.participant_service import KEYCLOAK_SERVICE

# revision identifiers, used by Alembic.
revision = 'f037908194df'
down_revision = '04e6c48187da'
branch_labels = None
depends_on = None


def upgrade():
    default_tenant_id = 1
    conn = op.get_bind()

    user_res = conn.execute("SELECT * FROM staff_users WHERE external_id IS NOT NULL;")
    user_list: List[StaffUser] = user_res.fetchall()
    for user in user_list:
        try:
            print(f'Processing profile for {user.first_name} {user.last_name}',)
            KEYCLOAK_SERVICE.add_attribute_to_user(user_id=user.external_id, attribute_value=default_tenant_id)
        except Exception as exc:
            print('Profile Error for', user.first_name)
            print(exc)


def downgrade():
    pass
