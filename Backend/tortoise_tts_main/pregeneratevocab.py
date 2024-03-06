import sys
import os
import subprocess
import re
import wave
import ffmpy
import random
import numpy
from pydub import AudioSegment

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
    outfastpath = r"out_faster.wav"

    def __init__(self):
        self.tts = TextToSpeech(use_deepspeed=True, half=True)
        
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
            newpath = self.pregensavepath + self.name + "/" + word + ".wav"

            if not os.path.exists(newpath):
                calltortoise.generate_voice_tortoise(self.name, word + " ", self.tts, self.temppath, preset="ultra_fast")

                subprocess.run("ffmpeg -i " + self.temppath + " -af silenceremove=start_periods=1:start_silence=0.1:start_threshold=-40dB,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-40dB,areverse " + newpath)
                # os.remove(temppath)
    
    # untested
    def input_vocab(self, vocabstr):
        if vocabstr in self.vocab:
            return
        calltortoise.generate_voice_tortoise(self.name, vocabstr, self.tts, self.temppath, preset=self.preset)
        newpath = self.pregensavepath + vocabstr + ".wav"
        # can reduce the jankiness here

        subprocess.run("ffmpeg -i " + self.temppath + " -af silenceremove=start_periods=1:start_silence=0.1:start_threshold=-40dB,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-40dB,areverse " + newpath)
        # os.remove(temppath)
    
    def change_speed_and_pitch(self, audio, speed_pitch_map):
        result = AudioSegment.empty()
        position = 0
        for (segment, speed, pitch_shift) in speed_pitch_map:
            segment_audio = audio[position:position + segment]
            # Apply speed change
            segment_audio = segment_audio.speedup(playback_speed=speed)
            # Apply pitch shift
            segment_audio = segment_audio._spawn(segment_audio.raw_data, overrides={
                "frame_rate": int(segment_audio.frame_rate * (2 ** (pitch_shift / 12.0)))
            })
            result += segment_audio
            position += segment
        return result

    def humanize_audio(self, audio_file_path, output_file_path, variance_factor=0.5):
        # Load the audio file
        audio = AudioSegment.from_wav(audio_file_path)

        # Define equalization bands to boost mid-range frequencies
        # Adjust the values according to your preference
        bands = {
            125: 1.25,    # Lower midrange frequencies
            250: 1.5,    # Midrange frequencies
            500: 1.5,    # Midrange frequencies
            1000: 1,   # Midrange frequencies
        }

        if bands is not None:
            for freq, gain in bands.items():
                audio = audio + gain

        # Apply random volume adjustment within a range
        volume_adjustment = random.uniform(1 - variance_factor, 1 + variance_factor)
        audio = audio.apply_gain(volume_adjustment * 2)

        # rate=0.5
        # depth=0.5

        # # Convert audio to raw numpy array
        # samples = numpy.array(audio.get_array_of_samples())
        # # Time array
        # t = numpy.arange(len(samples)) / audio.frame_rate
        # # Create random modulation signal
        # random_modulation = numpy.random.randn(len(samples))

        speed_pitch_map = [
            (500, 1.3, 2),   # Speed up the first 0.5 seconds by 50%
            (500, 0.8, -1),  # Slow down the next 0.5 seconds by 20%
            (500, 1.15, 1),    # Speed up the next 0.5 seconds by 20%
            (500, 1.3, -2),   # Speed up the first 0.5 seconds by 50%
            (500, 0.8, -3),  # Slow down the next 0.5 seconds by 20%
            (500, 1.2, 1),    # Speed up the next 0.5 seconds by 20%
            (500, 1.1, 2),   # Speed up the first 0.5 seconds by 50%
            (500, 0.8, 2.1),  # Slow down the next 0.5 seconds by 20%
            (500, 1.2, 1.7),    # Speed up the next 0.5 seconds by 20%
            (500, 1.3, 0),   # Speed up the first 0.5 seconds by 50%
            (500, 1.3, -1),   # Speed up the first 0.5 seconds by 50%
        ]
        
        audio = self.change_speed_and_pitch(audio, speed_pitch_map)

        # is the numpy.sin too small (wavelength is not big enough)
        # modulated_samples = (numpy.array(audio.get_array_of_samples())) * (numpy.sin(0.01 * rate * t * (1 + depth * random_modulation)) * 0.5 + 0.75)

        # audio = AudioSegment(
        #     data=modulated_samples.astype(samples.dtype).tobytes(),
        #     sample_width=audio.sample_width,
        #     frame_rate=audio.frame_rate,
        #     channels=audio.channels
        # )
        # Export the humanized audio
        audio.export(output_file_path, format="wav")

    def run_sentence(self, sentence_str):
        alphanum_str = re.sub(r'\W+', ' ', sentence_str)

        str_split = alphanum_str.lower().split()

        data= []
        self.pregensavepath = r"tortoise_tts_main/klpsst_addon/pregenerated/" + self.name + "/"
        outfile = "generated_" + self.name + ".wav"
        for word in str_split:
            nextpath = self.pregensavepath + word + ".wav"
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

                subprocess.run("ffmpeg -i " + self.temppath + " -af silenceremove=start_periods=1:start_silence=0.1:start_threshold=-40dB,areverse,silenceremove=start_periods=1:start_silence=0.1:start_threshold=-40dB,areverse " + newpath)
                w = wave.open(newpath, 'rb')
                data.append( [w.getparams(), w.readframes(w.getnframes())] )
                w.close()
                
                # os.remove(temppath)

        output = wave.open(outfile, 'wb')
        output.setparams(data[0][0])
        for i in range(len(data)):
            output.writeframes(data[i][1])
        output.close()

        ff = ffmpy.FFmpeg(inputs={outfile: None}, outputs={self.outfastpath: ["-filter:a", "atempo=1.3"]})
        ff.run()

        self.humanize_audio(self.outfastpath, "nextout.wav")

    
