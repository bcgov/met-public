#Setup FLask Environment
FROM python:2.7
ADD . /code
WORKDIR /code
RUN pip install -r requirements.txt
CMD python app.py

#Connect to PostGresSQL
CMD initPS.py


#Connect to MongoDB
CMD mongodbdtest.py
