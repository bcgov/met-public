"""Add participant table

Revision ID: 8def759e43d9
Revises: 36c315ec5801
Create Date: 2023-06-01 15:48:05.428175

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import sqlalchemy_utils

# revision identifiers, used by Alembic.
revision = '8def759e43d9'
down_revision = '36c315ec5801'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('participant',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.Column('email_address', sqlalchemy_utils.types.encrypted.encrypted_type.StringEncryptedType(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )

    op.execute('INSERT INTO participant (id, email_address, created_date, updated_date, created_by, updated_by) \
            SELECT id, email_address, created_date, updated_date, created_by, updated_by FROM met_users;')

    op.create_index(op.f('ix_participant_email_address'), 'participant', ['email_address'], unique=False)
    op.add_column('comment', sa.Column('participant_id', sa.Integer(), nullable=True))
    op.create_foreign_key('comment_participant_id_fkey', 'comment', 'participant', ['participant_id'], ['id'], ondelete='SET NULL')
    op.drop_constraint('comment_user_id_fkey', 'comment', type_='foreignkey')
    op.execute('UPDATE comment SET participant_id = user_id')
    op.drop_column('comment', 'user_id')

    op.add_column('email_verification', sa.Column('participant_id', sa.Integer(), nullable=True))
    op.create_foreign_key('email_verification_participant_id_fkey', 'email_verification', 'participant', ['participant_id'], ['id'])
    op.drop_constraint('email_verification_user_id_fkey', 'email_verification', type_='foreignkey')
    op.execute('UPDATE email_verification SET participant_id = user_id')
    op.drop_column('email_verification', 'user_id')

    op.add_column('submission', sa.Column('participant_id', sa.Integer(), nullable=True))
    op.drop_constraint('submission_user_id_fkey', 'submission', type_='foreignkey')
    op.create_foreign_key('submission_participant_id_fkey', 'submission', 'participant', ['participant_id'], ['id'])
    op.execute('UPDATE submission SET participant_id = user_id')
    op.drop_column('submission', 'user_id')

    op.add_column('subscription', sa.Column('participant_id', sa.Integer(), nullable=True))
    op.drop_constraint('subscription_user_id_fkey', 'subscription', type_='foreignkey')
    op.create_foreign_key('subscription_participant_id_fkey', 'subscription', 'participant', ['participant_id'], ['id'])
    op.execute('UPDATE subscription SET participant_id = user_id')
    op.drop_column('subscription', 'user_id')

    op.execute('SELECT setval(\'participant_id_seq\', (SELECT MAX(id) + 1 FROM participant), true);')
    op.drop_table('met_users')


def downgrade():
    op.create_table('met_users',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('created_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('updated_date', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('created_by', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('updated_by', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('tenant_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('email_address', sa.VARCHAR(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['tenant_id'], ['tenant.id'], name='met_users_tenant_fk'),
    sa.PrimaryKeyConstraint('id', name='user_pkey')
    )

    op.execute('INSERT INTO met_users (id, email_address, created_date, updated_date, created_by, updated_by) \
        SELECT id, email_address, created_date, updated_date, created_by, updated_by FROM participant;')

    op.add_column('submission', sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint('submission_participant_id_fkey', 'submission', type_='foreignkey')
    op.create_foreign_key('submission_user_id_fkey', 'submission', 'met_users', ['user_id'], ['id'])
    op.drop_column('submission', 'participant_id')
    op.add_column('email_verification', sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint('email_verification_participant_id_fkey', 'email_verification', type_='foreignkey')
    op.create_foreign_key('email_verification_user_id_fkey', 'email_verification', 'met_users', ['user_id'], ['id'])
    op.drop_column('email_verification', 'participant_id')
    op.add_column('comment', sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint('comment_participant_id_fkey', 'comment', type_='foreignkey')
    op.create_foreign_key('comment_user_id_fkey', 'comment', 'met_users', ['user_id'], ['id'], ondelete='SET NULL')
    op.drop_column('comment', 'participant_id')
    op.drop_index(op.f('ix_participant_email_address'), table_name='participant')
    op.drop_table('participant')
