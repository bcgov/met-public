from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '04e6c48187da'
down_revision = 'f40da1b8f3e0'
branch_labels = None
depends_on = None

# Define the Enum type for feedback status
feedback_status_enum = sa.Enum(
    'Unreviewed', 'Archived', name='feedbackstatustype')


def upgrade():
    # Create the Enum type in the database
    feedback_status_enum.create(op.get_bind())

    # Add the new column with the enum type and set default value to 'Unreviewed'
    op.add_column('feedback', sa.Column(
        'status', sa.Enum('Unreviewed', 'Archived', name='feedbackstatustype'),
        nullable=False, server_default='Unreviewed'))

    # Update existing rows to have 'Unreviewed' status
    op.execute('UPDATE "feedback" SET status = \'Unreviewed\'')


def downgrade():
    # Drop the new column
    op.drop_column('feedback', 'status')

    # Drop the Enum type from the database
    feedback_status_enum.drop(op.get_bind())
