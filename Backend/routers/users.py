from fastapi import APIRouter, Response, Request, responses, Form
import certifi
from typing import Annotated
import jwt
from internal.tokenAuth import getCurrUser

router = APIRouter()
users = {}

uri = "mongodb+srv://seniordesignusername:123password123@seniordesigncluster.zhtgtmr.mongodb.net/?retryWrites=true&w=majority"

# from dotenv import load_dotenv
from fastapi import APIRouter, Response, Request, responses, Form

from typing import Annotated
from pymongo.mongo_client import MongoClient
import certifi


# Create a new client and connect to the server


router = APIRouter(
    prefix="/users",
    tags=["files"],
    responses={404: {"description": "users path needs functions name appended"}},
)


@router.post("/register", tags=["users"])
async def register(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    ca = certifi.where()
    client = MongoClient(uri, tlsCAFile=ca)
    db = client["SeniorDesignDb"]
    users = db["users"]
    userPass = db["userPass"]

    # check if username is taken:
    if users.find_one({"username": username}):
        message = "username already exists"
        client.close()
        return message

    newUser = {"username": username, "password": password}
    users.insert_one({"username": username})
    userPass.insert_one(newUser)
    message = "user created"
    client.close()
    return message


@router.post("/login", tags=["users"])
async def login(
    username: Annotated[str, Form()],
    password: Annotated[str, Form()],
    response: Response,
):
    ca = certifi.where()
    client = MongoClient(uri, tlsCAFile=ca)
    db = client["SeniorDesignDb"]
    users = db["users"]
    userPass = db["userPass"]

    # user_found = users.find_one({"userid": user})
    if users.find_one({"username": username}):

        # user exists
        if userPass.find_one({"username": username, "password": password}):
            # correct password
            # response.set_cookie(key="loggedInSession", value=username)
            payload = {"sub": username}  # Subject, typically the unique identifier
            token = jwt.encode(payload, None, algorithm="none")
            message = "Correct password"
            client.close()
            return {"access_token": token, "token_type": "bearer", "message": message}
        else:
            # incorrect password
            message = "Incorrect password"
            client.close()
            return {"message": message}
    else:
        # user doesn't exist
        message = "User does not exist"
        client.close()
        return {"message": message}


@router.post("/logout", tags=["users"])
async def logout_user(request: Request, response: Response):
    # message = "Error: No user in session to logout"
    # currUser = request.cookies.get("loggedInSession", None)

    # if the session currently has a user, remove the user\
    # if currUser:
    # response.delete_cookie("loggedInSession")
    message = "User successfully logged out"

    return message


@router.get("/loginStatus", tags=["users"])
async def login_status(request: Request):
    message = {"loggedIn": False, "username": None}

    user = getCurrUser(request)
    if user:
        message["loggedIn"] = True
        message["username"] = user

    # Extract the token from the Authorization header
    # auth_header = request.headers.get("Authorization")
    # if auth_header and auth_header.startswith("Bearer "):
    #     token = auth_header.split(" ")[1]
    #     try:
    #         # Decode the token
    #         payload = jwt.decode(token, options={"verify_signature": False})
    #         message["loggedIn"] = True
    #         message["username"] = payload.get(
    #             "sub"
    #         )  # Assuming 'sub' contains the username
    #     except (jwt.DecodeError, jwt.ExpiredSignatureError):
    #         # Token is invalid or expired
    #         return message
    return message
