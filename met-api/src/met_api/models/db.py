
"""Initializations for db, migration and marshmallow."""

import logging
from typing import Callable, Optional, TypeVar
from functools import wraps
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


class AbortTransaction(Exception):  # noqa
    """
    An exception to be raised when a transaction should be aborted.

    Handled gracefully in the transactional decorator. Only raise this exception
    when already inside a transactional block.
    """


T = TypeVar('T')


def transactional(database=db, autocommit=True, end_session=False
                  ) -> Callable[[Callable[..., T]], Callable[..., T]]:
    """
    Decorate an operation to quickly make it transactional.

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
    def decorator(f: Callable[..., T]) -> Callable[..., T]:
        @wraps(f)
        def decorated_function(*args, **kwargs) -> Optional[T]:
            try:
                result = f(*args, **kwargs)
                if autocommit:
                    database.session.commit()
                else:
                    database.session.flush()
                return result
            except AbortTransaction:
                logging.info('Transaction aborted.')
                database.session.rollback()  # we meant to roll back; don't raise :)
            except Exception as e:  # noqa: B902
                logging.exception(
                    'An error occurred during a transaction; rolling back.')
                database.session.rollback()
                raise e
            finally:
                if end_session:
                    database.session.close()
            return None
        return decorated_function  # type: ignore
    return decorator
