import os
from os.path import join, dirname
from dotenv import load_dotenv

# Import all env variables in this file so they can be fetched wherever needed
load_dotenv()
POSTGRES_USERNAME =  os.environ.get('POSTGRES_USERNAME')
POSTGRES_PASSWORD = os.environ.get('POSTGRES_PASSWORD')
POSTGRES_PORT = os.environ.get('POSTGRES_PORT')
POSTGRES_DB = os.environ.get('POSTGRES_DB')
MONGO_DB= os.environ.get('MONGO_DB')

print(f'{POSTGRES_USERNAME}, {POSTGRES_PASSWORD} , {POSTGRES_PORT}, {POSTGRES_DB}')