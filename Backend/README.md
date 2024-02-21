# Backend
Download docker desktop. Then cd into `Backend` folder and run `bash ./start.sh` or `bash ./run.sh` to start server


# Tortoise
Go to your Docker file, located in the Backend folder

1. FOR NON_NVIDIA people comment out lines 2 and 28-29, then uncomment  lines 8 and 32-33
2. NVIDIA keep lines 2 and 28-29 uncommented, make sure lines 8 and 32-33 are commented out 

# If you're Powershell then run
cd into Backend and run the code with ./ps.ps1, 

# If you're Sachin then run 
cd into Backend and run the code with `bash ./test.sh`


## Line 184 start_tortoise function
for backend/frontend team, please integrate this on y'alls side. It works on docker docs, below are some instructions to do. Make line 191 (text) into an input you get from frontend. Lines 217 calls a voice from tortoise_tts/tortoise/voices. for example the john folder (for testing purposes) is located at tortoise_tts/tortoise/voices/john. You can try changing the load_voice function which is in tortoise_tts/tortoise/utils/audio and change the directory to a folder that your backend is already using or you can use the load_voice function, delete all the given voices, and then make a backend function to create the user voice folders in that directory. Up to you, whatever is easiest. 

optional: correct lines 204-205 so line 213 correctly prints out the folder location for testing purposes. 
