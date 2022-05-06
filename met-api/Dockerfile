# pull official base image
FROM python:3.8-alpine

# set working directory
WORKDIR /app

# install app dependencies
COPY requirements.txt requirements.txt
RUN \
 apk add --no-cache postgresql-libs && \
 apk add --no-cache --virtual .build-deps gcc musl-dev postgresql-dev && \
 pip3 install -r requirements.txt

# add app files
COPY . ./

# start app
CMD [ "python3", "./app/app.py", "-m" , "flask", "run", "--host=0.0.0.0"] 

