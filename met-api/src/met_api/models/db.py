
"""Initializations for db, migration and marshmallow."""

import logging
from contextlib import contextmanager
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from typing import Callable, TypeVar
# DB initialize in __init__ file
# db variable use for create models from here
db = SQLAlchemy()

# Migrate initialize in __init__ file
# Migrate database config
migrate = Migrate()

# Marshmallow for database model schema
ma = Marshmallow()

class AbortTransaction(Exception):
    """
    An exception to be raised when a transaction should be aborted. Handled
    gracefully in the transactional decorator. Only raise this exception
    when already inside a transactional block.
    """

ReturnType = TypeVar('ReturnType')

def transactional(db=db, autocommit=True, end_session=False
                  ) -> Callable[[Callable[..., ReturnType]], Callable[..., ReturnType]]:
    """
    A decorator to quickly make an operation transactional.
    If there is an exception during execution, the entire session will be 
    safely rolled back to a point in time just before the decorated function 
    was called. If not, the session will be saved, unless autocommit is set
    to False. This helps replace most session management boilerplate.

    Args:
        db: The database instance to be used for the transaction.
        autocommit: A boolean indicating whether to commit the session. Default is True.

    Returns:
        The result of the wrapped function `f`.
    """
    def decorator(f: Callable[..., ReturnType]) -> Callable[..., ReturnType]:
        @wraps(f)
        def decorated_function(*args, **kwargs) -> ReturnType:
            try:
                result = f(*args, **kwargs)
                if autocommit:
                    db.session.commit()
                else:
                    db.session.flush()
                return result
            except AbortTransaction:
                logging.info("Transaction aborted.")
                db.session.rollback() # we meant to roll back; don't raise :)
            except Exception as e: # all other exceptions
                logging.exception(
                    "An error occurred during a transaction; rolling back.")
                db.session.rollback()
                raise e
            finally:
                if end_session:
                  db.session.close()
        return decorated_function
    return decorator