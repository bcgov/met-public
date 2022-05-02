from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String
from postgresDB.orm import Engagements
from dotenv import load_dotenv
from app.fetchEnv import POSTGRES_USERNAME,POSTGRES_PASSWORD,POSTGRES_DB,POSTGRES_PORT,POSTGRES_HOST

#Connect to postgres database
engine = create_engine(f'postgresql+psycopg2://{POSTGRES_USERNAME}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}',echo=True)
meta = MetaData()

#Create table for engagements
engagements = Table(
   'Engagements', meta, 
   Column('id', Integer, primary_key = True), 
   Column('title', String), 
   Column('description', String),

)

meta.create_all(engine)


