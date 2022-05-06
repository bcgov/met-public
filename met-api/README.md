# **Flask App Blueprint Architecture**
#### Flask-SQLAlchemy, flask-marshmallow, Flask-Migrate, flasgger, PyJWT
### Create virtual environment
### Activate virtual environment
### Install requirements.txt file packages
`pip install -r requirements.txt`
##### All environment variables are set in .env file
## Run flask server
`flask run`

## Migrate models to database
### Init 
`flask db init`
### migrate 
`flask db migrate -m "message"`
### upgrade
`flask db upgrade`
### downgrade
`flask db downgrade`

