"""add encrypted_email

Revision ID: 36c315ec5801
Revises: 196b0abc23b6
Create Date: 2023-05-30 16:21:19.298002

"""
from alembic import op
import sqlalchemy as sa
import sqlalchemy_utils

# revision identifiers, used by Alembic.
revision = '36c315ec5801'
down_revision = '196b0abc23b6'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_constraint('membership_user_id_fkey', 'membership', type_='foreignkey')
    op.drop_index('ix_met_users_username', table_name='met_users')
    op.drop_constraint('user_external_id_key', 'met_users', type_='unique')
    op.drop_constraint('user_status_fk', 'met_users', type_='foreignkey')

    op.create_table('staff_users',
        sa.Column('created_date', sa.DateTime(), nullable=False),
        sa.Column('updated_date', sa.DateTime(), nullable=True),
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('first_name', sa.String(length=50), nullable=True),
        sa.Column('middle_name', sa.String(length=50), nullable=True),
        sa.Column('last_name', sa.String(length=50), nullable=True),
        sa.Column('username', sa.String(length=100), nullable=True),
        sa.Column('email_address', sa.String(length=100), nullable=True),
        sa.Column('contact_number', sa.String(length=50), nullable=True),
        sa.Column('external_id', sa.String(length=50), nullable=False),
        sa.Column('status_id', sa.Integer(), nullable=True),
        sa.Column('tenant_id', sa.Integer(), nullable=True),
        sa.Column('created_by', sa.String(length=50), nullable=True),
        sa.Column('updated_by', sa.String(length=50), nullable=True),
        sa.ForeignKeyConstraint(['status_id'], ['user_status.id'], ),
        sa.ForeignKeyConstraint(['tenant_id'], ['tenant.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('external_id')
    )
    op.execute('INSERT INTO staff_users \
        (id, created_date, updated_date, first_name, middle_name, last_name, username, contact_number, \
        external_id, status_id, tenant_id, created_by, updated_by) SELECT id, \
        created_date, updated_date, first_name, middle_name, last_name, username, contact_number,\
        external_id, status_id, tenant_id, created_by, updated_by FROM met_users WHERE username IS NOT NULL OR id = 1;')
    op.execute('DELETE FROM met_users WHERE id = 1;')
    op.execute('DELETE FROM met_users WHERE username is not null;')
    op.execute('SELECT setval(\'staff_users_id_seq\', (SELECT MAX(id) + 1 FROM staff_users), true);')
    op.create_index(op.f('ix_staff_users_username'), 'staff_users', ['username'], unique=True)
    op.create_foreign_key('membership_user_id_fkey', 'membership', 'staff_users', ['user_id'], ['id'])

    op.drop_column('met_users', 'last_name')
    op.drop_column('met_users', 'access_type')
    op.drop_column('met_users', 'username')
    op.drop_column('met_users', 'middle_name')
    op.drop_column('met_users', 'first_name')
    op.drop_column('met_users', 'contact_number')
    op.drop_column('met_users', 'status_id')
    op.drop_column('met_users', 'external_id')
    op.drop_column('met_users', 'email_id')
    op.add_column('met_users', sa.Column('email_address', sqlalchemy_utils.types.encrypted.encrypted_type.StringEncryptedType(), nullable=True))


def downgrade():
    op.drop_column('met_users', 'email_address')
    op.add_column('met_users', sa.Column('email_id', sa.VARCHAR(length=200), autoincrement=False, nullable=True))
    op.add_column('met_users', sa.Column('external_id', sa.VARCHAR(length=50), autoincrement=False, nullable=True))
    op.add_column('met_users', sa.Column('status_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('met_users', sa.Column('contact_number', sa.VARCHAR(length=50), autoincrement=False, nullable=True))
    op.add_column('met_users', sa.Column('first_name', sa.VARCHAR(length=50), autoincrement=False, nullable=True))
    op.add_column('met_users', sa.Column('middle_name', sa.VARCHAR(length=50), autoincrement=False, nullable=True))
    op.add_column('met_users', sa.Column('username', sa.VARCHAR(length=100), autoincrement=False, nullable=True))
    op.add_column('met_users', sa.Column('access_type', sa.VARCHAR(length=200), autoincrement=False, nullable=True))
    op.add_column('met_users', sa.Column('last_name', sa.VARCHAR(length=50), autoincrement=False, nullable=True))
    op.create_foreign_key('met_users_tenant_fk', 'met_users', 'tenant', ['tenant_id'], ['id'])
    op.create_foreign_key('user_status_fk', 'met_users', 'user_status', ['status_id'], ['id'])
    op.create_unique_constraint('user_external_id_key', 'met_users', ['external_id'])
    op.create_index('ix_met_users_username', 'met_users', ['username'], unique=False)
    op.drop_constraint('membership_user_id_fkey', 'membership', type_='foreignkey')
    op.create_foreign_key('membership_user_id_fkey', 'membership', 'met_users', ['user_id'], ['id'])
    op.drop_index(op.f('ix_staff_users_username'), table_name='staff_users')
    op.drop_table('staff_users')
