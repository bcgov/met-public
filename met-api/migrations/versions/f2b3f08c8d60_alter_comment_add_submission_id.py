"""alter comment add submission_id

Revision ID: f2b3f08c8d60
Revises: c19bc1af9f2b
Create Date: 2022-11-01 11:59:02.563717

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f2b3f08c8d60'
down_revision = 'c19bc1af9f2b'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    op.add_column('comment', sa.Column('submission_id', sa.Integer(), nullable=True))
    op.add_column('comment', sa.Column('component_id', sa.String(), nullable=True))
    op.create_foreign_key('comment_submission_id_fkey', 'comment', 'submission', ['submission_id'], ['id'], ondelete='SET NULL')
    # Attempt to populate the submission id for previous answers BUT
    # this could potentially link a comment with a wrong submission id 
    # when there are multiple submissions for the same survey from the same user (we are unable to identify different submissions for the same user)
    conn.execute('UPDATE public.comment c \
                  SET submission_id=s.id \
                  FROM public.submission s \
                  WHERE \
                    c.submission_id is null AND \
                    s.survey_id = c.survey_id AND \
                    s.user_id = c.user_id')

    # Attempt to populate the corresponding question/componnent id for a comment BUT
    # this could potentially link a comment with its a wrong question/component
    # when there are multiple questions in the survey (we are unable to identify which question it belongs to)    
    conn.execute('UPDATE public.comment c \
                  SET component_id=item_object->>\'key\' \
                  FROM survey s, \
                       jsonb_array_elements(s.form_json->\'components\') with ordinality arr(item_object, position) \
                  WHERE \
                    c.component_id is null AND \
                    c.survey_id = s.id AND \
                    item_object->>\'inputType\' = \'text\'')


def downgrade():
    op.drop_constraint('comment_submission_id_fkey', 'comment', type_='foreignkey')
    op.drop_column('comment', 'submission_id')
    op.drop_column('comment', 'component_id')
