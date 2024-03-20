from tortoise_tts.calltortoise import generate_voice_tortoise
import os
import shutil

# folder_name = "./otherorigin_audio_clips/"
# listoffiles = os.listdir(folder_name)

# for file in listoffiles:
    # print(file)
    
    # shutil.move(folder_name + file, "C:/SeniorDesign/ECE-24-Capstone-AI-Text-2-Speech/Backend/tortoise/voices/otherorigin_audio_clips")
    
generate_voice_tortoise("angie", "Hello. THis is Angie's second A.I. voice. Nice to meet you!")
    
    # shutil.move("C:/SeniorDesign/ECE-24-Capstone-AI-Text-2-Speech/Backend/tortoise/voices/otherorigin_audio_clips", folder_name + file)