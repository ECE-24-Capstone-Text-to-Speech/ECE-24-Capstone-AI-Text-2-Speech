# TODO: all functions here have to fetch data from MongoDB



from fastapi import APIRouter
router = APIRouter()


@router.get("/users/", tags=["users"])
async def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]


@router.get("/users/me", tags=["users"])
async def read_user_me():
    return {"username": "fakecurrentuser"}


@router.get("/users/{username}", tags=["users"])
async def read_user(username: str):
    return {"username": username}

@router.get('/register', tags=['users'])
async def register():

    #existing_user = mongo.db.users.find_one({'username': username})
    #if existing_user:
    #    return jsonify(message='Username already exists'), 400

    #NEEDS FRONT END BUILT OUT TO FETCH DATA
    data = router.get_json()
    username = data.get('username')
    password = data.get('password')
    
    #push user to mongodb here
    #user_id = mongo.db.users.insert({'username': username, 'password': password})
    
    return {"Message": 'User registered successfully'}