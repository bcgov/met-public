
"""Initilizations for db, migration and marshmallow."""

from contextlib import contextmanager
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
# DB initialize in __init__ file
# db variable use for create models from here
db = SQLAlchemy()

# Migrate initialize in __init__ file
# Migrate database config
migrate = Migrate()

# Marshmallow for database model schema
ma = Marshmallow()


@contextmanager
def session_scope():
    """Provide a transactional scope around a series of operations."""
    # Using the default session for the scope
    session = db.session
    try:
        yield session
        session.commit()
    except Exception as e:  # noqa: B901, E722
        print(str(e))
        session.rollback()
        raise
