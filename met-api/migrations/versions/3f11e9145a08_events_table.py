"""events_table

Revision ID: 3f11e9145a08
Revises: 2253a00e73bf
Create Date: 2023-02-12 16:48:14.120190

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '3f11e9145a08'
down_revision = '2253a00e73bf'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('widget_events',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('title', sa.String(length=50), nullable=True),
    sa.Column('type', sa.Enum('OPENHOUSE', 'MEETUP', 'VIRTUAL', name='eventtypes'), nullable=False),
    sa.Column('sort_index', sa.Integer(), nullable=True),
    sa.Column('widget_id', sa.Integer(), nullable=True),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['widget_id'], ['widget.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('event_item',
    sa.Column('created_date', sa.DateTime(), nullable=False),
    sa.Column('updated_date', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('description', sa.String(length=500), nullable=True),
    sa.Column('location_name', sa.String(length=50), nullable=True),
    sa.Column('location_address', sa.String(length=100), nullable=True, comment='The address of the location'),
    sa.Column('start_date', sa.DateTime(), nullable=True),
    sa.Column('end_date', sa.DateTime(), nullable=True),
    sa.Column('url', sa.String(length=500), nullable=True),
    sa.Column('url_label', sa.String(length=100), nullable=True, comment='Label to show for href links'),
    sa.Column('sort_index', sa.Integer(), nullable=True),
    sa.Column('widget_events_id', sa.Integer(), nullable=True),
    sa.Column('created_by', sa.String(length=50), nullable=True),
    sa.Column('updated_by', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['widget_events_id'], ['widget_events.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )

    op.add_column('widget', sa.Column('title', sa.String(length=100), nullable=True, comment='Custom title for the widget.'))
    # ### end Alembic commands ###

    widget_type_table = sa.table('widget_type',
                                 sa.Column('id', sa.Integer),
                                 sa.Column('name', sa.String),
                                 sa.Column('description', sa.String))
    conn = op.get_bind()
    res = conn.execute(
        f"select max(id) from widget_type;")
    latest_id = res.fetchall()[0][0]

    op.bulk_insert(widget_type_table, [
        {'id':latest_id+1 ,'name': 'Events', 'description': 'Displays event details on the engagement'}
    ])


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###

    op.drop_column('widget', 'title')

    op.drop_table('event_item')
    op.drop_table('widget_events')
    op.execute("delete from widget_type where name='Events'")
    op.execute('DROP TYPE eventtypes;')
    # ### end Alembic commands ###
