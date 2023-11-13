
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://seniordesignusername:123password123@seniordesigncluster.zhtgtmr.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


#Example of inserting objects into database
"""
from telnetlib import TLS
from pymongo import MongoClient 
import pymongo
import datetime
import certifi


ca = certifi.where()
Client = pymongo.MongoClient(uri,tlsCAFile=ca) #Connecting to 
db = Client["users"]
Collection1 = db["usernames"] 
Collection1.insert()

print(db.list_collection_names())

Collection2 = db["passwords"]
Collection2.insert({"username": "password"})
Client.close()
"""