"""Update value columns size

Revision ID: fe0a86c0d458
Revises: c03b11293c59
Create Date: 2022-08-29 14:09:01.479279

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'fe0a86c0d458'
down_revision = 'c03b11293c59'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('user_response_detail', 'engagement_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    op.alter_column('response_type_radio', 'value',
               existing_type=sa.String(1000),
               type_=sa.Text())

    op.alter_column('response_type_selectbox', 'value',
                existing_type=sa.String(1000),
                type_=sa.Text())

    op.alter_column('response_type_textarea', 'value',
                existing_type=sa.String(1000),
                type_=sa.Text())

    op.alter_column('response_type_textfield', 'value',
                    existing_type=sa.String(1000),
                    type_=sa.Text())

    op.alter_column('user_feedback', 'comment',
                    existing_type=sa.String(1000),
                    type_=sa.Text())


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('user_response_detail', 'engagement_id',
                    type_=sa.String(1000))

    op.alter_column('user_response_detail', 'engagement_id',
                    type_=sa.String(1000))

    op.alter_column('response_type_radio', 'value',
                    type_=sa.String(1000))

    op.alter_column('response_type_selectbox', 'value',
                    type_=sa.String(1000))

    op.alter_column('response_type_textarea', 'value',
                    type_=sa.String(1000))

    op.alter_column('response_type_textfield', 'value',
                    type_=sa.String(1000))

    op.alter_column('user_feedback', 'comment',
                    type_=sa.String(1000))
    # ### end Alembic commands ###
