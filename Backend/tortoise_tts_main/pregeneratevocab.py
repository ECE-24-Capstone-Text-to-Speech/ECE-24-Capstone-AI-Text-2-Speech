import sys
import os

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from tortoise_tts_main import calltortoise
from tortoise_tts_main.tortoise.api import TextToSpeech
import json

# https://en.wikipedia.org/wiki/Most_common_words_in_English

savepath = r"tortoise_tts_main/klpsst_addon/pregenerated/"
mostcommonwordspath = r"tortoise_tts_main/mostcommonwords.txt"
curvocab = r"tortoise_tts_main/klpsst_addon/pregenerated.json"
class PregenerateVocab():
    vocab = {}
    name = "angie"
    firstrun = True

    def __init__(self):
        print("in __init__\n")
        if self.firstrun:
            with open(mostcommonwordspath, 'r') as f:
                allwords = f.read()
            common_words_list = allwords.split()
            self.vocab = set(common_words_list)
        else:
            with open(curvocab, 'r') as f:
                curvocabdict = json.load(f)
            self.vocab = curvocabdict

    def setname(self, strname):
        self.name = strname

    def putvocabinjson(self):
        jsonstart = {}
        for word in self.vocab:
            jsonstart[word] = {"last_used": 0, "location": savepath+word+".wav"}

        with open(curvocab, 'w') as f:
            json.dump(jsonstart, f, indent=4)

    def generatestartervocab(self):
        tts = TextToSpeech()

        for word in self.vocab:
            print(word)
            calltortoise.generate_voice_tortoise("angie", word, tts, savepath+word+".wav", preset="ultra_ultra_fast")

