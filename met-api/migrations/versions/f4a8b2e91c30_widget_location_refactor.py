"""Refactor widget to location+tab uniqueness: backfill locations, drop sort_index.

Assigns non-details widgets to base locations 1 and 3, and maps Details
widgets to location 2 with engagement_details_tab_id always set. If no
details tabs exist for an engagement, Details placement is skipped and
overflow widgets are deleted. Swaps the unique constraint from
(widget_type_id, engagement_id) to
(location, engagement_id, engagement_details_tab_id), makes location
NOT NULL, and removes the sort_index column.

Revision ID: f4a8b2e91c30
Revises: 6b80c03ea472
Create Date: 2026-02-23 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f4a8b2e91c30'
down_revision = '6b80c03ea472'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()

    # Add optional details tab reference for tab-specific widgets.
    op.add_column('widget', sa.Column('engagement_details_tab_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'fk_widget_engagement_details_tab_id',
        'widget',
        'engagement_details_tabs',
        ['engagement_details_tab_id'],
        ['id'],
        ondelete='CASCADE',
    )

    # 1. For each engagement, assign locations to widgets in a deterministic way.
    #    There are only 3 locations:
    #      1 = Summary, 2 = Details, 3 = Feedback.
    #    IMPORTANT: location=2 must always have engagement_details_tab_id set.
    #    We reserve base slots for Summary and Feedback, and map Details widgets
    #    to location=2 using engagement_details_tab_id ordered by tab sort_index.
    #    If an engagement has no tabs, Details placement is skipped.
    #    This also resolves duplicates/NULLs that would otherwise block unique
    #    constraint creation.
    rows = conn.execute(
        sa.text(
            'SELECT id, engagement_id FROM widget '
            'ORDER BY engagement_id ASC, id ASC'
        )
    ).fetchall()

    tab_rows = conn.execute(
        sa.text(
            'SELECT id, engagement_id FROM engagement_details_tabs '
            'ORDER BY engagement_id ASC, sort_index ASC, id ASC'
        )
    ).fetchall()

    by_engagement = {}
    for widget_id, eng_id in rows:
        by_engagement.setdefault(eng_id, []).append(widget_id)

    tabs_by_engagement = {}
    for tab_id, eng_id in tab_rows:
        tabs_by_engagement.setdefault(eng_id, []).append(tab_id)

    for eng_id, widget_ids in by_engagement.items():
        tab_ids = tabs_by_engagement.get(eng_id, [])
        cursor = 0

        # Summary slot (location=1, no tab).
        if cursor < len(widget_ids):
            conn.execute(
                sa.text(
                    'UPDATE widget '
                    'SET location = 1, engagement_details_tab_id = NULL '
                    'WHERE id = :wid'
                ),
                {'wid': widget_ids[cursor]},
            )
            cursor += 1

        # First Details slot (location=2) only if a tab is available.
        tab_cursor = 0
        if cursor < len(widget_ids) and tab_cursor < len(tab_ids):
            conn.execute(
                sa.text(
                    'UPDATE widget '
                    'SET location = 2, engagement_details_tab_id = :tab_id '
                    'WHERE id = :wid'
                ),
                {'tab_id': tab_ids[tab_cursor], 'wid': widget_ids[cursor]},
            )
            cursor += 1
            tab_cursor += 1

        # Feedback slot (location=3, no tab).
        if cursor < len(widget_ids):
            conn.execute(
                sa.text(
                    'UPDATE widget '
                    'SET location = 3, engagement_details_tab_id = NULL '
                    'WHERE id = :wid'
                ),
                {'wid': widget_ids[cursor]},
            )
            cursor += 1

        # Remaining widgets are tab-scoped Details widgets (location=2).
        while cursor < len(widget_ids) and tab_cursor < len(tab_ids):
            conn.execute(
                sa.text(
                    'UPDATE widget '
                    'SET location = 2, engagement_details_tab_id = :tab_id '
                    'WHERE id = :wid'
                ),
                {'tab_id': tab_ids[tab_cursor], 'wid': widget_ids[cursor]},
            )
            cursor += 1
            tab_cursor += 1

        # Delete overflow widgets that cannot be mapped without violating rules.
        for widget_id in widget_ids[cursor:]:
            conn.execute(sa.text('DELETE FROM widget WHERE id = :wid'), {'wid': widget_id})

    # 2. Swap unique constraints: type-based → location+tab-based.
    op.drop_constraint('unique_widget_type', 'widget', type_='unique')
    op.create_unique_constraint(
        'unique_widget_location_tab',
        'widget',
        ['location', 'engagement_id', 'engagement_details_tab_id'],
    )

    # 3. Enforce NOT NULL on location (all rows now have a location value).
    op.alter_column('widget', 'location', nullable=False)

    # 4. Remove sort_index — ordering is now determined by location.
    op.drop_column('widget', 'sort_index')


def downgrade():
    # Re-add sort_index and deterministically rebuild ordering.
    op.add_column('widget', sa.Column('sort_index', sa.Integer(), nullable=True))
    conn = op.get_bind()

    # Rebuild both sort_index and location as unique sequential values per
    # engagement to avoid collisions when downgrading from tab-scoped widgets.
    rows = conn.execute(
        sa.text(
            'SELECT w.id, w.engagement_id '
            'FROM widget w '
            'LEFT JOIN engagement_details_tabs t ON t.id = w.engagement_details_tab_id '
            'ORDER BY w.engagement_id ASC, w.location ASC, COALESCE(t.sort_index, 0) ASC, w.id ASC'
        )
    ).fetchall()

    by_engagement = {}
    for widget_id, eng_id in rows:
        by_engagement.setdefault(eng_id, []).append(widget_id)

    for _eng_id, widget_ids in by_engagement.items():
        for i, widget_id in enumerate(widget_ids):
            next_index = i + 1
            conn.execute(
                sa.text('UPDATE widget SET sort_index = :idx, location = :loc WHERE id = :wid'),
                {'idx': next_index, 'loc': next_index, 'wid': widget_id},
            )

    op.alter_column('widget', 'sort_index', nullable=False)

    # Restore original constraints.
    op.drop_constraint('unique_widget_location_tab', 'widget', type_='unique')
    op.create_unique_constraint('unique_widget_type', 'widget', ['widget_type_id', 'engagement_id'])

    # Remove optional details tab reference.
    op.drop_constraint('fk_widget_engagement_details_tab_id', 'widget', type_='foreignkey')
    op.drop_column('widget', 'engagement_details_tab_id')

    # Allow location to be NULL again.
    op.alter_column('widget', 'location', nullable=True)
