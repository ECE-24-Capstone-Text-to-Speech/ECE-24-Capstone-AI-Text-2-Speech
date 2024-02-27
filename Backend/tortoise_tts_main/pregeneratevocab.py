import sys
import os
import subprocess
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

class PregenerateVocab():
    vocab = {}
    name = "angie"
    firstrun = False
    tts = None
    preset = "ultra_ultra_fast"

    pregensavepath = r"tortoise_tts_main/klpsst_addon/pregenerated/"
    tmpsavepath = r"tortoise_tts_main/klpsst_addon/tmp/"
    temppath = tmpsavepath + "word_temp.wav"
    mostcommonwordspath = r"tortoise_tts_main/mostcommonwords.txt"
    curvocab = r"tortoise_tts_main/klpsst_addon/pregenerated.json"

    def __init__(self):
        self.tts = TextToSpeech(use_deepspeed=True, kv_cache=True, half=True)
        
        print("in __init__\n")
        if self.firstrun:
            with open(self.mostcommonwordspath, 'r') as f:
                allwords = f.read()
            common_words_list = allwords.split()
            self.vocab = set(common_words_list)
        else:
            with open(self.curvocab, 'r') as f:
                curvocabdict = json.load(f)
            self.vocab = curvocabdict

    def setname(self, strname):
        self.name = strname

    def putvocabinjson(self):
        jsonstart = {}
        for word in self.vocab:
            jsonstart[word] = {"last_used": 0, "location": self.pregensavepath+word+".wav"}

        with open(self.curvocab, 'w') as f:
            json.dump(jsonstart, f, indent=4)

    def generatestartervocab(self):
        for word in self.vocab:
            print(word)

            calltortoise.generate_voice_tortoise(self.name, word, self.tts, self.temppath, preset="fast")

            newpath = self.pregensavepath + self.name + "/" + word + ".wav"
            # can reduce the jankiness here

            subprocess.run("ffmpeg -i " + self.temppath + " -af silenceremove=start_periods=1:start_silence=0.1:start_threshold=-20dB,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-40dB,areverse " + newpath)
            # os.remove(temppath)
    
    # untested
    def input_vocab(self, vocabstr):
        if vocabstr in self.vocab:
            return
        calltortoise.generate_voice_tortoise(self.name, vocabstr, self.tts, self.temppath, preset=self.preset)
        newpath = self.pregensavepath + vocabstr + ".wav"
        # can reduce the jankiness here

        subprocess.run("ffmpeg -i " + self.temppath + " -af silenceremove=start_periods=1:start_silence=0.1:start_threshold=-20dB,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-40dB,areverse " + newpath)
        # os.remove(temppath)
    
    def run_sentence(self, sentence_str):
        alphanum_str = re.sub(r'\W+', ' ', sentence_str)

        str_split = alphanum_str.lower().split()

        data= []
        outfile = "generated_" + self.name + ".wav"
        for word in str_split:
            nextpath = "tortoise_tts_main/klpsst_addon/pregenerated/" + word + ".wav"
            if os.path.exists(nextpath):
                w = wave.open(nextpath, 'rb')
                data.append( [w.getparams(), w.readframes(w.getnframes())] )
                w.close()
            elif os.path.exists(self.tmpsavepath + word + ".wav"):
                w = wave.open(self.tmpsavepath + word + ".wav", 'rb')
                data.append( [w.getparams(), w.readframes(w.getnframes())] )
                w.close()
            else:
                newpath = self.tmpsavepath + word + ".wav"
                calltortoise.generate_voice_tortoise(self.name, word, self.tts, self.temppath, preset=self.preset)
                # can reduce the jankiness here

                subprocess.run("ffmpeg -i " + self.temppath + " -af silenceremove=start_periods=1:start_silence=0.1:start_threshold=-20dB,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-40dB,areverse " + newpath)
                w = wave.open(newpath, 'rb')
                data.append( [w.getparams(), w.readframes(w.getnframes())] )
                w.close()
                
                # os.remove(temppath)

        output = wave.open(outfile, 'wb')
        output.setparams(data[0][0])
        for i in range(len(data)):
            output.writeframes(data[i][1])
        output.close()

        ff = ffmpy.FFmpeg(inputs={outfile: None}, outputs={"out_faster.wav": ["-filter:a", "atempo=1.5"]})
        ff.run()

    
