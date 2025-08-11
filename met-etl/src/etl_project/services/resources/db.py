from contextlib import contextmanager
from dagster import resource
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

@resource
@contextmanager
def dagster_db_session(context):
    try:
        user = os.getenv("DAGSTER_DB_USER", "")
        password = os.getenv("DAGSTER_DB_PASSWORD", "")
        db = os.getenv("MET_DB_DB", "")
        host = os.getenv("MET_DB_HOST", "")
        port = int(os.getenv("MET_DB_PORT", 5432))
        db_connection = create_engine(f'postgresql://{user}:{password}@{host}:{port}/{db}')
        session_maker = sessionmaker(bind=db_connection)
        session = session_maker()
        yield session
    finally:
        context.log.info('Closing Dagster DB session')
        session.close()


@resource
@contextmanager
def met_db_session(context):
    try:
        user = os.getenv("MET_DB_USER", "")
        password = os.getenv("MET_DB_PASSWORD", "")
        db = os.getenv("MET_DB_DB", "")
        host = os.getenv("MET_DB_HOST", "")
        port = int(os.getenv("MET_DB_PORT", 54332))
        db_connection = create_engine(f'postgresql://{user}:{password}@{host}:{port}/{db}')
        session_maker = sessionmaker(bind=db_connection)
        session = session_maker()
        yield session
    finally:
        context.log.info('Closing Met DB session')
        session.close()


@resource
@contextmanager
def met_etl_db_session(context):
    try:
        user = os.getenv("MET_ANALYTICS_DB_USER", "")
        password = os.getenv("MET_ANALYTICS_DB_PASSWORD", "")
        db = os.getenv("MET_ANALYTICS_DB_DB", "")
        host = os.getenv("MET_ANALYTICS_DB_HOST", "")
        port = os.getenv("MET_ANALYTICS_DB_PORT", 54334)
        db_connection = create_engine(f'postgresql://{user}:{password}@{host}:{port}/{db}')
        session_maker = sessionmaker(bind=db_connection)
        session = session_maker()
        yield session
    finally:
        context.log.info('Closing Met ETL DB session')
        session.close()
