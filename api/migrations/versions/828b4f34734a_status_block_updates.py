"""Move cta_message and cta_url from engagement to engagement_status_block

Revision ID: 828b4f34734a
Revises: e706db763790
Create Date: 2024-09-16 10:18:49.858066

"""

from enum import IntEnum, Enum
from alembic import op
import sqlalchemy as sa


class SubmissionStatus(IntEnum):
    """Enum of engagement submission status."""

    Upcoming = 1
    Open = 2
    Closed = 3
    ViewResults = 4


# revision identifiers, used by Alembic.
revision = "828b4f34734a"
down_revision = "e706db763790"
branch_labels = None
depends_on = None


def upgrade():
    connection = op.get_bind()
    # Create a new enum type with the 'ViewResults' value
    op.execute("ALTER TYPE submissionstatus RENAME TO submissionstatus_old")
    op.execute(
        "CREATE TYPE submissionstatus AS ENUM ('Upcoming', 'Open', 'Closed', 'ViewResults')"
    )
    # Commit the enum change before dropping the old one
    op.execute("COMMIT")
    # Convert the existing data to the new enum type
    connection.execute(
        "ALTER TABLE engagement_status_block ALTER COLUMN survey_status TYPE submissionstatus USING survey_status::text::submissionstatus"
    )
    # Drop the old enum type
    op.execute("DROP TYPE submissionstatus_old")

    op.add_column(
        "engagement_status_block",
        sa.Column("button_text", sa.String(length=20), nullable=True),
    )
    op.add_column(
        "engagement_status_block",
        sa.Column(
            "link_type", sa.String(length=20), nullable=False, server_default="internal"
        ),
    )
    op.add_column(
        "engagement_status_block",
        sa.Column("internal_link", sa.String(length=50), nullable=True),
    )
    op.add_column(
        "engagement_status_block",
        sa.Column("external_link", sa.String(length=300), nullable=True),
    )
    # Migrate data from engagement to engagement_status_block
    # Ad-hoc table definition for engagement
    engagement_table = sa.Table(
        "engagement",
        sa.MetaData(),
        sa.Column("id", sa.Integer),
        sa.Column("cta_message", sa.String(50)),
        sa.Column("cta_url", sa.String(500)),
    )
    # Ad-hoc table definition for engagement_status_block
    engagement_status_block_table = sa.Table(
        "engagement_status_block",
        sa.MetaData(),
        sa.Column("id", sa.Integer),
        sa.Column("engagement_id", sa.Integer),
        sa.Column(
            "survey_status",
            sa.Enum(
                SubmissionStatus,
                name="submissionstatus",
                metadata=sa.MetaData(),
                create_constraint=True,
            ),
        ),
        sa.Column("block_text", sa.JSON),
        sa.Column("button_text", sa.String(20)),
        sa.Column("link_type", sa.String(20)),
        sa.Column("internal_link", sa.String(50)),
        sa.Column("external_link", sa.String(300)),
        sa.Column("created_date", sa.DateTime),
        sa.Column("updated_date", sa.DateTime),
    )
    # For each engagement...
    for engagement in connection.execute(engagement_table.select()):
        # Update existing engagement_status_blocks...
        # If the URL starts with "http", it's an external link.
        if engagement.cta_url and engagement.cta_url.startswith("http"):
            link_type = "external"
            external_link = engagement.cta_url
            internal_link = None
        else:
            valid_statuses = ["hero", "description", "contentTabs", "provideFeedback"]
            link_type = "internal"
            external_link = None
            internal_link = None
            if engagement.cta_url in valid_statuses:
                internal_link = engagement.cta_url
            else:
                internal_link = "provideFeedback"
        connection.execute(
            engagement_status_block_table.update()
            .where(engagement_status_block_table.c.engagement_id == engagement.id)
            .where(engagement_status_block_table.c.survey_status == "Open")
            .values(
                button_text=engagement.cta_message or "Provide Feedback",
                link_type=link_type,
                external_link=external_link,
                internal_link=internal_link,
            )
        )
        # And add the "View Results" block type.
        connection.execute(
            engagement_status_block_table.insert().values(
                engagement_id=engagement.id,
                survey_status=SubmissionStatus.ViewResults,
                block_text={},
                button_text="View Results",
                link_type="internal",
                internal_link="provideFeedback",
                external_link=None,
                created_date=sa.func.now(),
                updated_date=sa.func.now(),
            )
        )
    # Drop the columns from the engagement table
    op.drop_column("engagement", "cta_message")
    op.drop_column("engagement", "cta_url")


def downgrade():
    op.drop_column("engagement_status_block", "external_link")
    op.drop_column("engagement_status_block", "internal_link")
    op.drop_column("engagement_status_block", "link_type")
    op.drop_column("engagement_status_block", "button_text")
    op.add_column(
        "engagement",
        sa.Column(
            "cta_url", sa.VARCHAR(length=500), autoincrement=False, nullable=True
        ),
    )
    op.add_column(
        "engagement",
        sa.Column(
            "cta_message", sa.VARCHAR(length=50), autoincrement=False, nullable=True
        ),
    )
    # Create a new enum type without the 'ViewResults' value
    op.execute("ALTER TYPE submissionstatus RENAME TO submissionstatus_old")
    op.execute("CREATE TYPE submissionstatus AS ENUM ('Upcoming', 'Open', 'Closed')")
    # Commit the enum change before dropping the old one
    op.execute("COMMIT")
    # Convert the existing data to the new enum type
    connection = op.get_bind()
    connection.execute(
        "UPDATE engagement_status_block SET survey_status = 'Closed' WHERE survey_status = 'ViewResults'"
    )
    connection.execute(
        "ALTER TABLE engagement_status_block ALTER COLUMN survey_status TYPE submissionstatus USING survey_status::text::submissionstatus"
    )
    # Drop the old enum type
    op.execute("DROP TYPE submissionstatus_old")
