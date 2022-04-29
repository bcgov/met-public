from sqlalchemy.orm import sessionmaker
import sqlalchemy as db
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()

# DEFINE THE ENGINE (CONNECTION OBJECT)
engine = db.create_engine(
	"engine = create_engine('postgresql+psycopg2://postgres:Nunespider_111@localhost/flask_db')")

# CREATE THE TABLE MODEL TO USE IT FOR QUERYING
class Students(Base):

	__tablename__ = 'students'

	first_name = db.Column(db.String(50),
						primary_key=True)
	last_name = db.Column(db.String(50),
						primary_key=True)
	course = db.Column(db.String(50),
					primary_key=True)
	score = db.Column(db.Float)


# CREATE A SESSION OBJECT TO INITIATE QUERY
# IN DATABASE
Session = sessionmaker(bind=engine)
session = Session()

# SELECT first_name FROM students
result = session.query(Students.first_name)
print("Query 1:", result)

# SELECT first_name, last_name, course
# FROM students
result = result.add_columns(Students.last_name,
							Students.course)
print("Query 2:", result)

# VIEW THE ENTRIES IN THE RESULT
for r in result:
	print(r.first_name, "|", r.last_name, "|", r.course)
