"""event_subscribe_poll_timeline_widget_translation

Revision ID: f3842579261c
Revises: 274a2774607b
Create Date: 2024-03-08 10:59:03.021386

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f3842579261c'
down_revision = 'c4f7189494ed'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('event_item_translation',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('language_id', sa.Integer(), nullable=False),
    sa.Column('event_item_id', sa.Integer(), nullable=False),
    sa.Column('description', sa.String(length=500), nullable=True),
    sa.Column('location_name', sa.String(length=50), nullable=True),
    sa.Column('location_address', sa.String(length=100), nullable=True, comment='The address of the location'),
    sa.Column('url', sa.String(length=500), nullable=True),
    sa.Column('url_label', sa.String(length=100), nullable=True, comment='Label to show for href links'),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['event_item_id'], ['event_item.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['language_id'], ['language.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('event_item_id', 'language_id', name='_event_item_language_uc')
    )
    op.create_table('poll_answer_translation',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('poll_answer_id', sa.Integer(), nullable=False),
    sa.Column('language_id', sa.Integer(), nullable=False),
    sa.Column('answer_text', sa.String(length=255), nullable=False),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['language_id'], ['language.id'], ),
    sa.ForeignKeyConstraint(['poll_answer_id'], ['poll_answers.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('poll_answer_id', 'language_id', name='_poll_answer_language_uc')
    )
    op.create_table('subscribe_item_translation',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('language_id', sa.Integer(), nullable=False),
    sa.Column('subscribe_item_id', sa.Integer(), nullable=False),
    sa.Column('description', sa.String(length=500), nullable=True),
    sa.Column('rich_description', sa.Text(), nullable=True),
    sa.Column('call_to_action_text', sa.String(length=25), nullable=True),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['language_id'], ['language.id'], ),
    sa.ForeignKeyConstraint(['subscribe_item_id'], ['subscribe_item.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('subscribe_item_id', 'language_id', name='_subscribe_item_language_uc')
    )
    op.create_table('timeline_event_translation',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('language_id', sa.Integer(), nullable=False),
    sa.Column('timeline_event_id', sa.Integer(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('time', sa.String(length=255), nullable=True),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['language_id'], ['language.id'], ),
    sa.ForeignKeyConstraint(['timeline_event_id'], ['timeline_event.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('timeline_event_id', 'language_id', name='_timeline_event_language_uc')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('timeline_event_translation')
    op.drop_table('subscribe_item_translation')
    op.drop_table('poll_answer_translation')
    op.drop_table('event_item_translation')
    # ### end Alembic commands ###
