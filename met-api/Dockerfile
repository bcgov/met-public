# pull official base image
FROM python:3.8-slim-buster

# set working directory
WORKDIR /app

# install app dependencies
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

# add app files
COPY . ./

# start app
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"] 

