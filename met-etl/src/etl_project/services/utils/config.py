import os
from sqlalchemy import create_engine


def get_met_db_creds():
    user = os.getenv("ENGAGEMENT_DB_USER", "")
    password = os.getenv("ENGAGEMENT_DB_PASSWORD", "")
    db = os.getenv("ENGAGEMENT_DB_DB", "")
    host = os.getenv("ENGAGEMENT_DB_HOST", "")
    port = int(os.getenv("ENGAGEMENT_DB_PORT", 54332))
    DBConnection = create_engine(
        f'postgresql://{user}:{password}@{host}:{port}/{db}')
    try:
        return DBConnection
    except BaseException:
        print("Error loading the config file.")


def get_met_analytics_db_creds():
    user = os.getenv("ANALYTICS_DB_USER", "")
    password = os.getenv("ANALYTICS_DB_PASSWORD", "")
    db = os.getenv("ANALYTICS_DB_DB", "")
    host = os.getenv("ANALYTICS_DB_HOST", "")
    port = os.getenv("ANALYTICS_DB_PORT", 54334)
    DBConnection = create_engine(
        f'postgresql://{user}:{password}@{host}:{port}/{db}')
    try:
        return DBConnection
    except BaseException:
        print("Error loading the config file.")
