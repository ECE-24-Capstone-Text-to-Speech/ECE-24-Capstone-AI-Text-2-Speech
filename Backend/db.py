
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi
uri = "mongodb+srv://seniordesignusername:123password123@seniordesigncluster.zhtgtmr.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
'''
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
'''

import pymongo
from flask import Flask
import os
from flask import Flask
from dotenv import load_dotenv
from fastapi import APIRouter
import pymongo
import certifi


ca = certifi.where()
client = MongoClient(uri, server_api=ServerApi('1'), tlsCAFile=ca)
db = client["SeniorDesignProject"]
users = db["users"]
#Example of inserting users into database
def register():

        user = "testUser"
        user_found = users.find_one({"username": user})
        if user_found:
            message = 'username already exists'
            return message

        ditem = {
            "username" : "testUser",
            "password" :  "testPass",
        }
        users.insert_one(ditem)
        print("HERE")
        return ditem["username"]

if __name__ == "__main__":
    register()