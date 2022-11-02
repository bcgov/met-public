import os
from sqlalchemy import create_engine

def get_met_db_creds():
    user=os.getenv("MET_DB_USER", "")
    password=os.getenv("MET_DB_PASSWORD", "")
    db=os.getenv("MET_DB_DB", "")
    host=os.getenv("MET_DB_HOST", "")
    port=int(os.getenv("MET_DB_PORT", 54332))
    DBConnection = create_engine(f'postgresql://{user}:{password}@{host}:{port}/{db}')
    try:
        return DBConnection
    except:
        print("Error loading the config file.")

def get_met_analytics_db_creds():
    user=os.getenv("MET_ANALYTICS_DB_USER", "")
    password=os.getenv("MET_ANALYTICS_DB_PASSWORD", "")
    db=os.getenv("MET_ANALYTICS_DB_DB", "")
    host=os.getenv("MET_ANALYTICS_DB_HOST", "")
    port=os.getenv("MET_ANALYTICS_DB_PORT", 54334)
    DBConnection = create_engine(f'postgresql://{user}:{password}@{host}:{port}/{db}')
    try:
        return DBConnection
    except:
        print("Error loading the config file.")
