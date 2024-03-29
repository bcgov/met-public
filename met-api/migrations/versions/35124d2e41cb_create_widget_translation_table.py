"""create_widget_translation_table

Revision ID: 35124d2e41cb
Revises: 274a2774607b
Create Date: 2024-03-05 16:43:50.911576

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '35124d2e41cb'
down_revision = '274a2774607b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('widget_translation',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('widget_id', sa.Integer(), nullable=False),
    sa.Column('language_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=100), nullable=True, comment='Custom title for the widget.'),
    sa.Column('map_marker_label', sa.String(length=30), nullable=True),
    sa.Column('map_file_name', sa.Text(), nullable=True),
    sa.Column('poll_title', sa.String(length=255), nullable=True),
    sa.Column('poll_description', sa.String(length=2048), nullable=True),
    sa.Column('video_url', sa.String(length=255), nullable=True),
    sa.Column('video_description', sa.Text(), nullable=True),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['language_id'], ['language.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['widget_id'], ['widget.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('widget_id', 'language_id', name='unique_widget_language')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('widget_translation')
    # ### end Alembic commands ###
