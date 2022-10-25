import os

from utils.db import DBConnection


def get_met_analytics_db_creds() -> DBConnection:
    return DBConnection(
        user=os.getenv("MET_ANALYTICS_DB_USER", ""),
        password=os.getenv("MET_ANALYTICS_DB_PASSWORD", ""),
        db=os.getenv("MET_ANALYTICS_DB_DB", ""),
        host=os.getenv("MET_ANALYTICS_DB_HOST", ""),
        port=int(os.getenv("MET_ANALYTICS_DB_PORT", 54334)),
    )


def get_met_db_creds() -> DBConnection:
    return DBConnection(
        user=os.getenv("MET_DB_USER", ""),
        password=os.getenv("MET_DB_PASSWORD", ""),
        db=os.getenv("MET_DB_DB", ""),
        host=os.getenv("MET_DB_HOST", ""),
        port=int(os.getenv("MET_DB_PORT", 5432)),
    )
