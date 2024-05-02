"""Initilizations for db, migration and marshmallow."""

from contextlib import contextmanager
from flask import current_app
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

# DB initialize in __init__ file
# db variable use for create models from here
db = SQLAlchemy()

# Migrate initialize in __init__ file
# Migrate database config
migrate = Migrate()

@contextmanager
def session_scope():
    """Provide a transactional scope around a series of operations."""
    # Using the default session for the scope
    session = db.session
    try:
        yield session
        session.commit()
    except Exception as e:  # noqa: B901, E722
        current_app.logger.error(f'Error in session_scope: {e}')
        session.rollback()
        raise