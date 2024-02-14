import calltortoise
import os
import shutil
from tortoise.api import TextToSpeech

# folder_name = "./otherorigin_audio_clips/"
# listoffiles = os.listdir(folder_name)

# for file in listoffiles:
# print(file)

# shutil.move(folder_name + file, "C:/SeniorDesign/ECE-24-Capstone-AI-Text-2-Speech/Backend/tortoise/voices/otherorigin_audio_clips")
# This will download all the models used by Tortoise from the HuggingFace hub.
tts = TextToSpeech()

# calltortoise.generate_voice_tortoise("angie", "Sounds good. Let me know if you need anything else", preset="ultra_ultra_fast")
calltortoise.generate_voice_tortoise("angie", "Sounds", tts, preset="ultra_ultra_fast")
calltortoise.generate_voice_tortoise("angie", "good.", tts, preset="ultra_ultra_fast")
calltortoise.generate_voice_tortoise("angie", "Let", tts, preset="ultra_ultra_fast")
calltortoise.generate_voice_tortoise("angie", "Me", tts, preset="ultra_ultra_fast")
calltortoise.generate_voice_tortoise("angie", "Know", tts, preset="ultra_ultra_fast")
calltortoise.generate_voice_tortoise("angie", "if", tts, preset="ultra_ultra_fast")
calltortoise.generate_voice_tortoise("angie", "you", tts, preset="ultra_ultra_fast")
calltortoise.generate_voice_tortoise("angie", "need", tts, preset="ultra_ultra_fast")
calltortoise.generate_voice_tortoise("angie", "anything", tts, preset="ultra_ultra_fast")
calltortoise.generate_voice_tortoise("angie", "else", tts, preset="ultra_ultra_fast")
    
# shutil.move("C:/SeniorDesign/ECE-24-Capstone-AI-Text-2-Speech/Backend/tortoise/voices/otherorigin_audio_clips", folder_name + file)