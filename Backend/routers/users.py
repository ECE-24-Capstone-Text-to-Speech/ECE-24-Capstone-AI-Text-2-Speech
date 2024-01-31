# TODO: all functions here have to fetch data from MongoDB
#from dotenv import load_dotenv
from fastapi import APIRouter, Response, Request, responses, Form
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi
from typing import Annotated


router = APIRouter()


# #load_dotenv()
# uri = "mongodb+srv://seniordesignusername:123password123@seniordesigncluster.zhtgtmr.mongodb.net/?retryWrites=true&w=majority"
# ca = certifi.where()
# client = MongoClient(uri, server_api=ServerApi('1'), tlsCAFile=ca)
# db = client["SeniorDesignProject"]
# users = db["users"]

@router.get("/users/", tags=["users"])
async def read_users():
    return users
@router.get("/users/checkCookie")
async def checkCookies(request: Request):
    cookieValue = request.cookies.get("loggedInSession", None)
    return {"loggedInSession": cookieValue}

@router.get("/users/me", tags=["users"])
async def read_user_me():
    return {"username": "fakecurrentuser"}



@router.post('/users/register', tags=['users'])
async def register(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    '''
    if not username:
        message = "username cannot be empty"
        return message
    '''
    
    #user_found = users.find_one({"username": user})
    if username in users:
        return {"message":'username already exists' }
    
    
    #users.insert_one(newUser)
    users[username] = password
    
    return {"message" : "User registered"}


@router.post("/users/login", tags=["users"])
async def login(username: Annotated[str, Form()], password: Annotated[str, Form()], response : Response):
    
    
    #user_found = users.find_one({"userid": user})
    
    if username in users.keys():
        # user exists
        if password == users[username]:
            # correct password
            response.set_cookie(key="loggedInSession", value=username)
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


@router.post("/users/logout", tags=["users"])
async def logout_user(request : Request, response : Response):
    message = "Error: No user in session to logout"
    currUser = request.cookies.get("loggedInSession", None)

    # if the session currently has a user, remove the user\
    if currUser:
        response.delete_cookie("loggedInSession")
        message = "User successfully logged out"
   
    return message



@router.get("/users/testLogin", tags=["users"])
async def testLoginCookies(request: Request):
    response = responses.JSONResponse(content={"message": "hello"})
    print(request)

    # Use `Response` to set a cookie in the request
    response.set_cookie(key="loggedInSession", value="123123123 cookie")

    message = request.cookies.get("loggedInSession")
    return {"Message": message}


