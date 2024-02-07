# Imports used through the rest of the notebook.
import torch
import torchaudio
import torch.nn as nn
import torch.nn.functional as F
import os

# import IPython

from tortoise.api import TextToSpeech
from tortoise.utils.audio import load_audio, load_voice, load_voices

# LC: need custom_voice_name_backend to be potentially unique, dependent on source
# we want that folder to be deleted whenever users get off our server
  
def generate_voice_tortoise(custom_voice_name_backend, sentence_string):
  # This will download all the models used by Tortoise from the HuggingFace hub.
  tts = TextToSpeech()

  # Pick a "preset mode" to determine quality. Options: {"ultra_fast", "fast" (default), "standard", "high_quality"}. See docs in api.py
  preset = "fast"

  # Optionally, upload use your own voice by running the next two cells. I recommend
  # you upload at least 2 audio clips. They must be a WAV file, 6-10 seconds long.

  CUSTOM_VOICE_NAME = custom_voice_name_backend

  # Generate speech with the custotm voice.
  voice_samples, conditioning_latents = load_voice(CUSTOM_VOICE_NAME)
  gen = tts.tts_with_preset(sentence_string, CUSTOM_VOICE_NAME, preset=preset, voice_samples=voice_samples, 
                            conditioning_latents=conditioning_latents)
  
  torchaudio.save(f'generated-{CUSTOM_VOICE_NAME}.wav', gen.squeeze(0).cpu(), 24000)
  # IPython.display.Audio(f'generated-{CUSTOM_VOICE_NAME}.wav')