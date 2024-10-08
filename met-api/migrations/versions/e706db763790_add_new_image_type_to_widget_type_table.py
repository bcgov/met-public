"""Add new Image type to widget type table

Revision ID: e706db763790
Revises: 42641011576a
Create Date: 2024-09-04 14:03:57.967946

"""

from datetime import datetime, UTC
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, DateTime


# revision identifiers, used by Alembic.
revision = "e706db763790"
down_revision = "42641011576a"
branch_labels = None
depends_on = None


def upgrade():
    # Temporary table model for existing widget_type table
    widget_type_table = table(
        "widget_type",
        column("id", Integer),
        column("name", String),
        column("description", String),
        column("created_date", DateTime),
        column("updated_date", DateTime),
        column("created_by", String),
        column("updated_by", String),
    )
    # Insert new widget type
    op.bulk_insert(
        widget_type_table,
        [
            {
                "id": 11,
                "name": "Image",
                "description": "Displays a static image, with optional caption",
                "created_by": "migration",
                "updated_by": "migration",
                "created_date": datetime.now(UTC),
                "updated_date": datetime.now(UTC),
            }
        ],
    )
    op.create_table(
        "widget_image",
        sa.Column("created_date", sa.DateTime(), nullable=False),
        sa.Column("updated_date", sa.DateTime(), nullable=True),
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("widget_id", sa.Integer(), nullable=True),
        sa.Column("engagement_id", sa.Integer(), nullable=True),
        sa.Column("image_url", sa.String(length=255), nullable=False),
        sa.Column("alt_text", sa.String(length=255), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_by", sa.String(length=50), nullable=True),
        sa.Column("updated_by", sa.String(length=50), nullable=True),
        sa.ForeignKeyConstraint(
            ["engagement_id"], ["engagement.id"], ondelete="CASCADE"
        ),
        sa.ForeignKeyConstraint(["widget_id"], ["widget.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("widget_image")
    op.execute("DELETE FROM widget_type WHERE id = 11")
    # ### end Alembic commands ###
