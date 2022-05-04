# pull official base image
FROM python:3.8-slim-buster

RUN python3 -m venv venv
# escape=`
WORKDIR /venv/Scripts

#run environemnt executable (not working)
RUN activate.bat
# set working directory
WORKDIR /app

# install app dependencies
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt





# add app files
COPY . ./

# start app
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"] 

