from flask import Flask,request
from flask_restful import reqparse, abort, Api, Resource
import requests




app = Flask(__name__)
api = Api(app)


response = requests.get("http://api.open-notify.org/astros.json")
print(response.text)