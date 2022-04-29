from sqlalchemy.orm import sessionmaker
import sqlalchemy as db
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()

# DEFINE THE ENGINE (CONNECTION OBJECT)
engine = db.create_engine('postgresql+psycopg2://postgres:test@localhost:9999/flask_db')


# CREATE THE TABLE MODEL TO USE IT FOR QUERYING
class Engagements(Base):
    
	__tablename__ = 'Engagements'
 
	title = db.Column(db.String(50),
						primary_key=True)
	description = db.Column(db.String(50),
						primary_key=True)
	start_date = db.Column(db.String(50),
					primary_key=True),
	end_date = db.Column(db.String(50),primary_key=True)
 
 
 

# CREATE A SESSION OBJECT TO INITIATE QUERY
# IN DATABASE
Session = sessionmaker(bind=engine)
session = Session()

# SELECT title FROM engagements
result = session.query(Engagements.title)
print("Query 1:", result)

# SELECT title, description, start_date
# FROM engagements
result = result.add_columns(Engagements.description,
							Engagements.start_date)
print("Query 2:", result)

# VIEW THE ENTRIES IN THE RESULT
for r in result:
	print(r.title, "|", r.description, "|", r.end_date)
