import sys
import os
import re
import wave
import ffmpy

current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(parent)

from tortoise_tts_main import calltortoise
from tortoise_tts_main.tortoise.api import TextToSpeech
import json

# https://en.wikipedia.org/wiki/Most_common_words_in_English

savepath = r"tortoise_tts_main/klpsst_addon/pregenerated/"
unseensavepath = r"tortoise_tts_main/klpsst_addon/tmp/"
mostcommonwordspath = r"tortoise_tts_main/mostcommonwords.txt"
curvocab = r"tortoise_tts_main/klpsst_addon/pregenerated.json"

class PregenerateVocab():
    vocab = {}
    name = "angie"
    firstrun = False
    tts = None

    def __init__(self):
        self.tts = TextToSpeech()
        
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
        for word in self.vocab:
            print(word)
            if word in self.vocab:
                continue
            calltortoise.generate_voice_tortoise("angie", word, self.tts, savepath+word+".wav", preset="ultra_ultra_fast")
    
    def input_vocab(self, vocabstr):
        if vocabstr in self.vocab:
            return
        calltortoise.generate_voice_tortoise("angie", vocabstr, self.tts, savepath+vocabstr+".wav", preset="ultra_ultra_fast")
        
    
    def run_sentence(self, sentence_str):
        alphanum_str = re.sub(r'\W\'+', ' ', sentence_str)

        str_split = alphanum_str.lower().split()

        data= []
        outfile = "generated_" + self.name + ".wav"
        for word in str_split:
            nextpath = "tortoise_tts_main/klpsst_addon/pregenerated/" + word + ".wav"
            if os.path.exists(nextpath):
                w = wave.open(nextpath, 'rb')
                data.append( [w.getparams(), w.readframes(w.getnframes())] )
                w.close()
            elif os.path.exists(unseensavepath + word + ".wav"):
                w = wave.open(unseensavepath + word + ".wav", 'rb')
                data.append( [w.getparams(), w.readframes(w.getnframes())] )
                w.close()
            else:
                newpath = unseensavepath + word + ".wav"
                calltortoise.generate_voice_tortoise("angie", word, self.tts, newpath, preset="ultra_ultra_fast")
                # can reduce the jankiness here

                w = wave.open(newpath, 'rb')
                data.append( [w.getparams(), w.readframes(w.getnframes())] )
                w.close()

        output = wave.open(outfile, 'wb')
        output.setparams(data[0][0])
        for i in range(len(data)):
            output.writeframes(data[i][1])
        output.close()

        ff = ffmpy.FFmpeg(inputs={outfile: None}, outputs={"out_faster.wav": ["-filter:a", "atempo=1.5"]})
        ff.run()

    
