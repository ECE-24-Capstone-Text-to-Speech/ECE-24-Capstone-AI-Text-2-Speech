# TODO: all functions here have to fetch data from MongoDB
#from dotenv import load_dotenv
from fastapi import APIRouter, Response, Request, responses, Form
# from pymongo.mongo_client import MongoClient
# from pymongo.server_api import ServerApi
import certifi
from typing import Annotated


router = APIRouter()
users = {}

uri = "mongodb+srv://seniordesignusername:123password123@seniordesigncluster.zhtgtmr.mongodb.net/?retryWrites=true&w=majority"

#from dotenv import load_dotenv
from fastapi import APIRouter, Response, Request, responses, Form

from typing import Annotated
from pymongo.mongo_client import MongoClient
import certifi


# Create a new client and connect to the server


router = APIRouter()


@router.post('/users/register', tags=['users'])
async def register(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    ca = certifi.where()
    client = MongoClient(uri, tlsCAFile=ca)
    db = client["SeniorDesignDb"]
    users = db["users"]
    userPass = db["userPass"]

    #check if username is taken:
    if users.find_one({"username": username}):
        message = 'username already exists'
        client.close()
        return message
    
    newUser = {
        "username": username,
        "password": password

    }
    users.insert_one({"username": username})
    userPass.insert_one(newUser)
    message = 'user created'
    client.close()
    return message


@router.post("/users/login", tags=["users"])
async def login(username: Annotated[str, Form()], password: Annotated[str, Form()], response : Response):
    ca = certifi.where()
    client = MongoClient(uri, tlsCAFile=ca)
    db = client["SeniorDesignDb"]
    users = db["users"]
    userPass = db["userPass"]
    
    #user_found = users.find_one({"userid": user})
    if users.find_one({"username": username}):

        # user exists
        if userPass.find_one({"username": username, "password": password}):
            # correct password
            response.set_cookie(key="loggedInSession", value=username)
            message = 'Correct password'
            client.close()
            return message
        else:
            # incorrect password
            message = 'Incorrect password'
            client.close()
            return message
    else:
        # user doesn't exist
        message = 'User does not exist'
        client.close()
        return message


@router.post("/users/logout", tags=["users"])
async def logout_user(request : Request, response : Response):
    message = "Error: No user in session to logout"
    currUser = request.cookies.get("loggedInSession", None)

    # if the session currently has a user, remove the user\
    if currUser:
        response.delete_cookie("loggedInSession")
        message = "User successfully logged out"
   
    return message


