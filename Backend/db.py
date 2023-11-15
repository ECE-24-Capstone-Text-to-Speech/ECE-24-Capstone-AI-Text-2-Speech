
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi
uri = "mongodb+srv://seniordesignusername:123password123@seniordesigncluster.zhtgtmr.mongodb.net/?retryWrites=true&w=majority"

# Create a new client and connect to the server
from dotenv import load_dotenv
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