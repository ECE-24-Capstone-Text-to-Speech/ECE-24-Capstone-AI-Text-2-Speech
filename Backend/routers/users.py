# TODO: all functions here have to fetch data from MongoDB
import os
from flask import Flask, session, response
from dotenv import load_dotenv
from fastapi import APIRouter, request
import pymongo


router = APIRouter()


load_dotenv()
app= Flask(__name__)
client = pymongo.MongoClient(os.getenv(uri))
db = client["SeniorDesignProject"]

#crate collection
users = db["users"]

@router.get("/users/", tags=["users"])
async def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]


@router.get("/users/me", tags=["users"])
async def read_user_me():
    return {"username": "fakecurrentuser"}


@router.get("/users/{username}", tags=["users"])
async def read_user(username: str):
    return {"username": username}

@router.get('/users/register', tags=['users'])
async def register():
    if request.tag == "users":
        message = ""
        json = request.get_json()
        user = json["username"]
        user_found = users.find_one({"username": user})
        if user_found:
            message = 'username already exists'
            return message

        ditem = {
            "username" : json["username"],
            "password" : json["password"]
        }
        users.insert_one(ditem)
        
        return ditem["username"]


@app.route("/users/login", methods=["POST"])
async def login():
    json = request.get_json(force=True)
    print(json)
    user = json['userid']
    password = json['password']
    user_found = users.find_one({"userid": user})
    if user_found is not None:
        # user exists
        if password == user_found["password"]:
            # correct password
            response.set_cookie(key="loggedInSession", value="username")
            message = 'Correct password'
            return message
        else:
            # incorrect password
            message = 'Incorrect password'
            return message
    else:
        # user doesn't exist
        message = 'User does not exist'
        return message


@app.route("/users/logout")
async def logout_user():
    result = False
    message = "Error: No user in session to logout"

    # if the session currently has a user, remove the user\
    if session.keys() == "loggedInSession":
        response.set_cookie(key="loggedOutSession", value = "")
        result = True
        message = "User successfully logged out"

    return message