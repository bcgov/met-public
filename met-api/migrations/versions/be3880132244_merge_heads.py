"""merge heads

Revision ID: be3880132244
Revises: 8595172f9d96, a1237c8a3df9
Create Date: 2023-03-08 15:04:38.905600

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'be3880132244'
down_revision = ('8595172f9d96', 'a1237c8a3df9')
branch_labels = None
depends_on = None
