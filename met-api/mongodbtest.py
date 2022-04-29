from pymongo import MongoClient
from random import randint
# pprint library is used to make the output look more pretty
# connect to MongoDB, change the << MONGODB URL >> to reflect your own connection string
client = MongoClient(port=27017)
# Database Name
db = client.formio
 
# Collection Name
col = db.forms
 
# Get the first car
x = col.find_one()

index = open("./routes/index.html").read().format(result=x)
print(x)


  
